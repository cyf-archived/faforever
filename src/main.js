// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain, Tray } = require('electron');
const path = require('path');
const localShortcut = require('electron-localshortcut');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let appTray;
let downloadId;
let cachePath;

function createWindow() {
  //系统托盘图标目录
  const trayIcon = path.join(__dirname, 'yjtp16.png');
  appTray = new Tray(trayIcon);

  //设置此托盘图标的悬停提示内容
  appTray.setToolTip('FA FOREVER');

  appTray.on('click', () => {
    //我们这里模拟桌面程序点击通知区图标实现打开关闭应用的功能
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 900,
    frame: false,
    titleBarStyle: 'customButtonsOnHover',
    webPreferences: {
      webSecurity: false,
      allowDisplayingInsecureContent: true,
      allowRunningInsecureContent: true,
    },
  });

  if (process.env.FA_NODE_ENV === 'dev') {
    mainWindow.loadURL(`http://localhost:8000/`);
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(`http://cdn.eqistu.cn/faforever13/index.html?t=${new Date().valueOf()}`);
  }
  // and load the index.html of the app.

  if (process.platform === 'darwin') {
    console.log('process.platform', process.platform);
    let contents = mainWindow.webContents;
    localShortcut.register(mainWindow, 'CommandOrControl+A', () => {
      contents.selectAll();
    });

    localShortcut.register(mainWindow, 'CommandOrControl+C', () => {
      contents.copy();
    });

    localShortcut.register(mainWindow, 'CommandOrControl+V', () => {
      contents.paste();
    });

    localShortcut.register(mainWindow, 'CommandOrControl+X', () => {
      contents.cut();
    });
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate([]));

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    appTray = null;
  });

  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    //设置文件存放位置
    let savepath = path.join(app.getAppPath(), `../cache/${downloadId}.mp3`);
    if (cachePath) {
      savepath = path.join(cachePath, `${downloadId}.mp3`);
    }
    item.setSavePath(savepath);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//登录窗口最小化
ipcMain.on('window-min', function() {
  mainWindow.hide();
});

ipcMain.on('window-close', function() {
  app.quit();
});

ipcMain.on('cache', (evt, url, id) => {
  downloadId = id;
  mainWindow.webContents.downloadURL(url);
});

ipcMain.on('cache-path', (evt, url) => {
  cachePath = url;
});

ipcMain.on('set-lrc', (evt, lrc) => {
  appTray.setTitle(lrc);
});
