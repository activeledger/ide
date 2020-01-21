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
import { VERSION } from "../../../environments/version";
import { DatabaseService } from "../../providers/database.service";
import { GeneralSettingsData } from "../structures/settings.structures";

// TODO: Make this a static

@Injectable()
export class GeneralService {
  /**
   * Holds the set version number
   *
   * @private
   * @memberof GeneralService
   */
  private _version = VERSION.version;

  /**
   * Creates an instance of GeneralService.
   * @param {DatabaseService} dbService
   * @memberof GeneralService
   */
  constructor(private dbService: DatabaseService) {}

  /**
   * Returns the version
   *
   * @readonly
   * @type {string}
   * @memberof GeneralService
   */
  get version(): string {
    return this._version;
  }

  /**
   * For swap algorithm to reverse arrays as fast as possible
   *
   * @private
   * @param {Array<any>} array
   * @returns {Array<any>}
   * @memberof GeneralService
   */
  public reverseArray(array: Array<any>): Array<any> {
    let left = null;
    let right = null;
    const length = array.length;

    for (left = 0, right = length - 1; left < right; left += 1, right -= 1) {
      const temporary = array[left];
      array[left] = array[right];
      array[right] = temporary;
    }

    return array;
  }

  /**
   * Cehck if a string is base64 or not
   *
   * @param {string} value
   * @returns {boolean}
   * @memberof GeneralService
   */
  public isb64(value: string): boolean {
    try {
      return btoa(atob(value)) === value;
    } catch (e) {
      return false;
    }
  }

  /**
   * Set accents
   *
   * @param {boolean} [retry]
   * @memberof GeneralService
   */
  public setAccent(retry?: boolean): void {
    this.getGeneralData()
      .then((data: GeneralSettingsData) => {
        (document.styleSheets[0] as any).deleteRule(2);
        (document.styleSheets[0] as any).deleteRule(3);
        (document.styleSheets[0] as any).deleteRule(4);

        if (data) {
          (document.styleSheets[0] as any).insertRule(
            `.accent {background-color: ${data.apperance.accent} !important}`,
            2
          );
          (document.styleSheets[0] as any).insertRule(
            `.accent-hover:hover {background-color: ${data.apperance.accentHover}}`,
            3
          );
          (document.styleSheets[0] as any).insertRule(
            `.accentFont-hover:hover {color: ${data.apperance.accentHover}}`,
            4
          );
        } else {
          (document.styleSheets[0] as any).insertRule(
            `.accent {background-color: #6e49ff}`,
            2
          );
          (document.styleSheets[0] as any).insertRule(
            `.accent-hover:hover {background-color: #5a3bd6}`,
            3
          );
          (document.styleSheets[0] as any).insertRule(
            `.accentFont-hover:hover {color: #5a3bd6}`,
            4
          );
        }
      })
      .catch((err: any) => {
        // if (!retry) {
        //   console.log("TEMP FIX");
        //   setTimeout(() => {
        //     console.log(err);
        //     this.setAccent(true);
        //     console.log("END TEMP FIX");
        //   }, 500);
        // }
      });
  }

  /**
   * Get stored general data
   *
   * @returns {Promise<GeneralSettingsData>}
   * @memberof GeneralService
   */
  public getGeneralData(): Promise<GeneralSettingsData> {
    return new Promise((resolve, reject) => {
      this.dbService
        .findById("general")
        .then((docs: Array<GeneralSettingsData>) => {
          resolve(docs[0]);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /**
   * Set the stored general data
   *
   * @param {GeneralSettingsData} newData
   * @returns {Promise<void>}
   * @memberof GeneralService
   */
  public setGeneralData(newData: GeneralSettingsData): Promise<void> {
    return new Promise((resolve, reject) => {
      this.dbService
        .update(newData)
        .then(() => {
          this.setAccent();
          resolve();
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
}
