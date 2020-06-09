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

import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";

import { QuickBarComponent } from "../../../../shared/components/quick-bar/quick-bar.component";
import { Subscription } from "rxjs/Subscription";
import { ElectronService } from "../../../../shared/services/electron.service";
import { ConnectionsComponent } from "../sub-settings/connections/connections.component";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit, OnDestroy {
  // #region UI Data
  /**
   * Handles hiding and showing specific UI elements
   * @private
   * @memberof SettingsComponent
   */
  public setup = {
    section: "",
    showDBOptions: false,
  };
  // #endregion

  // #region Internal data
  /**
   * Navigation subscription
   *
   * @private
   * @type {Subscription}
   * @memberof SettingsComponent
   */
  private navigationSubscription: Subscription;
  // #endregion

  // #region Child Components

  /**
   * Connection component child
   *
   * @private
   * @type {ConnectionsComponent}
   * @memberof SettingsComponent
   */
  @ViewChild(ConnectionsComponent, { static: true })
  private connections: ConnectionsComponent;
  // #endregion

  /**
   * Creates an instance of SettingsComponent.
   * @param {ActivatedRoute} route
   * @param {Router} router
   * @param {QuickBarComponent} quickBar
   * @param {ElectronService} electronService
   * @memberof SettingsComponent
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quickBar: QuickBarComponent,
    public electronService: ElectronService
  ) {
    this.openSubscriptions();
  }

  // #region Angular Control
  ngOnInit() {
    this.quickBar.setPageTitle("Settings");

    // Get stored data for display
    this.checkForUrlOptions();
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.

    this.navigationSubscription.unsubscribe();
  }
  // #endregion

  // #region Page control
  /**
   * Handle opening subscriptions
   *
   * @private
   * @memberof SettingsComponent
   */
  private openSubscriptions(): void {
    this.navigationSubscription = this.router.events.subscribe(
      (event: unknown) => {
        if (event instanceof NavigationEnd) {
          this.checkForUrlOptions();
        }
      }
    );
  }

  /**
   * Check for options provided in the URL
   *
   * @private
   * @memberof SettingsComponent
   */
  private checkForUrlOptions(): void {
    this.route.params.subscribe((params) => {
      if (params["section"]) {
        this.setup.section = params["section"];

        if (params["option"]) {
          const option = params["option"];
          this.goToOption(option);
        }
      }
    });
  }

  /**
   * Got to a specific option
   *
   * @private
   * @param {string} option
   * @memberof SettingsComponent
   */
  private goToOption(option: string): void {
    switch (this.setup.section) {
      case "connection":
        if (option === "create") {
          this.connections.setup.showAddConnection = true;
        }
        break;
    }
  }
  // #endregion
}
