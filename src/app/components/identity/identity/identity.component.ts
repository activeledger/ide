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

import { KeyService } from "../../../shared/services/key.service";
import { LedgerService } from "../../../shared/services/ledger.service";
import { IdentityService } from "../../../shared/services/identity.service";
import { DialogService } from "../../../shared/services/dialog.service";
import { NamespaceService } from "../../../shared/services/namespace.service";

import { ConnectionData } from "../../../shared/structures/connection.structures";
import { KeyData } from "../../../shared/structures/key.structures";
import { NamespaceData } from "../../../shared/structures/namespace.structures";
import { IdentityData } from "../../../shared/structures/identity.structure";

import { IIdentityData } from "../../../shared/interfaces/identity.interfaces";
import { IConnectionData } from "../../../shared/interfaces/connection.interfaces";
import { IKeyData } from "../../../shared/interfaces/key.interfaces";
import { INamespaceData } from "../../../shared/interfaces/namespace.interfaces";

import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-identity",
  templateUrl: "./identity.component.html",
  styleUrls: ["./identity.component.scss"]
})
export class IdentityComponent implements OnInit, OnDestroy {
  // #region UI Data
  /**
   * Holds an array of existing identities
   *
   * @memberof IdentityComponent
   */
  public identities = new Array<IIdentityData>();

  /**
   * Holds the data for a new identity
   *
   * @memberof IdentityComponent
   */
  public identity = new IdentityData();

  /**
   * Holds an array of existing keys
   *
   * @type {IKeyData[]}
   * @memberof IdentityComponent
   */
  public keys: IKeyData[];

  /**
   * Holds the selected key
   *
   * @type {IKeyData}
   * @memberof IdentityComponent
   */
  public key: IKeyData;

  /**
   * Holds an array of connections
   *
   * @memberof IdentityComponent
   */
  public connections = new Array<IConnectionData>();

  /**
   * Holds the selected connection
   *
   * @type {IConnectionData}
   * @memberof IdentityComponent
   */
  public connection: IConnectionData;

  /**
   * Holds an array of namespaces
   *
   * @type {INamespaceData[]}
   * @memberof IdentityComponent
   */
  public namespaces: INamespaceData[];

  /**
   * UI display setup
   *
   * @memberof IdentityComponent
   */
  public setup = {
    selectedTab: 0
  };
  // #endregion

  // #region Internal data
  /**
   * Holds the subscritption to URL changes
   *
   * @private
   * @type {Subscription}
   * @memberof IdentityComponent
   */
  private navigationSubscription: Subscription;

  /**
   * Custom logger
   *
   * @private
   * @memberof IdentityComponent
   */
  private logger = (window as any).logger;
  // #endregion

  /**
   *Creates an instance of IdentityComponent.
   * @param {IdentityService} identityService
   * @param {KeyService} keyService
   * @param {LedgerService} ledgerService
   * @param {NamespaceService} namespaceService
   * @param {DialogService} dialog
   * @param {ActivatedRoute} route
   * @param {Router} router
   * @param {NgxSpinnerService} spinner
   * @memberof IdentityComponent
   */
  constructor(
    private identityService: IdentityService,
    private keyService: KeyService,
    private ledgerService: LedgerService,
    private namespaceService: NamespaceService,
    private dialog: DialogService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.checkForUrlParams();
      }
    });
  }

  // #region Angular control

  ngOnInit() {
    this.getIdentities();
    this.getKeys();
    this.getConnections();
    this.getNamespaces();
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    this.navigationSubscription.unsubscribe();
  }
  // #endregion

  // #region Page control

  /**
   * Check for passed parameters
   *
   * @private
   * @memberof IdentityComponent
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
   * Go to a specific tab
   *
   * @private
   * @param {string} tab
   * @memberof IdentityComponent
   */
  private goToTab(tab: string): void {
    switch (tab) {
      case "create":
        this.setup.selectedTab = 1;
        break;
    }
  }

  /**
   * Clear the identity creation inputs
   *
   * @memberof IdentityComponent
   */
  public clearIdentityGenerate(): void {
    this.identity = new IdentityData();
    this.key = undefined;
    this.connection = undefined;
  }

  // #endregion

  // #region Getters

  /**
   * Get a list of identities
   *
   * @private
   * @memberof IdentityComponent
   */
  private getIdentities(): void {
    this.identityService
      .getIdentities()
      .then((identities: Array<IIdentityData>) => {
        this.identities = identities;
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }

  /**
   * Get a list of keys
   *
   * @private
   * @memberof IdentityComponent
   */
  private getKeys(): void {
    this.keyService
      .getKeys()
      .then((keys: KeyData[]) => {
        this.keys = keys;
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }

  /**
   * Get a list of connections
   *
   * @private
   * @memberof IdentityComponent
   */
  private getConnections(): void {
    this.ledgerService
      .getConnections()
      .then((connections: ConnectionData[]) => {
        this.connections = connections;
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }

  /**
   * Get a list of namespaces
   *
   * @private
   * @memberof IdentityComponent
   */
  private getNamespaces(): void {
    this.namespaceService
      .getNamespaces()
      .then((namespaces: NamespaceData[]) => {
        this.namespaces = namespaces;
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }

  /**
   * Get the friendly name of a key
   *
   * @param {string} keyId
   * @returns {string}
   * @memberof IdentityComponent
   */
  public getKeyName(keyId: string): string {
    let i = this.keys.length;
    while (i--) {
      if (this.keys[i]._id === keyId) {
        return this.keys[i].name;
      }
    }
  }

  /**
   * Get the friendly name of a connection
   *
   * @param {string} connectionId
   * @returns {string}
   * @memberof IdentityComponent
   */
  public getConnectionName(connectionId: string): string {
    let i = this.connections.length;
    while (i--) {
      if (this.connections[i]._id === connectionId) {
        return this.connections[i].name;
      }
    }
  }

  /**
   * Get the friendly name of a namespace
   *
   * @param {string} namespaceId
   * @returns {string}
   * @memberof IdentityComponent
   */
  public getNamespaceName(namespaceId: string): string {
    let i = this.namespaces.length;
    while (i--) {
      if (this.namespaces[i]._id === namespaceId) {
        return this.namespaces[i].name;
      }
    }
  }

  // #endregion

  // #region Create
  /**
   * Create a new identity
   * The identity service will create a new stream on the ledger
   *
   * @memberof IdentityComponent
   */
  public createIdentity(): void {
    this.identity.key = this.key._id;
    this.identity.connection = this.connection._id;
    this.identity.metadata.friendlyName = this.identity.name;

    this.spinner.show();

    this.identityService
      .create(this.identity, this.connection._id)
      .then((identity: IIdentityData) => {
        this.identities.push(identity);
        this.dialog.info("Identity created successfully.");
        this.spinner.hide();
        this.setup.selectedTab = 0;
        this.clearIdentityGenerate();
      })
      .catch((err: unknown) => {
        this.spinner.hide();
        this.dialog.error("Error creating identity.");
        this.logger.error(err);
      });
  }

  // #endregion
}
