const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const fs = require('fs-extra');
const os = require('os');
const del = require('del');

const config = require('./config/app.json');
let win = null;
/*
const initConfigPath = './config/init.json';


function generateKey() {
const crypto = require('crypto');
const os = require('os');
const secret = Date();

const text = `${os.hostname()}_${os.arch()}_${os.platform()}`;
return crypto.createHmac('sha256', secret)
.update(text)
.digest('hex');
}


function init() {
try {
fs.statSync(initConfigPath);
} catch (e) {
const json = {
secret: generateKey(),
};

fs.writeFileSync(initConfigPath, JSON.stringify(json, null, ' '));
}
}
*/
function createWindow() {
  // init();
  win = new BrowserWindow(config.main);
  win.loadURL(url.format({
    pathname: `${__dirname}/src/index.html`,
    protocol: 'file:',
    slashes: true,
  }));

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  const osTmpdir = os.tmpdir();
  const tmpdir = `${osTmpdir}/${config.app.suffix}`;
  try {
    fs.removeSync(tmpdir);
  } catch(e) {
    console.log(e);
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

const State = require('./libs/state');
new State(ipcMain);