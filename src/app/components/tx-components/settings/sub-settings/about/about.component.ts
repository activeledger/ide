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

import { Component, OnInit, OnDestroy } from "@angular/core";
import { VERSION } from "../../../../../../environments/version";
import { ElectronService } from "../../../../../shared/services/electron.service";
import { ApiService } from "../../../../../shared/services/api.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-settings-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit, OnDestroy {
  // #region UI Data
  /**
   * The version number of the running instance
   *
   * @memberof AboutComponent
   */
  public version = VERSION.version;

  /**
   * Latest available version information
   *
   * @memberof AboutComponent
   */
  public latestVersion = {
    version: "",
    released: "",
  };

  /**
   * UI Setup data
   *
   * @memberof AboutComponent
   */
  public setup = {
    isLoggedIn: false,
  };
  // #endregion

  // #region Events
  private loginEvent: Subscription;
  private logoutEvent: Subscription;
  // #endregion

  /**
   * Creates an instance of AboutComponent.
   * @param {ApiService} api
   * @param {ElectronService} electron
   * @memberof AboutComponent
   */
  constructor(private api: ApiService, private electron: ElectronService) {}

  // #region Angular control

  ngOnInit(): void {
    if (this.api.token) {
      this.getLatestVersion();
    }

    this.handleEvents();
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    if (this.loginEvent) {
      this.loginEvent.unsubscribe();
    }

    if (this.logoutEvent) {
      this.logoutEvent.unsubscribe();
    }
  }

  // #endregion

  // #region UI Functions
  /**
   * Open the web download page for Harmony
   *
   * @memberof AboutComponent
   */
  public openDownloadPage(): void {
    this.electron.openInBrowser(
      "https://developers.activeledger.io/developer/download"
    );
  }
  // #endregion

  // #region Events

  /**
   * Subscribe to the login and logout events
   *
   * @private
   * @memberof AboutComponent
   */
  private handleEvents(): void {
    this.loginEvent = this.api.loginEvent.subscribe(() => {
      this.getLatestVersion();
    });

    this.logoutEvent = this.api.logoutEvent.subscribe(() => {
      this.setup.isLoggedIn = false;
      this.latestVersion = { version: "", released: "" };
    });
  }

  // #endregion

  // #region Getters
  /**
   * Get the lastest version of Harmony from the API, If the user is logged in.
   *
   * @private
   * @memberof AboutComponent
   */
  private getLatestVersion(): void {
    this.setup.isLoggedIn = true;
    this.api
      .getLatestVersion()
      .then((version: any) => {
        this.latestVersion = version;
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }
  // #endregion
}
