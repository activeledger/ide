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
import { IConnectionData } from "../../../shared/interfaces/connection.interfaces";
import { LedgerService } from "../../../shared/services/ledger.service";
import {
  IBaseTransaction,
  IKey,
  TransactionHandler,
  ILedgerResponse,
  Connection,
} from "@activeledger/sdk";
import { IdentityService } from "../../../shared/services/identity.service";
import { IIdentityData } from "../../../shared/interfaces/identity.interfaces";
import { KeyService } from "../../../shared/services/key.service";
import { IKeyData } from "../../../shared/interfaces/key.interfaces";
import * as url from "url";

import * as ace from "brace";
import "brace/mode/json";
import "brace/theme/merbivore_soft";
import "brace/ext/beautify";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { IResponse } from "../../../shared/interfaces/run.interface";
import { TransactionService } from "../../../shared/services/transaction.service";
import {
  IHistoricalTransaction,
  ISavedTransaction,
  ITransactionResponse,
} from "../../../shared/interfaces/transaction.interfaces";

@Component({
  selector: "app-run",
  templateUrl: "./run.component.html",
  styleUrls: ["./run.component.scss"],
})
export class RunComponent implements OnInit {
  // #region UI Data

  /**
   * UI Control
   *
   * @memberof RunComponent
   */
  public setup = {
    showSaved: true,
    runningTransaction: false,
    gotResponse: false,
  };

  /**
   * Array of saved transactions
   *
   * @memberof RunComponent
   */
  public savedTransactions: ISavedTransaction[] = [];

  /**
   * Array of transaction history
   *
   * @memberof RunComponent
   */
  public historicalTransactions: IHistoricalTransaction[] = [];

  /**
   * Holds available connection
   *
   * @memberof RunComponent
   */
  public connections = new Array<IConnectionData>();

  /**
   * Holds the selected connection
   *
   * @type {IConnectionData}
   * @memberof RunComponent
   */
  public selectedConnection: IConnectionData;

  /**
   * Holds the entered custom connection
   *
   * @type {string}
   * @memberof RunComponent
   */
  public customConnection: string;

  /**
   * The name of the transaction, used when saving
   *
   * @memberof RunComponent
   */
  public transactionName = "Unsaved";

  /**
   * Whether the transaction should be encrypted or not
   *
   * @memberof RunComponent
   */
  public encryptedTransaction = false;

  /**
   * Save icon
   *
   * @memberof RunComponent
   */
  public saveIcon = faSave;

  /**
   * Holds the response metadata
   *
   * @type {IResponse}
   * @memberof RunComponent
   */
  public response: IResponse = {
    time: "0",
    size: "0",
  };

  // #endregion

  // #region Internal data

  /**
   * The main JSON transaction editor
   *
   * @private
   * @memberof RunComponent
   */
  private editor;

  /**
   * A read only editor for vieweing the response
   *
   * @private
   * @memberof RunComponent
   */
  private responseViewer;

  // #endregion

  /**
   * Creates an instance of RunComponent.
   * @param {LedgerService} ledger
   * @param {IdentityService} identityService
   * @param {KeyService} keyService
   * @memberof RunComponent
   */
  constructor(
    private ledger: LedgerService,
    private identityService: IdentityService,
    private keyService: KeyService,
    private txService: TransactionService
  ) {
    this.getConnections();
  }

  // #region Angular control
  ngOnInit() {
    // Setup the editors
    this.editor = ace.edit("json-editor");
    this.editor.getSession().setMode("ace/mode/json");
    this.editor.setTheme("ace/theme/merbivore_soft");

    this.responseViewer = ace.edit("response-output");
    this.responseViewer.getSession().setMode("ace/mode/json");
    this.responseViewer.setTheme("ace/theme/merbivore_soft");
    this.responseViewer.setReadOnly(true);

    // TODO: Pull through templates from contracts

    // Insert a transaction template
    this.editor.setValue(
      JSON.stringify(
        {
          $tx: {
            $namespace: "",
            $contract: "",
            $entry: "",
            $i: {},
            $o: {},
          },
          $sigs: {},
        },
        null,
        4
      )
    );

    this.editor.clearSelection();
    this.editor.moveCursorTo(0, 0);

    this.getStoredTransactions();
  }
  // #endregion

  // #region UI Controls

  // #endregion

  // #region Getters
  /**
   * Get available connections
   *
   * @private
   * @memberof RunComponent
   */
  private async getConnections() {
    this.connections = await this.ledger.getConnections();
  }

