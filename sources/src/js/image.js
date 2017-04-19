const Filer = require('./filer');

class Image extends Filer{

  constructor() {
    super();
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
      length: filelist.length - 1,
      position: position - 1,
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
}

module.exports = Image;
