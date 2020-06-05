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

import { Injectable, Output, EventEmitter, Directive } from "@angular/core";
import { IUser, ILoginData } from "../interfaces/user.interfaces";
import axios from "axios";

@Directive()
@Injectable({
  providedIn: "root"
})
export class ApiService {
  // #region Events
  /**
   * Event emitted when a user logs in
   *
   * @memberof ApiService
   */
  @Output() loginEvent = new EventEmitter();

  /**
   * Event emitted when a user logs out
   *
   * @memberof ApiService
   */
  @Output() logoutEvent = new EventEmitter();
  // #endregion

  // #region Internal Data
  /**
   * Holds an instance of axios
   *
   * @private
   * @memberof ApiService
   */
  private axiosInstance = axios.create({
    baseURL: "https://developers.activeledger.io/api",
    timeout: 10000
  });
  // #endregion

  // #region Data control
  get token(): string {
    return localStorage.getItem("token");
  }

  set token(token: string) {
    localStorage.setItem("token", token);
  }
  // #endregion

  // #region Shared
  /**
   * Check the the users login token has been added to the headers
   *
   * @private
   * @returns {Promise<void>}
   * @memberof ApiService
   */
  private checkTokenSet(): Promise<void> {
    // TODO: Test if promise is needed here
    return new Promise((resolve, reject) => {
      this.axiosInstance.defaults.headers.common["Authorization"] =
        "Bearer " + this.token;
      resolve();
    });
  }
  // #endregion

  // #region User
  /**
   * Login to the backend server
   *
   * @param {ILoginData} data
   * @returns {Promise<IUser>}
   * @memberof ApiService
   */
  public login(data: ILoginData): Promise<IUser> {
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .post("/login", data)
        .then(resp => {
          const userData: IUser = {
            _id: "user",
            token: resp.data,
            username: data.username,
            accountType: "free",
            loggedIn: true
          };
          this.token = resp.data;
          this.loginEvent.emit("loggedIn");
          resolve(userData);
        })
        .catch((err: unknown) => {
          reject(err);
        });
    });
  }

  /**
   * Logout
   *
   * @returns {Promise<void>}
   * @memberof ApiService
   */
  public logout(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this.checkTokenSet();

      this.axiosInstance
        .get("/logout/" + this.token)
        .then(() => {
          resolve();
          localStorage.removeItem("token");
          this.logoutEvent.emit("loggedOut");
        })
        .catch((err: Error) => {
          localStorage.removeItem("token");
          this.logoutEvent.emit("loggedOut");
          reject(err);
        });
    });
  }

  /**
   * Returns some user data based on the session token
   *
   * @returns {Promise<IUser>}
   * @memberof ApiService
   */
  public whoAmI(): Promise<IUser> {
    return new Promise(async (resolve, reject) => {
      await this.checkTokenSet();

      this.axiosInstance
        .get("/whoami")
        .then(resp => {
          resolve(resp.data);
        })
        .catch((err: unknown) => {
          reject(err);
        });
    });
  }
  // #endregion

  // #region Version
  /**
   * Get the latest released version number
   *
   * @returns {Promise<{}>}
   * @memberof ApiService
   */
  public getLatestVersion(): Promise<{}> {
    return new Promise(async (resolve, reject) => {
      await this.checkTokenSet();

      this.axiosInstance
        .get("/downloads/latest")
        .then((resp: any) => {
          resolve(resp.data);
        })
        .catch((err: Error) => {
          console.error(err.message);
          reject(err);
        });
    });
  }
  // #endregion
}
