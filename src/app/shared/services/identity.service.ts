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
import * as activeledgerSdk from "@activeledger/sdk";

import { DatabaseService } from "../../providers/database.service";
import { LedgerService } from "./ledger.service";
import { KeyService } from "./key.service";

import { IIdentityData } from "../interfaces/identity.interfaces";
import { IConnectionData } from "../interfaces/connection.interfaces";
import { DBTypes } from "../enums/db.enum";

/**
 * Handles Identity functions
 *
 * @export
 * @class IdentityService
 */
@Injectable({
  providedIn: "root"
})
export class IdentityService {
  /**
   * Creates an instance of IdentityService.
   * @param {DatabaseService} dbService
   * @param {LedgerService} ledgerService
   * @param {KeyService} keyService
   * @memberof IdentityService
   */
  constructor(
    private dbService: DatabaseService,
    private ledgerService: LedgerService,
    private keyService: KeyService
  ) {}

  // #region Getters
  /**
   * Get a list of all identities
   *
   * @returns {Promise<Array<IIdentityData>>}
   * @memberof IdentityService
   */
  public getIdentities(): Promise<Array<IIdentityData>> {
    return this.dbService.findByType(DBTypes.IDENTITY);
  }

  /**
   * Find an identity using its ID
   *
   * @param {string} id
   * @returns {Promise<IIdentityData>}
   * @memberof IdentityService
   */
  public findById(id: string): Promise<IIdentityData> {
    return this.dbService.findById(id);
  }

  /**
   * Find all the identities created with the provided key ID
   *
   * @param {string} keyId
   * @returns {Promise<Array<IIdentityData>>}
   * @memberof IdentityService
   */
  public findByKey(keyId: string): Promise<Array<IIdentityData>> {
    return new Promise((resolve, reject) => {
      // TODO: Write findByKey function
    });
  }

  /**
   * Find an identity using a stream ID
   *
   * @param {string} stream
   * @returns {Promise<IIdentityData>}
   * @memberof IdentityService
   */
  public findByStream(stream: string): Promise<IIdentityData> {
    return new Promise((resolve, reject) => {
      this.getIdentities()
        .then((identities: Array<IIdentityData>) => {
          let i = identities.length;
          let found = false;
          while (i--) {
            if (identities[i].streamId === stream) {
              found = true;
              resolve(identities[i]);
              break;
            }
          }

          if (!found) {
            reject("No identity found");
          }
        })
        .catch((err: unknown) => {
          reject(err);
        });
    });
  }
  // #endregion

  // #region Setters
  public update(updatedIdentity: IIdentityData): Promise<void> {
    return this.dbService.update(updatedIdentity);
  }

  /**
   * Create a new Identity
   *
   * @param {IIdentityData} identity
   * @param {string} connectionId
   * @returns {Promise<IIdentityData>}
   * @memberof IdentityService
   */
  public create(
    identity: IIdentityData,
    connectionId: string
  ): Promise<IIdentityData> {
    return new Promise(async (resolve, reject) => {
      const connection = await this.ledgerService.findById(connectionId);

      this.onboard(identity, connection)
        .then((onboardedIdentity: IIdentityData) => {
          return this.save(onboardedIdentity);
        })
        .then((savedIdentity: IIdentityData) => {
          resolve(savedIdentity);
        })
        .catch((err: unknown) => {
          console.error(err);
          reject(err);
        });
    });
  }

  /**
   * Add an identity to the local database
   *
   * @private
   * @param {IIdentityData} identity
   * @returns {Promise<IIdentityData>}
   * @memberof IdentityService
   */
  private save(identity: IIdentityData): Promise<IIdentityData> {
    return this.dbService.add<IIdentityData>(identity);
  }

  /**
   * On board an identity to the specified ledger
   *
   * @param {IIdentityData} identity
   * @param {IConnectionData} connection
   * @returns {Promise<IIdentityData>} Returns the updated identity object
   * @memberof IdentityService
   */
  private onboard(
    identity: IIdentityData,
    connectionData: IConnectionData
  ): Promise<IIdentityData> {
    return new Promise(async (resolve, reject) => {
      const key = await this.keyService.findById(identity.key);

      const connection = new activeledgerSdk.Connection(
        connectionData.protocol,
        connectionData.address,
        parseInt(connectionData.port, 10)
      );

      const keyHandler = new activeledgerSdk.KeyHandler();
      const keyHolder: activeledgerSdk.IKey = {
        key: {
          prv: key.prv,
          pub: key.pub
        },
        name: identity.name,
        type: key.encryption
      };

      keyHandler
        .onboardKey(keyHolder, connection)
        .then((ledgerResp: activeledgerSdk.ILedgerResponse) => {
          if (ledgerResp.$streams) {
            identity.streamId = ledgerResp.$streams.new[0].id;

            resolve(identity);
          } else {
            reject("No streams, must have errored.");
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  // #endregion
}
