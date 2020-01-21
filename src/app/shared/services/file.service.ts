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
import { ElectronService } from "./electron.service";

/**
 * Handles file operations
 *
 * @export
 * @class FileService
 */
@Injectable({
  providedIn: "root"
})
export class FileService {
  /**
   * The file location
   *
   * @private
   * @type {string}
   * @memberof FileService
   */
  private fileLocation: string;

  /**
   * Creates an instance of FileService.
   * @param {ElectronService} electron
   * @memberof FileService
   */
  constructor(private electron: ElectronService) {}

  // #region Save
  /**
   * Request a save location from the user
   *
   * @returns {Promise<void>}
   * @memberof FileService
   */
  public getSaveLocation(): Promise<void> {
    return new Promise((resolve, reject) => {
      const dialog = this.electron.remote.dialog;

      this.fileLocation = dialog.showSaveDialog(
        {
          filters: [
            {
              name: "TypeScript",
              extensions: ["ts"]
            }
          ]
        },
        (filename: string) => {
          if (filename) {
            this.fileLocation = filename;
            resolve();
          } else {
            reject("Error saving to this location.");
          }
        }
      );
    });
  }

  /**
   * Save a file
   *
   * @param {*} data
   * @returns {Promise<void>}
   * @memberof FileService
   */
  public save(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.electron.fs.writeFile(this.fileLocation, data, err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }
  // #endregion

  // #region Open
  /**
   * Get the path of the file to be opened
   *
   * @returns {Promise<void>}
   * @memberof FileService
   */
  public getOpenLocation(): Promise<void> {
    return new Promise((resolve, reject) => {
      const dialog = this.electron.remote.dialog;

      dialog.showOpenDialog(
        {
          filters: [
            {
              name: "TypeScript",
              extensions: ["ts"]
            }
          ]
        },
        (filepaths: string[]) => {
          if (filepaths[0]) {
            this.fileLocation = filepaths[0];
            resolve();
          } else {
            reject("Error saving to this location.");
          }
        }
      );
    });
  }

  /**
   * Open the file from te specified location
   *
   * @returns {Promise<unknown>}
   * @memberof FileService
   */
  public open(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.electron.fs.readFile(this.fileLocation, "utf-8", (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }
  // #endregion
}
