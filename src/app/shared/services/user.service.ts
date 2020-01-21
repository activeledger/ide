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
import { ILoginData, IUser } from "../interfaces/user.interfaces";
import { ApiService } from "./api.service";
import { ElectronService } from "./electron.service";
import { User } from "../structures/user.structure";

/**
 * Handle a user and the relevant functiuonality
 *
 * @export
 * @class UserService
 */
@Injectable({
  providedIn: "root"
})
export class UserService {
  /**
   * PouchDB instance
   *
   * @private
   * @memberof UserService
   */
  private userDb;

  /**
   * Creates an instance of UserService.
   * @param {ApiService} api
   * @param {ElectronService} electron
   * @memberof UserService
   */
  constructor(private api: ApiService, private electron: ElectronService) {
    this.userDb = new this.electron.pouchdb("user");
  }

  // #region API Calls
  /**
   * Log the user into the API
   *
   * @param {ILoginData} data
   * @returns {Promise<IUser>}
   * @memberof UserService
   */
  public login(data: ILoginData): Promise<IUser> {
    return new Promise((resolve, reject) => {
      let user: IUser;

      this.api
        .login(data)
        .then((initialUser: IUser) => {
          return this.getDetails(initialUser);
        })
        .then((_user: IUser) => {
          user = _user;
          return this.save(user);
        })
        .then(() => {
          resolve(user);
        })
        .catch((error: Error) => {
          console.error(error);
          reject(error);
        });
    });
  }

  /**
   * Get the user details
   *
   * @param {IUser} user
   * @param {boolean} [update]
   * @returns {Promise<IUser>}
   * @memberof UserService
   */
  public getDetails(user: IUser, update?: boolean): Promise<IUser> {
    return new Promise((resolve, reject) => {
      this.api
        .whoAmI()
        .then((resp: any) => {
          user.firstname = resp.firstname;
          user.lastname = resp.lastname;
          user.email = resp.email;

          if (update) {
            this.update(user);
          }

          resolve(user);
        })
        .catch((err: unknown) => {
          reject(err);
        });
    });
  }

  /**
   * Logour from the session
   *
   * @returns {Promise<void>}
   * @memberof UserService
   */
  public logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.save({
        _id: "user",
        loggedIn: false
      })
        .then(() => {
          resolve();
        })
        .catch((err: unknown) => {
          reject(err);
        });
    });
  }
  // #endregion

  // #region Local public
  /**
   * Check if the user is logged in
   *
   * @returns {Promise<boolean>}
   * @memberof UserService
   */
  public isLoggedIn(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getUserDatastore()
        .then((user: IUser) => {
          resolve(user.loggedIn);
        })
        .catch((err: unknown) => {
          reject(err);
        });
    });
  }

  /**
   * Get locally stored user datastore
   *
   * @returns {Promise<IUser>}
   * @memberof UserService
   */
  public getUserDatastore(): Promise<IUser> {
    return new Promise((resolve, reject) => {
      this.userDb
        .get("user")
        .then((data: any) => {
          if (data && data.loggedIn) {
            if (data.firstname && data.firstname !== "") {
              resolve(data);
            } else {
              return this.getDetails(data);
            }
          } else {
            resolve(undefined);
          }
        })
        .then((user: IUser) => {
          resolve(user);
        })
        .catch((err: { status: number }) => {
          if (err.status === 404) {
            return resolve(new User());
          }
          reject(err);
        });
    });
  }

  /**
   * List the user DB
   *
   * @memberof UserService
   */
  public list(): void {
    this.userDb
      .allDocs({ include_docs: true })
      .then((data: any) => {
        console.log("------ User Database ------");
        console.log(data);
        console.log("---------------------------");
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }

  /**
   * Wipe the user DB
   *
   * @returns {Promise<void>}
   * @memberof UserService
   */
  public wipe(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userDb
        .destroy()
        .then(() => {
          this.electron.restart();
          resolve();
        })
        .catch((err: unknown) => {
          reject(err);
        });
    });
  }
  // #endregion

  // #region local private
  /**
   * Save the user data locally
   *
   * @private
   * @param {IUser} user
   * @returns {Promise<IUser>}
   * @memberof UserService
   */
  private save(user: IUser): Promise<IUser> {
    return new Promise((resolve, reject) => {
      this.userDb
        .allDocs()
        .then((data: any) => {
          if (data.total_rows < 1) {
            return this.post(user);
          } else {
            return this.update(user);
          }
        })
        .then((savedUser: IUser) => {
          resolve(savedUser);
        })
        .catch((err: unknown) => {
          console.error(err);
        });
    });
  }

  /**
   * Add a user
   *
   * @private
   * @param {IUser} user
   * @returns {Promise<IUser>}
   * @memberof UserService
   */
  private post(user: IUser): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userDb
        .put(user, { force: true })
        .then((resp: any) => {
          resolve();
        })
        .catch((err: unknown) => {
          reject(err);
        });
    });
  }

  /**
   * Update a user
   *
   * @private
   * @param {IUser} user
   * @returns {Promise<IUser>}
   * @memberof UserService
   */
  private update(user: IUser): Promise<IUser> {
    return new Promise((resolve, reject) => {
      this.userDb
        .get("user")
        .then((storedUser: IUser) => {
          user._rev = storedUser._rev;
          return this.post(user);
        })
        .then((savedUser: IUser) => {
          resolve(savedUser);
        })
        .catch((err: unknown) => {
          reject(err);
        });
    });
  }
  // #endregion
}
