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

// #region Imports

import { Component, ViewChild, ElementRef } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import {
  faHome,
  faKey,
  faWrench,
  faBoxOpen,
  faInfoCircle,
  faTimesCircle,
  faGlobe,
  faBars,
  faServer,
  faSearch,
  faSitemap,
  faPenNib,
  faAddressBook,
  faCubes,
  faRunning,
  faPencilAlt,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";

import { QuickBarComponent } from "./shared/components/quick-bar/quick-bar.component";
import { ConsoleComponent } from "./shared/components/console/console.component";

import { DatabaseService } from "./providers/database.service";
import { SettingsService } from "./shared/services/settings.service";
import { GeneralService } from "./shared/services/general.service";
import { ElectronService } from "./shared/services/electron.service";
// #endregion
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [GeneralService]
})
export class AppComponent {
  // #region UI Data

  // #region Font awesome Icons

  // Menu Icons
  public burgerIco = faBars;
  public homeIco = faHome;
  public contractsIco = faPenNib;
  public keysIco = faKey;
  public identityIco = faAddressBook;
  public namespacesIco = faBoxOpen;
  public signingIco = faPencilAlt;
  public runIco = faRunning;
  public localNetIco = faServer;
  public streamExploreIco = faSearch;
  public coreApiIco = faCubes;
  public netManageIco = faSitemap;
  public settingsIco = faWrench;

  // Console control icons
  public allIco = faGlobe;
  public infoIco = faInfoCircle;
  public warningIco = faExclamationTriangle;
  public errorIco = faTimesCircle;

  // #endregion

  /**
   * Allows easy logging to the custom console
   *
   * @public
   * @memberof AppComponent
   */
  public logger = (window as any).logger;

  /**
   * Control over the custom console
   *
   * @type {ConsoleComponent}
   * @memberof AppComponent
   */
  @ViewChild(ConsoleComponent)
  customConsole: ConsoleComponent;

  @ViewChild(QuickBarComponent)
  quickBar: QuickBarComponent;

  /**
   * Used to control the menu toggle
   * Increase and decrease width of side menu and main wrapper
   *
   * @type {ElementRef}
   * @memberof AppComponent
   */
  @ViewChild("sideMenu")
  sideMenu: ElementRef;
  @ViewChild("mainWrapper")
  mainWrapper: ElementRef;

  /**
   * Controls the view
   *
   * Console display
   * Menu names hidden
   *
   * @private
   * @memberof AppComponent
   */
  public setup = {
    console: false,
    hideMenuNames: false,
    isMaximised: true
  };

  public pageTitle = "Home";

  /**
   * Holds the amount of elements currently in the console
   * This is used for the UI display
   *
   * @private
   * @memberof AppComponent
   */
  public consoleCounts = {
    all: 0,
    info: 0,
    warning: 0,
    error: 0
  };

  /**
   * Holds the version number of the app
   *
   * @memberof AppComponent
   */
  public version = this.generalService.version;

  // #endregion

  /**
   * Creates an instance of AppComponent.
   * @param {ElectronService} electronService
   * @param {TranslateService} translate
   * @param {Router} router
   * @param {DatabaseService} database
   * @param {SettingsService} settingsService
   * @param {GeneralService} generalService
   * @memberof AppComponent
   */
  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    private router: Router,
    private database: DatabaseService,
    private settingsService: SettingsService,
    private generalService: GeneralService
  ) {
    translate.setDefaultLang("en");
    this.initialise();
  }

  // #region App Initialisation

  private initialise(): void {
    // Initialise the database
    this.database
      .initialiseWorkspaces()
      .then(() => {
        this.generalService.setAccent();
      })
      .catch((err: any) => {
        console.log(err);
      });

    this.settingsService
      .getMenuState()
      .then((state: string) => {
        this.toggleMenu(state);
      })
      .catch((err: any) => {
        console.error(err);
      });

    // Check if window maximised
    const win = this.electronService.remote.getCurrentWindow();
    this.setup.isMaximised = win.isMaximized();
  }

  // #endregion

  // #region Navigation

  /**
   * Navigate to a specific page
   *
   * @private
   * @param {string} url
   * @memberof AppComponent
   */
  public goTo(url: string, title?: string): void {
    this.router.navigateByUrl(url);

    this.quickBar.setPageTitle(title);
    this.pageTitle = title;
  }

  /**
   * Toggle the menu between expanded (with names) and compact (just icons)
   *
   * @memberof AppComponent
   */
  public toggleMenu(state?: string): void {
    if (state) {
      if (state === "small") {
        this.setup.hideMenuNames = true;
      } else {
        this.setup.hideMenuNames = false;
      }
    } else {
      // Toggle the item names
      this.setup.hideMenuNames = !this.setup.hideMenuNames;
    }

    // Set the width of the menu/body based on whether or not the menu items are hidden
    if (this.setup.hideMenuNames) {
      this.settingsService.saveMenuStatus("small");
    } else {
      this.settingsService.saveMenuStatus("big");
    }
  }

  // #endregion

  // #region Custom console control

  /**
   * Load the custom console
   * Link the counts in this instance with the counts in the console.
   * This is called via the initComplete event emitted by the console.
   *
   * @private
   * @memberof AppComponent
   */
  public loadConsole(): void {
    this.consoleCounts = this.customConsole.counts;
  }

  /**
   * Open the console to a specific tab based on
   * the user clicking a specific icon in the bottom bar.
   * If the console is shown stopPropogation is used to prevent the console
   * from being hidden as the bottom bar acts as a trigger
   *
   * @private
   * @param {string} tab
   * @param {*} $event
   * @memberof AppComponent
   */
  public openConsoleTo(tab: string, $event: any): void {
    this.customConsole.openTo(tab);
    if (this.setup.console) {
      $event.stopPropagation();
    }
  }

  // #endregion

  // #region Application control

  /**
   * Minimise the application
   *
   * @private
   * @memberof AppComponent
   */
  public minimise(): void {
    const win = this.electronService.remote.getCurrentWindow();
    win.minimize();
  }

  /**
   * Maximise or un-maximise the window
   *
   * @private
   * @memberof AppComponent
   */
  public maximise(): void {
    const win = this.electronService.remote.getCurrentWindow();
    if (!win.isMaximized()) {
      win.maximize();
      this.setup.isMaximised = true;
    } else {
      win.unmaximize();
      this.setup.isMaximised = false;
    }
  }

  /**
   * Close the application
   *
   * @private
   * @memberof AppComponent
   */
  public close(): void {
    const win = this.electronService.remote.getCurrentWindow();
    win.close();
  }

  // #endregion
}
