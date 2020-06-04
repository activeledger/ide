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
  providedIn: "root",
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
  public async getSaveLocation(): Promise<void> {
    const dialog = this.electron.remote.dialog;

    try {
      const dialogResp = await dialog.showSaveDialog(null, {
        filters: [
          {
            name: "TypeScript",
            extensions: ["ts"],
          },
        ],
      });

      if (dialogResp.canceled) {
        return;
      }

      if (dialogResp.filePath) {
        this.fileLocation = dialogResp.filePath;
      } else {
        throw new Error("Unable to get file path");
      }
    } catch (error) {
      throw error;
    }
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
      this.electron.fs.writeFile(this.fileLocation, data, (err) => {
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
  public async getOpenLocation(): Promise<void> {
    const dialog = this.electron.remote.dialog;

    try {
      const dialogResp = await dialog.showOpenDialog(null, {
        filters: [
          {
            name: "TypeScript",
            extensions: ["ts"],
          },
        ],
      });

      if (dialogResp.canceled) {
        return;
      }

      if (dialogResp.filePaths && dialogResp.filePaths.length > 0) {
        this.fileLocation = dialogResp.filePaths[0];
      } else {
        throw new Error("No file paths found.");
      }
    } catch (error) {
      throw error;
    }
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
