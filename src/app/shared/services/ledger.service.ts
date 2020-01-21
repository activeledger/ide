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
import { DatabaseService } from "../../providers/database.service";
import { ConnectionData } from "../structures/connection.structures";
import { IIdentityData } from "../interfaces/identity.interfaces";
import { KeyService } from "./key.service";
import { IKeyData } from "../interfaces/key.interfaces";
import {
  IBaseTransaction,
  ILedgerResponse,
  Connection,
  IKey,
  TransactionHandler
} from "@activeledger/sdk";
import { DBTypes } from "../enums/db.enum";

/**
 * Provides ledger functionality
 *
 * @export
 * @class LedgerService
 */
@Injectable()
export class LedgerService {
  /**
   * Logs output to custom console
   *
   * @private
   * @memberof LedgerService
   */
  private logger = (window as any).logger;

  /**
   * Creates an instance of LedgerService.
   * @param {DatabaseService} dbService
   * @param {KeyService} keyService
   * @memberof LedgerService
   */
  constructor(
    private dbService: DatabaseService,
    private keyService: KeyService
  ) {}

  // #region Getters
  /**
   * Find a connection by its ID
   *
   * @param {string} id
   * @returns {Promise<ConnectionData>}
   * @memberof LedgerService
   */
  findById(id: string): Promise<ConnectionData> {
    return this.dbService.findById(id);
  }

  /**
   * Get a list of connections
   *
   * @returns {Promise<Array<ConnectionData>>}
   * @memberof LedgerService
   */
  public getConnections(): Promise<Array<ConnectionData>> {
    return this.dbService.findByType<ConnectionData>(DBTypes.CONNECTION);
  }
  // #endregion

  // #region Connections
  /**
   * Add a new connection to the configuration
   *
   * @param {ConnectionData} newConnection
   * @returns {Promise<void>}
   * @memberof ConfigService
   */
  public addConnection(newConnection: ConnectionData): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Make sure type is set
      newConnection.type = DBTypes.CONNECTION;

      this.dbService
        .add(newConnection)
        .then(() => {
          this.logger.info(`Connection added\n${newConnection}`);
          resolve();
        })
        .catch((err: any) => {
          this.logger.error(`Connection not added\n${newConnection}`);
          reject(err);
        });
    });
  }

  /**
   * Update the data of a saved connection
   *
   * @param {ConnectionData} connection
   * @returns {Promise<void>}
   * @memberof LedgerService
   */
  updateConnection(connection: ConnectionData): Promise<void> {
    return this.dbService.update(connection);
  }

  /**
   * Remove a stored connection
   *
   * @param {ConnectionData} connection
   * @returns {Promise<boolean>}
   * @memberof LedgerService
   */
  public removeConnection(connection: ConnectionData): Promise<boolean> {
    return this.dbService.remove(connection._id);
  }
  // #endregion

  // #region Transactions
  /**
   * Send a transaction to the ledger
   *
   * @param {string} transaction
   * @param {string} url
   * @returns
   * @memberof LedgerService
   */
  sendTransaction(
    transaction: IBaseTransaction,
    identity: IIdentityData,
    connectionData: ConnectionData
  ): Promise<ILedgerResponse> {
    return new Promise((resolve, reject) => {
      const txHandler = new TransactionHandler();

      const connection = new Connection(
        connectionData.protocol,
        connectionData.address,
        parseInt(connectionData.port, 10),
        connectionData.encrypt
      );

      this.keyService
        .findById(identity.key)
        .then(async (key: IKeyData) => {
          const keyHolder: IKey = {
            key: {
              prv: key.prv,
              pub: key.pub
            },
            identity: identity.streamId,
            name: key.name,
            type: key.encryption
          };

          return txHandler.signTransaction(transaction, keyHolder);
        })
        .then((signedTransaction: IBaseTransaction) => {
          this.logger.info("Attempting to send the following transaction...");
          this.logger.info(JSON.stringify(signedTransaction));

          return txHandler.sendTransaction(signedTransaction, connection);
        })
        .then((ledgerResp: ILedgerResponse) => {
          if (ledgerResp.$summary.commit === 0) {
            reject((ledgerResp.$summary as any).errors[0]);
          } else {
            resolve(ledgerResp);
          }
        })
        .catch((err: unknown) => {
          reject(err);
          console.error(err);
        });
    });
  }
  // #endregion
}
