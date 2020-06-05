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

import { Injectable, EventEmitter, Output, Directive } from "@angular/core";
import { LedgerService } from "./ledger.service";
import { IBaseTransaction } from "@activeledger/sdk";
import { DialogService } from "./dialog.service";
import { ContractOnboardVersion } from "../structures/contract.structures";
import { UploadErrorData } from "../classes/errors.classes";
import { IConnectionData } from "../interfaces/connection.interfaces";
import { IIdentityData } from "../interfaces/identity.interfaces";
import { INamespaceData } from "../interfaces/namespace.interfaces";
import { IContract } from "../interfaces/contract.interfaces";
import { NamespaceService } from "./namespace.service";
import {
  UpdateTransaction,
  BaseTransaction
} from "../structures/transaction.structures";

// TODO: Refactor now that upload page doesn't exist

@Directive()
@Injectable({
  providedIn: "root"
})
export class UploadService {
  // #region Event emitters
  @Output() uploadStartEvent = new EventEmitter();
  @Output() uploadEndEvent = new EventEmitter();
  // #endregion

  // #region Internal data
  private contractBody: string;
  private contract: IContract;
  private version: string;
  private namespace: INamespaceData;
  private identity: IIdentityData;
  private connection: IConnectionData;
  // #endregion

  /**
   * Creates an instance of UploadService.
   * @param {DialogService} dialogService
   * @param {LedgerService} ledgerService
   * @param {NamespaceService} namespaceService
   * @memberof UploadService
   */
  constructor(
    private dialogService: DialogService,
    private ledgerService: LedgerService,
    private namespaceService: NamespaceService
  ) {}

