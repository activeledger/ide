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

import { Component, OnInit } from "@angular/core";
import { DialogService } from "../../../../shared/services/dialog.service";
import { UserService } from "../../../../shared/services/user.service";
import { ElectronService } from "../../../../shared/services/electron.service";
import { ApiService } from "../../../../shared/services/api.service";
import { User } from "../../../../shared/structures/user.structure";
import {
  IUser,
  ILoginData
} from "../../../../shared/interfaces/user.interfaces";

@Component({
  selector: "app-settings-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"]
})
export class AccountComponent implements OnInit {
  // #region UI Data
  /**
   * User holder
   *
   * @type {IUser}
   * @memberof AccountComponent
   */
  public user: IUser = new User();

  /**
   * UI Display controls
   *
   * @memberof AccountComponent
   */
  public setup = {
    loggedIn: false,
    loggingIn: false
  };
  // #endregion

  /**
   * Creates an instance of AccountComponent.
   * @param {DialogService} dialogService
   * @param {UserService} userService
   * @param {ElectronService} electron
   * @param {ApiService} api
   * @memberof AccountComponent
   */
  constructor(
    private dialogService: DialogService,
    private userService: UserService,
    private electron: ElectronService,
    private api: ApiService
  ) {}

  // #region Angular controls
  ngOnInit() {
    this.getUser();
  }
  // #endregion

  // #region UI Functions

  /**
   * Login to the API
   *
   * @memberof AccountComponent
   */
  public login(): void {
    this.dialogService
      .login()
      .then((loginData: ILoginData) => {
        return this.userService.login(loginData);
      })
      .then((user: IUser) => {
        this.setup.loggingIn = false;
        this.setup.loggedIn = true;
        this.user = user;
      })
      .catch((err: unknown) => {
        this.setup.loggingIn = false;
        this.dialogService.error("Login unsuccessful.");
        console.error(err);
      });
  }

  /**
   * Log the user out
   *
   * @memberof AccountComponent
   */
  public logout() {
    this.userService
      .logout()
      .then(() => {
        this.setup.loggedIn = false;
        this.setup.loggingIn = false;
        this.api.logout();
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }

  /**
   * Open the account manager page in the browser
   *
   * @memberof AccountComponent
   */
  public manage(): void {
    this.electron.openInBrowser("https://developers.activeledger.io/");
  }
  // #endregion

  // #region Getters
  /**
   * Get the user data
   *
   * @private
   * @memberof AccountComponent
   */
  private async getUser() {
    const userData: IUser = await this.userService.getUserDatastore();
    if (userData && userData.loggedIn) {
      this.user = userData;
      this.setup.loggedIn = true;
    }
  }
  // #endregion
}
