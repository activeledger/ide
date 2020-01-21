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
import { ActivatedRoute, Router } from "@angular/router";
import { IPassedData } from "../../../shared/interfaces/contract.interfaces";
import {
  faArrowLeft,
  faPlus,
  faTrash
} from "../../../../../node_modules/@fortawesome/free-solid-svg-icons";
import { ContractData } from "../../../shared/structures/contract.structures";
import { ContractService } from "../../../shared/services/contract.service";
import { LedgerService } from "../../../shared/services/ledger.service";
import { DialogService } from "../../../shared/services/dialog.service";
import { NamespaceService } from "../../../shared/services/namespace.service";
import { IdentityService } from "../../../shared/services/identity.service";
import { QuickBarComponent } from "../../../shared/components/quick-bar/quick-bar.component";
import { ConnectionData } from "../../../shared/structures/connection.structures";
import { NamespaceData } from "../../../shared/structures/namespace.structures";
import { IdentityData } from "../../../shared/structures/identity.structure";
import { IIdentityData } from "../../../shared/interfaces/identity.interfaces";
import { INamespaceData } from "../../../shared/interfaces/namespace.interfaces";
import { BaseTransaction } from "../../../shared/structures/transaction.structures";
import { IContractInfo } from "../../../shared/interfaces/contract.interfaces";

/**
 * Provides an information view about the selected contract
 *
 * @export
 * @class InfoContractsComponent
 * @implements {OnInit}
 */
@Component({
  selector: "app-info-contracts",
  templateUrl: "./info-contracts.component.html",
  styleUrls: ["./info-contracts.component.css"]
})
export class InfoContractsComponent implements OnInit {
  // #region UI Data
  /**
   * Holds display data
   *
   * @type {Array<any>}
   * @memberof InfoContractsComponent
   */
  public displayData: Array<any> = new Array<any>();

  /**
   * Holds contract labels
   *
   * @type {string[]}
   * @memberof InfoContractsComponent
   */
  public labels: string[];

  /**
   * Contract uploaded status
   *
   * @memberof InfoContractsComponent
   */
  public contractUploaded = false;

  /**
   * Add icon
   *
   * @memberof InfoContractsComponent
   */
  public addIco = faPlus;

  /**
   * Delete icon
   *
   * @memberof InfoContractsComponent
   */
  public deleteIco = faTrash;

  /**
   * Back icon
   *
   * @memberof InfoContractsComponent
   */
  public backIco = faArrowLeft;

  /**
   * Holds contract data
   *
   * @private
   * @type {ContractData}
   * @memberof InfoContractsComponent
   */
  public contract: ContractData = new ContractData();
  // #endregion

  // #region Internal Data
  /**
   * Holds initialisation data
   *
   * @private
   * @type {IPassedData}
   * @memberof InfoContractsComponent
   */
  private initData: IPassedData = {
    id: undefined
  };
  // #endregion