  /**
   * Initialise the data needed for the upload process
   *
   * @param {MonacoEditorComponent} monaco
   * @param {ContractData} contract
   * @param {string} version
   * @param {NamespaceData} namespace
   * @param {IIdentityData} identity
   * @param {ConnectionData} connection
   * @returns {Promise<void>}
   * @memberof UploadService
   */
  public initialise(
    body: string,
    contract: IContract,
    version: string,
    identity: IIdentityData
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.contractBody = body;
      this.contract = contract;
      this.version = version;
      this.identity = identity;

      this.ledgerService
        .findById(this.identity.connection)
        .then((connection: IConnectionData) => {
          this.connection = connection;
          return this.namespaceService.findById(this.identity.namespace);
        })
        .then((namespace: INamespaceData) => {
          this.namespace = namespace;
          resolve();
        })
        .catch((err: unknown) => {
          reject(err);
        });
    });
  }

  /**
   * Begin the process of uploading the contract
   *
   * @returns {Promise<void>}
   * @memberof UploadService
   */
  public uploadContract(): Promise<IContract> {
    return new Promise((resolve, reject) => {
      this.uploadStartEvent.emit();

      this.checkInit()
        // Create transaction
        .then(() => {
          return this.createTransaction();
        })
        // Upload transaction
        .then((transaction: IBaseTransaction) => {
          return this.ledgerService.sendTransaction(
            transaction,
            this.identity,
            this.connection
          );
        })
        // Handle response Update onboardData and timestamps
        .then((ledgerResponse: any) => {
          return this.handleResponse(ledgerResponse);
        })
        .then(() => {
          // Show success message
          this.success();
          this.uploadEndEvent.emit();

          resolve(this.contract);
        })
        .catch((err: UploadErrorData) => {
          this.uploadEndEvent.emit();

          reject(err);
        });
    });
  }

  /**
   * Begin the process of updating a contract
   *
   * @returns {Promise<void>}
   * @memberof UploadService
   */
  public updateContract(): Promise<IContract> {
    this.uploadStartEvent.emit();

    return new Promise((resolve, reject) => {
      // Check that the contract has been uploaded
      this.checkInit()
        // Create transaction
        .then(() => {
          return this.createTransaction(true);
        })
        // Upload transaction
        .then((transaction: UpdateTransaction) => {
          return this.ledgerService.sendTransaction(
            transaction,
            this.identity,
            this.connection
          );
        })
        // Handle response
        .then((ledgerResponse: any) => {
          return this.handleResponse(ledgerResponse, true);
        })
        // Resolve
        .then(() => {
          // Show success message
          this.uploadEndEvent.emit();

          this.success(true);
          resolve(this.contract);
        })
        .catch((err: UploadErrorData) => {
          this.uploadEndEvent.emit();

          reject(err);
        });
    });
  }

  /**
   * Check the all required data has been initialised
   *
   * @private
   * @returns {Promise<void>}
   * @memberof UploadService
   */
  private checkInit(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.contractBody && this.contract) {
        resolve();
      } else if (this.contractBody && !this.contract) {
        const error: UploadErrorData = {
          description: "Contract Data not initialised in upload service.",
          code: "4101",
          error: "Contract Data not initialised in upload service."
        };
        reject(error);
      } else if (!this.contractBody && this.contract) {
        const error: UploadErrorData = {
          description: "Contract body not initialised in upload service.",
          code: "4102",
          error: "Contract body not initialised in upload service."
        };
        reject(error);
      } else {
        const error: UploadErrorData = {
          description:
            "Contract Data and monaco not initialised in upload service.",
          code: "4103",
          error: "Contract Data and monaco not initialised in upload service."
        };
        reject(error);
      }
    });
  }

  /**
   * Transaction builder
   * Returns BaseTransaction or UpdateTransaction
   *
   * @private
   * @param {boolean} [update]
   * @returns {Promise<IBaseTransaction>}
   * @memberof UploadService
   */
  private createTransaction(update?: boolean): Promise<IBaseTransaction> {
    return new Promise(resolve => {
      let transaction: IBaseTransaction;
      let body: string;
      let transactionVersion = "0.0.1";

      if (update) {
        const outputStream = Object.keys(
          this.contract.onboardData[this.identity._id]
        )[0];

        transaction = new UpdateTransaction();
        transaction.$tx.$o[outputStream] = {};
      } else {
        transaction = new BaseTransaction();
      }

      // Overwrite transactionVersion if possible
      if (this.version) {
        transactionVersion = this.version.replace("@latest", "");
      }

      if (this.contract.versions[this.version]) {
        body = this.contract.versions[this.version];
      } else {
        body = btoa(this.contractBody);
      }

      transaction.$tx.$i[this.identity.streamId] = {
        name: this.contract.name,
        version: transactionVersion,
        namespace: this.namespace.name,
        contract: body
      };

      resolve(transaction);
    });
  }

  /**
   * Handle the response data that is returned by the ledger
   *
   * @private
   * @param {*} response
   * @param {Boolean} [update]
   * @returns {Promise<void>}
   * @memberof UploadService
   */
  private handleResponse(response: any, update?: Boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      this.checkResponseValid(response)
        .then(() => {
          const onboardData = new ContractOnboardVersion();

          let stream: string;
          let ledgerName: string;

          const identity = this.identity._id;

          const cleanVersion = this.version.replace("@latest", "");

          if (update) {
            stream = response.$streams.updated[0].id;
            ledgerName = response.$streams.updated[0].name;
            this.contract.updated = new Date();
          } else {
            stream = response.$streams.new[0].id;
            ledgerName = response.$streams.new[0].name;
            this.contract.uploaded = new Date();
          }

          onboardData.updated = new Date();
          onboardData.uploaded = new Date();

          // Check for name change after upload and then update the local streamname
          const contractStreamName = onboardData.streamName;

          if (contractStreamName !== ledgerName) {
            onboardData.streamName = ledgerName;
          }

          onboardData.connection = this.connection._id;
          onboardData.identity = this.identity._id;
          onboardData.namespace = this.namespace._id;
          onboardData.streamId = stream;
          onboardData.streamName = ledgerName;
          onboardData.version = cleanVersion;

          if (!this.contract.onboardData[identity]) {
            this.contract.onboardData[identity] = {};
          }

          if (!this.contract.onboardData[identity][stream]) {
            this.contract.onboardData[identity][stream] = {};
          }

          this.contract.onboardData[identity][stream][
            cleanVersion
          ] = onboardData;

          resolve();
        })
        .catch((err: any) => {
          // Pass through from internal function
          reject(err);
        });
    });
  }

  /**
   * Check that the ledger response is valid, otherwise reject with a relevant error
   *
   * @private
   * @param {*} response
   * @returns {Promise<void>}
   * @memberof UploadService
   */
  private checkResponseValid(response: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (
        response &&
        response.$streams &&
        (response.$streams.new || response.$streams.updated) &&
        (response.$streams.new.length > 0 || response.$streams.updated.length)
      ) {
        resolve();
      } else {
        let error: UploadErrorData = {
          description: "Unknown error checking transaction response.",
          code: "4107",
          error: "Unknown error checking transaction response."
        };

        if (
          response &&
          response.$streams &&
          !(response.$streams.new || response.$streams.updated)
        ) {
          error = {
            description: "New or update streams not found.",
            code: "4108",
            error: response.summary.errors[0] || "Unknown Transaction Error"
          };
        }

        if (response && !response.$streams) {
          error = {
            description: "Streams not found.",
            code: "4109",
            error: response.summary.errors[0] || "Unknown Transaction Error"
          };
        }

        if (!response) {
          error = {
            description: "Response not defined.",
            code: "4110",
            error: response.summary.errors[0] || "Unknown Transaction Error"
          };
        }

        reject(error);
      }
    });
  }

  /**
   * Success message shown when manual upload/update
   *
   * @private
   * @param {boolean} [update]
   * @memberof UploadService
   */
  private success(update?: boolean): void {
    let message = "Contract upload succeeded.";
    if (update) {
      message = "Contract update succeeded.";
    }
    this.dialogService.info(message);
  }
}
