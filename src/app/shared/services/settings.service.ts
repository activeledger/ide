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
import { DatabaseService } from "../../providers/database.service";
import { MenuState } from "../structures/settings.structures";

/**
 * Handles settings
 *
 * @export
 * @class SettingsService
 */
@Injectable({
  providedIn: "root"
})
export class SettingsService {
  /**
   * Creates an instance of SettingsService.
   * @param {DatabaseService} dbService
   * @memberof SettingsService
   */
  constructor(private dbService: DatabaseService) {}

  // #region Menu state handling
  /**
   * Save the menu state
   *
   * @param {string} state
   * @memberof SettingsService
   */
  public saveMenuStatus(state: string): void {
    // Get the latest state, this will create the state doc if one doesn't exist
    this.checkMenuStateStored()
      .then((exists: boolean) => {
        if (exists) {
          this.updateMenuState(state);
        } else {
          this.createMenuStateDoc(state).catch((err: any) => {
            console.error(err);
          });
        }
      })
      .catch((err: any) => {
        console.log("SaveMenuState: Error checking for menu state");
        console.log(err);
        if (err.status === 404) {
          this.createMenuStateDoc(state).catch((createErr: any) => {
            console.error(createErr);
          });
        }
      });
  }

  /**
   *
   *
   * @returns {Promise<any>}
   * @memberof SettingsService
   */
  public getMenuState(): Promise<any> {
    return new Promise<string>((resolve, reject) => {
      this.checkMenuStateStored()
        .then((exists: boolean) => {
          if (exists) {
            this.getMenuStateDoc()
              .then((stateDoc: MenuState) => {
                resolve(stateDoc.state);
              })
              .catch((err: any) => {
                reject(err);
              });
          } else {
            this.createMenuStateDoc()
              .then(() => {
                resolve("big");
              })
              .catch((err: any) => {
                console.error(err);
              });
          }
        })
        .catch((err: any) => {
          console.log("GetMenuState: Error checking for menu state");
          console.log(err);
          if (err.status === 404) {
            this.createMenuStateDoc()
              .then(() => {
                resolve("big");
              })
              .catch((createErr: any) => {
                return reject(createErr);
              });
          }

          reject(err);
        });
    });
  }

  /**
   * Check if the menu state doc exists
   *
   * @private
   * @returns {Promise<boolean>}
   * @memberof SettingsService
   */
  private checkMenuStateStored(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.dbService
        .findById("menuState")
        .then((stateDoc: any) => {
          if (stateDoc) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /**
   * Get the menu state doc from the database
   *
   * @private
   * @returns {Promise<MenuState>}
   * @memberof SettingsService
   */
  private getMenuStateDoc(): Promise<MenuState> {
    return new Promise((resolve, reject) => {
      this.dbService
        .findById("menuState")
        .then((stateDocs: any) => {
          resolve(stateDocs);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /**
   * Create the menu state doc
   *
   * @private
   * @param {string} [state]
   * @returns {Promise<void>}
   * @memberof SettingsService
   */
  private createMenuStateDoc(state?: string): Promise<MenuState> {
    const newState = new MenuState();
    newState.state = "big";

    if (state) {
      newState.state = state;
    }

    return this.dbService.add<MenuState>(newState);
  }

  /**
   * Update the stored menu state
   *
   * @private
   * @param {string} state
   * @memberof SettingsService
   */
  private updateMenuState(state: string) {
    this.getMenuStateDoc()
      .then((menuState: MenuState) => {
        menuState.state = state;
        this.dbService.update(menuState);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  // #endregion
}
