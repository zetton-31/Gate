"use strict";

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const Menu = electron.Menu;
const url = require('url');
const path = require('path');
const menuTemplate = require('./main-menu');
const menuForOpening = [{
  label: 'Window',
  submenu: [
    {role: 'minimize'},
    {role: 'close'},
    {
      label: 'Open Window',
      accelerator: 'CmdOrCtrl+0',
      enabled: false,
    }
  ]
}];
const menuForClosing = [{
  label: 'Window',
  submenu: [
    {role: 'minimize'},
    {role: 'close'},
    {
      label: 'Open Window',
      accelerator: 'CmdOrCtrl+0',
      enabled: true,
      click: function() {
        if (mainWindow === null) {
          createWindow();
        }
      }
    }
  ]
}];
let menuTemplateForOpening = menuTemplate.concat(menuForOpening);
let menuTemplateForClosing = menuTemplate.concat(menuForClosing);
let mainWindow;
let menu;

const createWindow = () => {
  menu = Menu.buildFromTemplate(menuTemplateForOpening);
  Menu.setApplicationMenu(menu);
  mainWindow = new BrowserWindow({
    width: 790,
    height:100,
    backgroundcolor: '#2b2e3b',
    frame: true,
    titleBarStyle: 'hidden',
    transparent: false
  });

  mainWindow.focus();

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.setPosition(35,45);

  mainWindow.on('closed', ()=> {
    mainWindow = null;
  });
}

const windowClose = () => {
  mainWindow.close();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  menu = Menu.buildFromTemplate(menuTemplateForClosing);
  Menu.setApplicationMenu(menu);
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('esc_key_down', function() {
  windowClose();
});

ipcMain.on('window_close', function() {
  windowClose();
});

ipcMain.on('window_minimize', function() {
  mainWindow.minimize();
});
