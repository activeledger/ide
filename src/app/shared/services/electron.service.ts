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

import { Injectable } from "@angular/core";

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote, shell } from "electron";
import * as childProcess from "child_process";
import * as fs from "fs";
import * as eventEmitter from "events";
import { ActiveCrypto } from "@activeledger/activecrypto";
import PouchDB from "pouchdb-browser";
import * as path from "path";
import * as url from "url";
import { faWindowRestore } from "@fortawesome/free-solid-svg-icons";
import * as sshpk from "sshpk";
// import NodeSSH from "node-ssh";
import { Client } from "ssh2";

@Injectable()
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  shell: typeof shell;
  childProcess: typeof childProcess;
  fs: typeof fs;
  activeCrypto: typeof ActiveCrypto;
  pouchdb: typeof PouchDB;
  eventEmitter: typeof eventEmitter;
  path: typeof path;
  url: typeof url;
  sshpk: typeof sshpk;
  ssh: typeof Client;

  /**
   * Creates an instance of ElectronService.
   * @memberof ElectronService
   */
  constructor() {
    // Conditional imports
    if (this.isElectron) {
      console.log("Running requires");
      this.ipcRenderer = window.require("electron").ipcRenderer;
      this.webFrame = window.require("electron").webFrame;
      this.remote = window.require("electron").remote;
      this.shell = window.require("electron").shell;

      this.childProcess = window.require("child_process");
      this.fs = window.require("fs");
      this.eventEmitter = window.require("events");

      this.activeCrypto = window.require(
        "@activeledger/activecrypto"
      ).ActiveCrypto;

      this.pouchdb = window.require("pouchdb-browser");
      this.pouchdb.plugin(window.require("pouchdb-find"));

      this.path = window.require("path");
      this.url = window.require("url");
      this.sshpk = window.require("sshpk");
      this.ssh = window.require("ssh2").Client;
    }
  }

  /**
   * Returns true if the application is running in electron
   *
   * @readonly
   * @memberof ElectronService
   */
  get isElectron() {
    return !!(window && window.process && window.process.type);
  }

  /**
   * Returns true is the application is being run in development mode.
   * I.e npm start
   *
   * @readonly
   * @memberof ElectronService
   */
  get isDev() {
    return !this.remote.app.isPackaged;
  }

  /**
   * Returns true if the OS is detected to be Mac
   *
   * @readonly
   * @memberof ElectronService
   */
  get isMac() {
    return window.process.platform === "darwin";
  }

  /**
   * Attempts to restart the application
   * Not yet working on mac
   *
   * @memberof ElectronService
   */
  public restart() {
    if (!this.isDev) {
      // Window : process.env.PORTABLE_EXECUTABLE_DIR
      // Linux : process.env.APPIMAGE
      if (window.process.env.PORTABLE_EXECUTABLE_FILE) {
        this.remote.app.relaunch({
          execPath: window.process.env.PORTABLE_EXECUTABLE_FILE,
        });
      } else if (window.process.env.APPIMAGE) {
        this.remote.app.relaunch({
          execPath: window.process.env.APPIMAGE,
        });
      }
    } else {
      this.remote.app.relaunch();
    }
    this.remote.app.quit();
  }

  /**
   * Opens a link in an external browser window
   *
   * @param {string} urlToOpen
   * @memberof ElectronService
   */
  public openInBrowser(urlToOpen: string) {
    this.shell.openExternal(urlToOpen);
  }
}
