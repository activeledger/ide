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
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { MatDialogRef } from "@angular/material";

import { faPencilAlt, faInfo } from "@fortawesome/free-solid-svg-icons";

import { QuickBarComponent } from "../../../shared/components/quick-bar/quick-bar.component";
import { BlockedDialogComponent } from "../../../shared/dialogs/blocked-dialog/blocked-dialog.component";

import { KeyService } from "../../../shared/services/key.service";
import { DialogService } from "../../../shared/services/dialog.service";

import { KeyData, KeyGenData } from "../../../shared/structures/key.structures";

import { IKeyGenData } from "../../../shared/interfaces/key.interfaces";
import { Subscription } from "rxjs/Subscription";
import { DBTypes } from "../../../shared/enums/db.enum";

@Component({
  selector: "app-keys",
  templateUrl: "./keys.component.html",
  styleUrls: ["./keys.component.scss"]
})
export class KeysComponent implements OnInit, OnDestroy {
  // #region UI Data
  /**
   * Edit icon
   *
   * @memberof KeysComponent
   */
  public editIco = faPencilAlt;

  public pemIcon = faInfo;

  /**
   * Array of keys
   *
   * @type {Array<KeyData>}
   * @memberof KeysComponent
   */
  public keys: Array<KeyData>;

  /**
   * Holds the information needed to generate the new key
   *
   * @type {IKeyGenData}
   * @memberof KeysComponent
   */
  public keyData: IKeyGenData = new KeyGenData();

  /**
   * Holds the ID of the key being edited
   *
   * @type {string}
   * @memberof KeysComponent
   */
  public keyRename: string;

  /**
   * Holds the new name of the key
   *
   * @type {string}
   * @memberof KeysComponent
   */
  public changedKeyName: string;

  /**
   * UI display setup
   *
   * @memberof KeysComponent
   */
  public setup = {
    keyGenerated: false,
    selectedTab: 0,
    showPem: false
  };

  // TODO: Make Enum
  /**
   * Key types
   *
   * @memberof KeysComponent
   */
  public keyTypes = [
    {
      name: "RSA",
      type: "rsa"
    },
    {
      name: "Elliptic Curve",
      type: "secp256k1"
    }
  ];
  // #endregion

  // #region Internal Data

  /**
   * Custom console logger
   *
   * @private
   * @memberof KeysComponent
   */
  private logger = (window as any).logger;

  /**
   * Subscription to the URL parameters
   *
   * @private
   * @type {Subscription}
   * @memberof KeysComponent
   */
  private navigationSubscription: Subscription;
  // #endregion

  /**
   *Creates an instance of KeysComponent.
   * @param {KeyService} keyService
   * @param {DialogService} dialogService
   * @param {QuickBarComponent} quickBar
   * @param {Router} router
   * @param {ActivatedRoute} route
   * @memberof KeysComponent
   */
  constructor(
    private keyService: KeyService,
    private dialogService: DialogService,
    private quickBar: QuickBarComponent,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Subscribe to navigation changes
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.checkForUrlParams();
      }
    });
  }

  // #region Angular control

  ngOnInit() {
    this.getKeys();
    this.checkForUrlParams();

    this.quickBar.setPageTitle("Keys");
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    this.navigationSubscription.unsubscribe();
  }
  // #endregion

  // #region Page Control

  /**
   * Check for specific URL parameters
   *
   * @private
   * @memberof KeysComponent
   */
  private checkForUrlParams(): void {
    this.route.params.subscribe(params => {
      if (params["tab"]) {
        const tab = params["tab"];

        this.goToTab(tab);
      }
    });
  }

  /**
   * Enable key renaming in the UI
   *
   * @param {string} keyId
   * @memberof KeysComponent
   */
  public enableRename(keyId: string): void {
    this.keyRename = keyId;
  }

  /**
   * Save the new name for a key after user has renamed it
   *
   * @param {KeyData} key
   * @memberof KeysComponent
   */
  public saveKeyName(key: KeyData): void {
    key.name = this.changedKeyName;
    this.keyService.updateKey(key).then(() => {
      this.changedKeyName = "";
    });
    this.keyRename = "";
  }

  /**
   * Cancel and hide UI elements for renaming
   *
   * @memberof KeysComponent
   */
  public cancelRename(): void {
    this.changedKeyName = "";
    this.keyRename = "";
  }

  /**
   * Go to a specific tab
   *
   * @private
   * @param {string} tab
   * @memberof KeysComponent
   */
  private goToTab(tab: string): void {
    switch (tab) {
      case "create":
        this.setup.selectedTab = 1;
        break;
    }
  }

  /**
   * Clear the key generate input
   *
   * @memberof KeysComponent
   */
  public clearKeyGenerate(): void {
    this.keyData = {
      name: "",
      encryption: "",
      description: ""
    };

    this.setup.keyGenerated = false;
  }

  // #endregion

  // #region Getters

  /**
   * Get a list of keys from the database
   *
   * @private
   * @memberof KeysComponent
   */
  private getKeys(): void {
    this.keyService
      .getKeys()
      .then((keys: Array<KeyData>) => {
        this.keys = keys;
      })
      .catch((err: any) => {
        console.error(err);
        this.dialogService.error("Error loading key list.");
      });
  }

  // #endregion

  // #region Setters

  /**
   * Generate a new key
   * Check key type first, if RSA display blocking dialog
   *
   * @memberof KeysComponent
   */
  public generateKey(): void {
    // RSA takes a while to generate so lock the UI until completed
    if (this.keyData.encryption === "rsa") {
      // Display blocker dialog
      const blockerRef = this.dialogService.blocker(
        "Key generation may take a little while, please be patient..."
      );
      blockerRef.disableClose = true;
      blockerRef.afterOpened().subscribe(() => {
        setTimeout(() => {
          this.runKeyGen(blockerRef);
        }, 100);
      });
    } else {
      this.runKeyGen();
    }
  }

  /**
   * Run the main key generation process
   *
   * @private
   * @param {MatDialogRef<BlockedDialogComponent>} [blockerRef]
   * @memberof KeysComponent
   */
  private runKeyGen(blockerRef?: MatDialogRef<BlockedDialogComponent>): void {
    this.keyService
      .generate(this.keyData.encryption)
      .then((key: KeyData) => {
        key.name = this.keyData.name;
        key.encryption = this.keyData.encryption;
        key.type = DBTypes.KEY;

        key.metadata = {
          description: this.keyData.description
        };

        return this.keyService.saveKey(key);
      })
      .then((storedKey: KeyData) => {
        if (blockerRef) {
          blockerRef.close();
        }
        this.setup.keyGenerated = true;

        this.logger.info(
          `Key generated successfully!\nEncryption type: ${storedKey.encryption}`
        );

        this.getKeys();
        this.setup.selectedTab = 0;
        this.clearKeyGenerate();
      })
      .catch(err => {
        if (blockerRef) {
          blockerRef.close();
        }
        console.error(err);
        this.dialogService.error("Error generating key.");
      });
  }

  // #endregion
}
