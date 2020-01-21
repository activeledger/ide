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
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";

import { NamespaceService } from "../../../shared/services/namespace.service";
import { GeneralService } from "../../../shared/services/general.service";
import { DialogService } from "../../../shared/services/dialog.service";
import { IdentityService } from "../../../shared/services/identity.service";

import { QuickBarComponent } from "../../../shared/components/quick-bar/quick-bar.component";

import { NamespaceData } from "../../../shared/structures/namespace.structures";
import { IdentityData } from "../../../shared/structures/identity.structure";

import { IIdentityData } from "../../../shared/interfaces/identity.interfaces";
import { INamespaceData } from "../../../shared/interfaces/namespace.interfaces";

@Component({
  selector: "app-namespace",
  templateUrl: "./namespace.component.html",
  styleUrls: ["./namespace.component.scss"]
})
export class NamespaceComponent implements OnInit {
  // #region UI Data

  /**
   * Holds the array of available identities that can be used to create a namespace
   *
   * @type {Array<IIdentityData>}
   * @memberof NamespaceComponent
   */
  public identities: Array<IIdentityData>;

  /**
   * Holds the identity data selected for the namespace being created
   *
   * @type {IIdentityData}
   * @memberof NamespaceComponent
   */
  public identity: IIdentityData;

  /**
   * Holds an array of all the namespaces that exist
   *
   * @type {Array<INamespaceData>}
   * @memberof NamespaceComponent
   */
  public namespaces: Array<INamespaceData>;

  /**
   * Holds the namespace data of the namespace being created
   *
   * @memberof NamespaceComponent
   */
  public namespace = new NamespaceData();

  /**
   * Page setup data
   *
   * @memberof NamespaceComponent
   */
  public setup = {
    idSet: false,
    noIdentities: false,
    noAvailableIdentities: false,
    selectedTab: 0
  };
  // #endregion

  // #region Internal data

  /**
   * Holds the ID of the loaded identity
   *
   * This variable is used to reset the identity input after the namespace inputs have been cleared
   * This is because it might have been set by the user clicking through from the identity and so
   * the identity is in the URL.
   *
   * @private
   * @type {string}
   * @memberof NamespaceComponent
   */
  private loadedIdentityID: string;
  // #endregion

  /**
   * Creates an instance of NamespaceComponent.
   * @param {ActivatedRoute} route
   * @param {NamespaceService} namespaceService
   * @param {IdentityService} identityService
   * @param {NgxSpinnerService} spinner
   * @param {GeneralService} generalService
   * @param {DialogService} dialogService
   * @param {QuickBarComponent} quickBar
   * @memberof NamespaceComponent
   */
  constructor(
    private route: ActivatedRoute,
    private namespaceService: NamespaceService,
    private identityService: IdentityService,
    private spinner: NgxSpinnerService,
    private generalService: GeneralService,
    private dialogService: DialogService,
    private quickBar: QuickBarComponent
  ) {
    this.quickBar.setPageTitle("Namespaces");
  }

  // #region Angular control
  ngOnInit() {
    this.checkForId();
    this.getNamespaces();
    this.getIdentities();
  }
  // #endregion

  // #region Page control

  /**
   * Check to see if the url contains the id of an identity
   *
   * @private
   * @memberof NamespaceComponent
   */
  private checkForId(): void {
    this.route.params.subscribe(params => {
      if (params["id"]) {
        this.setup.idSet = true;
        this.loadedIdentityID = params["id"];
        this.findIdentity(this.loadedIdentityID);
      }
    });
  }

  /**
   * Clear the inputs for creating a namespace
   *
   * @memberof NamespaceComponent
   */
  public clearNamespaceInputs(): void {
    this.namespace = new NamespaceData();
    this.identity = undefined;

    if (this.loadedIdentityID) {
      this.findIdentity(this.loadedIdentityID);
    }
  }

  /**
   * Setup the UI after the namespace has been saved
   *
   * @memberof NamespaceComponent
   */
  public uiAfterSave(): void {
    this.loadedIdentityID = undefined;
    this.setup.idSet = false;
    this.setup.selectedTab = 0;
    this.clearNamespaceInputs();
  }
  // #endregion

  // #region Getters

  /**
   *  Find an identity by its ID
   *
   * @private
   * @param {string} id
   * @memberof NamespaceComponent
   */
  private findIdentity(id: string): void {
    this.identityService
      .findById(id)
      .then((identity: IIdentityData) => {
        this.identity = identity;
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }

  /**
   * Get all available identities and filter them
   *
   * @private
   * @memberof NamespaceComponent
   */
  private getIdentities(): void {
    this.identityService
      .getIdentities()
      .then((allIdentities: Array<IIdentityData>) => {
        const filteredIdentities = [];

        let i = allIdentities.length;
        while (i--) {
          if (allIdentities[i].namespace === undefined) {
            filteredIdentities.push(allIdentities[i]);
          }
        }

        if (filteredIdentities.length === 0) {
          const holder = new IdentityData();
          holder.name = "No Identities Onboarded";
          filteredIdentities.push(holder);

          if (allIdentities.length === 0) {
            this.setup.noIdentities = true;
          } else {
            this.setup.noAvailableIdentities = true;
          }
        }

        this.identities = this.generalService.reverseArray(filteredIdentities);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  /**
   * Get all namespaces
   *
   * @private
   * @memberof NamespaceComponent
   */
  private getNamespaces(): void {
    let serviceCall = this.namespaceService.getNamespaces();

    if (this.setup.idSet) {
      serviceCall = this.namespaceService.findByIdentity(this.identity._id);
    }

    serviceCall
      .then((formatedNamespaces: Array<NamespaceData>) => {
        this.namespaces = formatedNamespaces;
      })
      .catch((err: any) => {
        console.error(err);
      });
  }
  // #endregion

  // #region Setters

  /**
   * Save a new namespace
   *
   * @memberof NamespaceComponent
   */
  public save(): void {
    if (this.identity) {
      // Namespaces should always be lowercase
      this.namespace.name = this.namespace.name.toLowerCase();

      this.spinner.show();

      this.namespaceService
        .create(this.namespace, this.identity._id)
        .then((storedData: NamespaceData) => {
          return this.updateIdentity(storedData._id);
        })
        .then(() => {
          this.getNamespaces();
          this.getIdentities();
          this.spinner.hide();
          this.dialogService.info("Namespace saved and onboarded.");
          this.uiAfterSave();
        })
        .catch((err: any) => {
          this.spinner.hide();
          console.error(err);
          this.dialogService.error("Error saving and onboarding namespace!");
        });
    } else {
      this.dialogService.warning("No Identity");
    }
  }

  /**
   * Update theselected identity, connecting it to the new namespace
   *
   * @private
   * @param {string} namespaceId
   * @returns {Promise<void>}
   * @memberof NamespaceComponent
   */
  private updateIdentity(namespaceId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.identity === undefined) {
        return reject("Identity not defined");
      }

      this.identity.namespace = namespaceId;

      this.identityService
        .update(this.identity)
        .then(() => {
          resolve();
        })
        .catch((err: unknown) => {
          reject(err);
        });
    });
  }
  // #endregion
}
