/*
 * MIT License (MIT)
 * Copyright (c) 2018 Activeledger
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {
  app,
  BrowserWindow,
  screen,
  Menu,
  MenuItemConstructorOptions,
  MenuItem,
} from "electron";
import * as path from "path";
import * as url from "url";

let win, serve, splashScreen;
const args = process.argv.slice(1);
serve = args.some((val) => val === "--serve");

try {
  require("dotenv").config();
} catch {
  console.log("asar");
}

function createWindow() {
  const electronScreen = screen;
  // const size = electronScreen.getPrimaryDisplay().workAreaSize;
  const size = {
    width: 1420,
    height: 840,
  };

  splashScreen = new BrowserWindow({
    // x: 0,
    // y: 0,
    width: 500,
    height: 400,
    frame: false,
    // icon: __dirname + "/src/desktopIcon.png"
    icon: __dirname + "/src/assets/al-icon.png",
  });

  splashScreen.loadFile("splashscreen.html");

  // Create the browser window.
  win = new BrowserWindow({
    minWidth: 1420,
    minHeight: 510,
    width: size.width,
    height: size.height,
    webPreferences: {
      webviewTag: true,
      webSecurity: false,
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      allowRunningInsecureContent: serve ? true : false,
      enableRemoteModule: true,
    },
    frame: false,
    // icon: __dirname + "/src/desktopIcon.png",
    icon: __dirname + "/src/assets/al-icon.png",
    show: false,
  });

  // win.setMenu(null);

  // If on MAC we need to add this menu to allow keyboard shortcuts
  if (process.platform === "darwin") {
    const template: MenuItemConstructorOptions[] = [
      {
        label: app.getName(),
        submenu: [
          {
            label: "About Activeledger IDE",
          },
          {
            type: "separator",
          },
          {
            label: "Quit",
            accelerator: "Command+Q",
            click: function () {
              app.quit();
            },
          },
        ],
      },
      {
        label: "Edit",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { type: "separator" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
          { role: "pasteAndMatchStyle" },
          { role: "delete" },
          { role: "selectAll" },
        ],
      },
    ];
    const menu = Menu.buildFromTemplate(template);

    Menu.setApplicationMenu(menu);
  }

  if (serve) {
    require("electron-reload")(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`),
    });

    win.loadURL("http://localhost:4201");
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "dist/index.html"),
        protocol: "file:",
        slashes: true,
      })
    );
  }

  win.once("ready-to-show", () => {
    splashScreen.destroy();
    win.show();
    win.maximize();
    if (process.mainModule.filename.indexOf("app.asar") === -1) {
      win.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  app.allowRendererProcessReuse = true;

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on("ready", createWindow);

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}
