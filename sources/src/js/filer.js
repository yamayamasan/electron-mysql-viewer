const { dialog } = require('electron').remote;
const { app:config } = require('../../config/app.json');
const fs = require('fs');
const os = require('os');
const _ = require('lodash');
const nodeUnzip = require('unzip2');
const Uuid = require('uuid');
const Binary = require('./binary');
const binary = new Binary({ method: 'hex' });
// const nodeZip = require('node-zip');
// const Winrar = require('winrarjs');
// const {unzip: unzipPromise} = require('zip-unzip-promise');
// const zlib = require('zlib');

class Filer {

  constructor() {
    this.osname = Filer.platform();
    this.delimiterMap = new Map([['win', '\\'], ['linux', '/']]);
    this.delimiter = this.delimiterMap.get(this.osname);
    this.tmpdirpath = this.tmpdir();
    this.imgExtension = new Set(['jpg', 'jpeg', 'png']);
    this.zipExtension = new Set(['zip', 'rar']);
    this.MOVES = new Map([
      ['PREV', -1],['TWO_PREV', -2],['SKIP_PREV', -10],
      ['NEXT', +1],['TWO_NEXT', +2],['SKIP_NEXT', +10]
    ]);
    this.FILE_TYPES = new Map([['dir', 'DIR'], ['img', 'IMG'], ['zip', 'ZIP']]);
  }

  isZip({path}) {
    return this.zipExtension.has(this.parseExt(path));
  }

  readNestDir(path, dirs = []) {
    fs.readdirSync(path).forEach((file, i) => {
      const nestPath = `${path}${this.delimiter}${file}`;
      if (fs.statSync(nestPath).isDirectory()) {
        this.readNestDir(nestPath, dirs);
      } else if(this.imgExtension.has(this.parseExt(nestPath))){
        dirs.push(nestPath);
      }
    });
    return dirs;
  }

  getFileType({path}) {
    const stat = fs.statSync(path);
    if (stat.isDirectory()) {
      return this.FILE_TYPES.get('dir');
    } else if (stat.isFile()) {
      const ext = this.parseExt(path);
      if (this.imgExtension.has(ext)) {
        return this.FILE_TYPES.get('img');
      }
      if (this.zipExtension.has(ext)) {
        return this.FILE_TYPES.get('zip');
      }
    }
    return false;
  }

  dirs({path}) {
    return new Promise(async (resolve, reject) => {
      // とりあえず、1階層分
      const filelist = fs.readdirSync(path).filter((file, i) => {
        const childPath = `${path}${this.delimiter}${file}`;
        return this.imgExtension.has(this.parseExt(childPath));
      });
      const context =  await this.setContext({
        dir: path,
        path: `${path}${this.delimiter}${filelist[0]}`,
        filelist,
        // length: filelist.length - 1,
        length: filelist.length,
        position: 0,
        isFullPath: false,
      });
      console.log('filelist', filelist);
      resolve(context);
    });
  }

  unzip({path}) {
    return new Promise((resolve, reject) => {
      const hash = binary.hash(path);
      const tmpdir = this.tmpdir(hash);
      const rstream = fs.createReadStream(path);
      const zstream = nodeUnzip.Extract({ path: tmpdir });

      zstream.on('close', async () => {
        const filelist = this.readNestDir(tmpdir);
        // const first = filelist[0];
        // const { size } = await this.loadImage(first);
        const context =  await this.setContext({
          dir: tmpdir,
          path: filelist[0],
          filelist,
          // length: filelist.length - 1,
          length: filelist.length,
          position: 0,
          isFullPath: true,
        });
        resolve(context);
        /*
        resolve({
          dir: tmpdir,
          path: first,
          filelist,
          length: filelist.length - 1,
          position: 0,
          size,
          isFullPath: true,
          isVertical: this.isVertical(size),
        });
        */
      });
      rstream.pipe(zstream);
    });

    /*
    const data = fs.readFileSync(path);
    const { files } = new nodeZip(data, {base64: false, checkCRC32: true});
    const datas = [];
    _.forEach(files, (file, i) => {
      datas.push(file);
    });
    console.log(datas)
    return datas;
    */
  }

