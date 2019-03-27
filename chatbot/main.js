const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;
const path = require('path');
const url = require('url');
const fs = require('fs');
const axios = require('axios');
const FB = require('fb');
const FBManager = require('./main/fbmanager');
const fbManager = new FBManager(app,axios,path,fs,FB);

let win;
let locale;

function createAuthWindow() {
  fbManager.login(win,BrowserWindow);
};

function createLoginWindow() {
  const {width,height}= electron.screen.getPrimaryDisplay().workAreaSize;
  locale = app.getLocale();
  const webPreference = {
    affinity:true
  };

  // Create the browser window.
  win = new BrowserWindow({
    width: width/2>600? width/2 : 600,
    minWidth:width/2>600? width/2 : 600,
    height: height/2>600? height/2 : 600,
    minHeight:height/2>600? height/2 : 600,
    resizable:false,
    fullscreenable:false,
    fullscreenWindowTitle:false,
    webPreferences:webPreference
  });

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'login.html'),
    protocol: 'file:',
    slashes: true
  }));
  win.webContents.openDevTools();
  win.on('enter-full-screen',(event)=>{
    console.log('win : enter-full-screen');
  });
  win.on('maximize',(event)=>{
    console.log('win : maximize');
  });
  win.on('enter-html-full-screen',(event)=>{
    console.log('win : enter-html-full-screen');
  });
  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    console.log('window closed');
    win = null;
    app.quit();
  });
};

app.on('ready', createLoginWindow);
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    console.log('All Closed');
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    console.log('activate');
    if (win === null) {
        createLoginWindow();
    }
});

ipcMain.on('login',(event,args)=>{
  /**
   * @TODO validation logic
   */
  win.webContents.send('login_success',args);
});
ipcMain.on('fb-authenticate',(event,args)=>{
  /**
   * @TODO validation logic
   */
  createAuthWindow();
});