  /**
   * Creates an instance of InfoContractsComponent.
   * @param {ActivatedRoute} route
   * @param {ContractService} contractService
   * @param {LedgerService} ledgerService
   * @param {DialogService} dialogService
   * @param {NamespaceService} namespaceService
   * @param {IdentityService} identityService
   * @param {Router} router
   * @param {QuickBarComponent} quickBar
   * @memberof InfoContractsComponent
   */
  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService,
    private ledgerService: LedgerService,
    private dialogService: DialogService,
    private namespaceService: NamespaceService,
    private identityService: IdentityService,
    private router: Router,
    private quickBar: QuickBarComponent
  ) {}

  // #region Angular control
  ngOnInit() {
    this.quickBar.setPageTitle("Contract Info");

    this.getId()
      .then(() => {
        return this.getContract();
      })
      .then(() => {
        return this.setupArray();
      })
      .catch((err: any) => {
        // TODO: Handle error better
        console.error(err);
      });
  }

  // #endregion

  // #region UI Control
  /**
   * Controls the back button
   *
   * @private
   * @memberof InfoContractsComponent
   */
  public back(): void {
    const url = "/contracts";
    this.router.navigateByUrl(url);
  }
  // #endregion

  // #region Getters

  /**
   * Get the ID from the URL params
   *
   * @private
   * @returns {Promise<void>}
   * @memberof InfoContractsComponent
   */
  private getId(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(params => {
        if (params["id"]) {
          this.initData.id = params["id"];
          resolve();
        } else {
          this.back();
          reject();
        }
      });
    });
  }

  /**
   * Get the contract
   *
   * @private
   * @returns {Promise<void>}
   * @memberof InfoContractsComponent
   */
  private getContract(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.contractService
        .findById(this.initData.id)
        .then((contract: ContractData) => {
          this.contract = contract;

          if (Object.keys(contract.onboardData).length > 0) {
            this.contractUploaded = true;
          }

          resolve();
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  // #endregion

  // #region Setters
  /**
   * Setup the data arrays
   *
   * @private
   * @returns {Promise<void>}
   * @memberof InfoContractsComponent
   */
  private setupArray(): Promise<void> {
    console.log(this.contract);

    // const hasStream = (data) => data ? true : false;
    const hasLabels = (contract, stream) =>
      contract.labels &&
      contract.labels[stream] &&
      contract.labels[stream].length > 0
        ? true
        : false;

    return new Promise(resolve => {
      const onboardData = this.contract.onboardData;
      const onboardDataKeys = Object.keys(onboardData);

      for (let i = onboardDataKeys.length; i--; ) {
        const onboardDataValues = Object.values(
          Object.values(onboardData[onboardDataKeys[i]])[0]
        );

        const uploadedContractData =
          onboardDataValues[onboardDataValues.length - 1];

        const streamId = uploadedContractData.streamId;

        const displayPacket: IContractInfo = {
          identity: uploadedContractData.identity,
          connection: uploadedContractData.connection,
          namespace: uploadedContractData.namespace,
          streamId: streamId,
          uploaded: uploadedContractData.uploaded,
          latestVersion: uploadedContractData.version,
          versionCount: onboardDataValues.length,
          labels: []
        };

        if (hasLabels(this.contract, streamId)) {
          displayPacket.labels = this.contract.labels[streamId];
        }

        this.displayData.push(displayPacket);
      }

      this.setNames();

      resolve();
    });
  }

  // TODO: Replace with pipes
  /**
   * Set the names of various elements
   *
   * @private
   * @memberof InfoContractsComponent
   */
  private async setNames() {
    let i = this.displayData.length;
    while (i--) {
      const connection: ConnectionData = await this.ledgerService.findById(
        this.displayData[i].connection
      );
      this.displayData[i].connectionName = connection.name;

      const namespace: NamespaceData = await this.namespaceService.findById(
        this.displayData[i].namespace
      );
      this.displayData[i].namespaceName = namespace.name;

      const identity: IdentityData = await this.identityService.findById(
        this.displayData[i].identity
      );
      this.displayData[i].identityName = identity.name;
    }
  }

  // #endregion

  // #region Labels
  /**
   * Create a new label on the ledger
   *
   * @param {IContractOnboardVersion} version
   * @memberof InfoContractsComponent
   */
  public createLabel(contractData: IContractInfo): void {
    let label: string;
    let identity: IIdentityData;
    let namespace: INamespaceData;

    this.namespaceService
      .findById(contractData.namespace)
      .then((_namespace: NamespaceData) => {
        namespace = _namespace;
        return;
      });
    this.dialogService
      .input("Enter Label Name")
      .then(response => {
        if (response) {
          label = response;
          return this.identityService.findById(contractData.identity);
        } else {
          throw new Error("Cancelled");
        }
      })
      .then((_identity: IIdentityData) => {
        identity = _identity;
        return this.ledgerService.findById(contractData.connection);
      })
      .then((connection: ConnectionData) => {
        // Build Transaction
        const transaction = new BaseTransaction();
        transaction.$tx.$entry = "link";
        transaction.$tx.$i[identity.streamId] = {
          namespace: namespace.name,
          contract: contractData.streamId,
          link: label
        };

        this.ledgerService.sendTransaction(transaction, identity, connection);
      })
      .then(() => {
        // TODO: Problem when failing verify it doesn't throw an error

        // Add label to array
        const stream = Object.keys(this.contract.onboardData[identity._id])[0];

        if (!this.contract.labels[stream]) {
          this.contract.labels[stream] = [];
        }

        this.contract.labels[stream].push(label);

        // Save the label to the contract
        return this.contractService.update(this.contract);
      })
      .then(() => {
        for (let i = this.displayData.length; i--; ) {
          const displayData = this.displayData[i];

          if (displayData.streamId === contractData.streamId) {
            displayData.labels.push(label);
          }
        }

        this.dialogService.info("Label has been set");
      })
      .catch((error: Error) => {
        if (error.message !== "Cancelled") {
          console.log(error);
          this.dialogService.error("Error Setting Label");
        }
      });
  }

  /**
   * Remove a label from a contract
   *
   * @param {IContractOnboardVersion} version
   * @param {string} label
   * @memberof InfoContractsComponent
   */
  public removeLabel(label: string, contractData: IContractInfo): void {
    let identity: IIdentityData;
    let namespace: NamespaceData;

    this.namespaceService
      .findById(contractData.namespace)
      .then((_namespace: NamespaceData) => {
        namespace = _namespace;
        return;
      });
    this.identityService
      .findById(contractData.identity)
      .then((_identity: IIdentityData) => {
        identity = _identity;
        return this.ledgerService.findById(contractData.connection);
      })
      .then((connection: ConnectionData) => {
        // Build Transaction
        const transaction = new BaseTransaction();
        transaction.$tx.$entry = "unlink";
        transaction.$tx.$i[identity.streamId] = {
          namespace: namespace.name,
          contract: contractData.streamId,
          link: label
        };

        return this.ledgerService.sendTransaction(
          transaction,
          identity,
          connection
        );
      })
      .then(() => {
        // TODO: Problem when failing verify it doesn't throw an error

        // Remove label from array
        const stream = contractData.streamId;
        let i = this.contract.labels[stream].length;
        while (i--) {
          if (this.contract.labels[stream][i] === label) {
            this.contract.labels[stream].splice(i, 1);
          }
        }

        // Save the label to the contract
        return this.contractService.update(this.contract);
      })
      .then(() => {
        for (let i = this.displayData.length; i--; ) {
          const displayData = this.displayData[i];

          if (displayData.streamId === contractData.streamId) {
            for (let j = displayData.labels.length; j--; ) {
              if (displayData.labels[j] === label) {
                displayData.labels.splice(j, 1);
              }
            }
          }
        }

        this.dialogService.info("Label has been removed");
      })
      .catch(err => {
        console.log(err);
        this.dialogService.error("Error Removing Label");
      });
  }

  // #endregion
}