  /**
   * Get historical and saved transactions
   *
   * @private
   * @memberof RunComponent
   */
  private getStoredTransactions(): void {
    this.txService
      .getHistory()
      .then((transactions: IHistoricalTransaction[]) => {
        this.historicalTransactions = transactions;
      })
      .catch((err: unknown) => {
        console.error(err);
      });

    this.txService
      .getSaved()
      .then((transactions: ISavedTransaction[]) => {
        this.savedTransactions = transactions;
        console.log(this.savedTransactions);
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }
  // #endregion

  // #region Send Transaction

  /**
   * Set the output value to be displayed
   *
   * @private
   * @template T
   * @param {T} data
   * @param {boolean} [isJson=false]
   * @memberof RunComponent
   */
  private setOutputValue<T>(data: T, isJson: boolean = false): void {
    let value: string | T = data;

    if (isJson) {
      value = JSON.stringify(data, null, 4);
    }

    this.setup.runningTransaction = false;
    this.setup.gotResponse = true;

    this.responseViewer.setValue(value);
    this.responseViewer.clearSelection();
  }

  /**
   * Run the given transaction
   *
   * @returns
   * @memberof RunComponent
   */
  public runTransaction() {
    // Check given data for errors

    let transaction;
    try {
      transaction = JSON.parse(this.editor.getValue());
    } catch (err) {
      this.setOutputValue(err.toString(), true);
      return;
    }

    if (!transaction || transaction === null || transaction === "") {
      this.setOutputValue(`"Invalid transaction"`);
      return;
    }

    if (!this.selectedConnection && !this.customConnection) {
      this.setOutputValue(`"No Connection"`);
      return;
    }

    // Only show the loader if JSON is correct
    this.setup.gotResponse = false;
    this.setup.runningTransaction = true;

    /*
    1. Check if we have the identity stored
     - Yes: Generate signature
        - Send transaction
     - No: Check if a signature has been provided
        - Yes: Send transaction
        - No: Output error
    */

    // Used to calculate the response time
    let startTime: number, signedTx: IBaseTransaction;

    this.identityService
      .findByStream(this.findIdenfromTx(transaction.$tx.$i))
      .then((identity: IIdentityData) => {
        return this.keyService.findById(identity.key);
      })
      .then((key: IKeyData) => {
        return this.signTransaction(transaction, key);
      })
      .then((_signedTx: IBaseTransaction) => {
        signedTx = _signedTx;
        startTime = Date.now();
        return this.sendTransaction(signedTx);
      })
      .then((response: ILedgerResponse) => {
        this.response.time = (Date.now() - startTime).toString();
        this.response.size = this.getResponseSize(response);

        this.setOutputValue<ILedgerResponse>(response, true);
        this.addTransactionToHistory(signedTx, response);
      })
      .catch((err: unknown) => {
        if (err === "No identity found") {
          if (Object.keys(transaction.$sigs).length > 0) {
            startTime = Date.now();
            this.sendTransaction(transaction)
              .then((response: ILedgerResponse) => {
                this.response.time = (Date.now() - startTime).toString();
                this.response.size = this.getResponseSize(response);

                this.setOutputValue<ILedgerResponse>(response, true);
                this.addTransactionToHistory(transaction, response);
              })
              .catch((err2: unknown) => {
                this.setup.runningTransaction = false;
                this.setOutputValue(err2, true);
              });
          } else {
            this.setup.runningTransaction = false;

            this.setOutputValue(
              "We couldn't find a matching identity and the transaction does not contain a signature.",
              true
            );
          }
        } else {
          this.setup.runningTransaction = false;
          this.setOutputValue(err, true);
        }
      });
  }

  /**
   * Finds the first identity from a transaction. Either input or $stream labeled
   *
   * @private
   * @param {object} txInputs
   * @returns {string}
   * @memberof RunComponent
   */
  private findIdenfromTx(txInputs: object): string {
    try {
      const txKeys = Object.keys(txInputs as object);
      return txInputs[txKeys[0]].$stream || txKeys[0];
    } catch (error) {
      this.setup.runningTransaction = false;
      this.setOutputValue(error, true);
    }
  }

  /**
   * Get the transaction response size
   *
   * @private
   * @template T
   * @param {T} response
   * @returns {string}
   * @memberof RunComponent
   */
  private getResponseSize<T>(response: T): string {
    const size = JSON.stringify(response).length;
    let sizeOutput;

    if (size >= 1000000) {
      const newSize = (size / 1000000).toString().substr(0, 4);
      sizeOutput = `${newSize} MB`;
    } else if (size >= 1000) {
      const newSize = (size / 1000).toString().substr(0, 4);
      sizeOutput = `${newSize} KB`;
    } else {
      sizeOutput = `${size} B`;
    }

    return sizeOutput;
  }

  /**
   * Sign the transaction
   *
   * @private
   * @param {IBaseTransaction} transaction
   * @param {IKeyData} keyData
   * @returns {Promise<IBaseTransaction>}
   * @memberof RunComponent
   */
  private signTransaction(
    transaction: IBaseTransaction,
    keyData: IKeyData
  ): Promise<IBaseTransaction> {
    const txHandler = new TransactionHandler();
    const key: IKey = {
      key: {
        prv: keyData.prv,
        pub: keyData.pub,
      },
      identity: this.findIdenfromTx(transaction.$tx.$i),
      name: keyData.name,
      type: keyData.encryption,
    };

    return txHandler.signTransaction(transaction, key);
  }

  /**
   * Send the transaction to the ledger
   *
   * @private
   * @param {IBaseTransaction} transaction
   * @returns {Promise<ILedgerResponse>}
   * @memberof RunComponent
   */
  private sendTransaction(
    transaction: IBaseTransaction
  ): Promise<ILedgerResponse> {
    return new Promise((resolve, reject) => {
      let connection: Connection;

      if (this.selectedConnection) {
        connection = new Connection(
          this.selectedConnection.protocol,
          this.selectedConnection.address,
          parseInt(this.selectedConnection.port, 0),
          this.selectedConnection.encrypt
        );
      } else {
        const path = url.parse(this.customConnection);

        connection = new Connection(
          path.protocol.replace(":", "").replace("//", ""),
          path.hostname,
          parseInt(path.port, 0),
          this.encryptedTransaction
        );
      }

      const txHandler = new TransactionHandler();

      txHandler
        .sendTransaction(transaction, connection)
        .then((ledgerResp: ILedgerResponse) => {
          resolve(ledgerResp);
        })
        .catch((err: unknown) => {
          reject(err);
        });
    });
  }
  // #endregion

  // #region Save/Load Transaction
  /**
   * Save a transaction
   *
   * @memberof RunComponent
   */
  public saveTransaction(): void {
    const data: ISavedTransaction = {
      name: this.transactionName,
      transaction: JSON.stringify(JSON.parse(this.editor.getValue())),
      connectionId: this.customConnection,
      connectionCustom: true,
      timestamp: Date.now(),
    };

    if (this.selectedConnection) {
      data.connectionId = this.selectedConnection._id;
      data.connectionCustom = false;
    }

    this.txService
      .save(data)
      .then((r) => {
        console.log(r);
        this.getStoredTransactions();
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }
  // #endregion

  // #region Transaction History
  /**
   * Add a transaction to the history
   *
   * @private
   * @param {IBaseTransaction} transaction
   * @param {ILedgerResponse} response
   * @memberof RunComponent
   */
  private addTransactionToHistory(
    transaction: IBaseTransaction,
    response: ILedgerResponse
  ): void {
    const responseData: ITransactionResponse = {
      data: JSON.stringify(response),
      time: this.response.time,
      size: this.response.size,
    };

    const historicalData: IHistoricalTransaction = {
      transaction: JSON.stringify(transaction),
      connectionId: this.customConnection,
      connectionCustom: true,
      connectionName: this.customConnection,
      response: responseData,
      timestamp: Date.now(),
    };

    if (this.selectedConnection) {
      historicalData.connectionId = this.selectedConnection._id;
      (historicalData.connectionCustom = false),
        (historicalData.connectionName = this.selectedConnection.name);
    }

    this.txService
      .addToHistory(historicalData)
      .then(() => {
        this.getStoredTransactions();
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }

  // #endregion

  // #region Transaction control
  /**
   * Open a saved or historical transaction
   *
   * @template T
   * @param {T} transaction
   * @memberof RunComponent
   */
  public openTransaction<T extends IHistoricalTransaction | ISavedTransaction>(
    transaction: T
  ): void {
    // Reset everything first
    this.customConnection = undefined;
    this.selectedConnection = undefined;
    this.editor.setValue("");
    this.setOutputValue("");
    this.setup.gotResponse = false;
    this.setup.runningTransaction = false;

    // Set the connection
    if (transaction.connectionCustom) {
      this.customConnection = transaction.connectionId;
    } else {
      let i = this.connections.length;
      while (i--) {
        if (this.connections[i]._id === transaction.connectionId) {
          this.selectedConnection = this.connections[i];
        }
      }
    }

    // Set the transaction data
    this.editor.setValue(
      JSON.stringify(JSON.parse(transaction.transaction), null, 4)
    );
    this.editor.clearSelection();

    // Set the response (if data is historical transaction)
    if (this.txService.instanceOfIHistoricalTransaction(transaction)) {
      const tx: IHistoricalTransaction = transaction;
      this.setOutputValue(JSON.parse(tx.response.data), true);

      this.response.size = tx.response.size;
      this.response.time = tx.response.time;
    }
  }

  public clearHistory(): void {
    this.txService.clearHistory().then(() => {
      this.getStoredTransactions();
    });
  }

  // #endregion
}