  async setFile({name, path, type}) {
    // できればasync/awaitなしでいきたい
    // const { size } = await this.loadImage(path);
    const dir = this.parseDir(path);
    const filelist = this.getFilelist(dir);
    const position = filelist.indexOf(path.split(this.delimiter).pop());
    return await this.setContext({
      dir,
      path,
      filelist,
      // length: filelist.length - 1,
      length: filelist.length,
      position: position,
      // size,
      isFullPath: false,
      // isVertical: this.isVertical(size)
    });
    /*
    return {
      dir,
      path,
      filelist,
      length: filelist.length - 1,
      position: position - 1,
      size,
      isFullPath: false,
      isVertical: this.isVertical(size)
    }
    */
  }

  loadImage(path) {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.onload = () => {
          const { width, height} = img;
          resolve({ size: { width, height } });
        }
        img.src = path;
      } catch(e) {
        reject(e);
      }
    });
  }

  async moveFile(move, context) {
    const { position, length, filelist, dir, isFullPath} = context;
    const current = position + this.MOVES.get(move);
    if (current < 0 || current >= length) return null;

    const file = (isFullPath) ? filelist[current] : `${dir}${this.delimiter}${filelist[current]}`;
    /*
    if (context.isFullPath) {
      file = filelist[current];
    } else {
      file = `${dir}/${filelist[current]}`;
    }
    */
    /*
    const { size } = await this.loadImage(file);
    context.position = current;
    context.path = file;
    context.size = size;
    context.isVertical = this.isVertical(size);
    return context;
    */
    return await this.setContext(context, {position: current, path: file})
  }

  async setContext(oContext, nContext = {}) {
    // ここで Object.assign({}, oContext, nContext)
    const context = Object.assign({}, oContext);
    _.forEach(nContext, (v, k) => {
      context[k] = v;
    });
    const { filelist, position, dir, isFullPath } = context;
    const nextPos = position + 1;
    if (filelist[nextPos]) {
      context.next = (isFullPath) ? filelist[nextPos] : `${dir}${this.delimiter}${filelist[nextPos]}`;
    }
    const { size } = await this.loadImage(context.path);
    context.size = size;
    context.isVertical = this.isVertical(size);
    const dirs = fs.readdirSync(dir);
    console.log('context', dir, dirs);
    return context;
  }

  // 縦長か
  isVertical({ height, width }) {
    return height > width;
  }

  // pathからextを取得
  parseExt(path) {
    return path.split('.').pop().toLowerCase();
  }

  getFilelist(dir) {
    const filelist = fs.readdirSync(dir).filter((e) => {
      return fs.statSync(`${dir}/${e}`).isFile() && this.imgExtension.has(this.parseExt(e));
    });
    return filelist;
  }

  parseDir(path) {
    const dir = path.split(this.delimiter).filter((e, i, arr) => {
      return arr.length !== (i + 1);
    }).join(this.delimiter);
    return dir;
  }

  tmpdir(path = null) {
    const osTmpdir = os.tmpdir();
    let tmpdir = `${osTmpdir}${this.delimiter}${config.suffix}`;
    if (path) tmpdir = `${tmpdir}${this.delimiter}${path}`;
    try {
      fs.statSync(tmpdir);
    } catch(e) {
      fs.mkdirSync(tmpdir);
    } finally {
      return tmpdir;
    }
  }

  static platform() {
    const platform = os.platform();
    let osType = null;
    switch(platform) {
      case 'darwin':
      case 'win32':
        osType = 'win';
      break;
      case 'linux':
        osType = 'linux';
      break;
    }
    return osType;
  }
}

module.exports = Filer;
