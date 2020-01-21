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

import { GeneralService } from "./general.service";
import { DatabaseService } from "../../providers/database.service";
import { IdentityService } from "./identity.service";
import { LedgerService } from "./ledger.service";

import { NamespaceData } from "../structures/namespace.structures";
import { NamespaceTransaction } from "../structures/transaction.structures";
import { IdentityData } from "../structures/identity.structure";

import { INamespaceData } from "../interfaces/namespace.interfaces";
import { IIdentityData } from "../interfaces/identity.interfaces";
import { IConnectionData } from "../interfaces/connection.interfaces";
import { DBTypes } from "../enums/db.enum";

@Injectable()
export class NamespaceService {
  private logger = (window as any).logger;

  /**
   * Creates an instance of NamespaceService.
   * @param {GeneralService} general
   * @param {DatabaseService} dbService
   * @param {IdentityService} identityService
   * @param {LedgerService} ledgerService
   * @memberof NamespaceService
   */
  constructor(
    private general: GeneralService,
    private dbService: DatabaseService,
    private identityService: IdentityService,
    private ledgerService: LedgerService
  ) {}

  // #region Getters
  /**
   * Get all stored namespaces
   *
   * @returns {Promise<Array<INamespaceData>>}
   * @memberof NamespaceService
   */
  public getNamespaces(): Promise<Array<INamespaceData>> {
    return this.dbService.findByType(DBTypes.NAMESPACE);
  }

  /**
   * Get a namespace using the ID provided
   *
   * @param {string} id
   * @returns {Promise<INamespaceData>}
   * @memberof NamespaceService
   */
  public findById(id: string): Promise<INamespaceData> {
    return this.dbService.findById(id);
  }

  /**
   * Get the namespace that is linked to an identity
   *
   * @param {string} identity
   * @returns {Promise<Array<INamespaceData>>}
   * @memberof NamespaceService
   */
  public findByIdentity(identity: string): Promise<Array<INamespaceData>> {
    return new Promise<Array<INamespaceData>>((resolve, reject) => {
      if (identity === "") {
        return reject("Identity cannot be blank.");
      }

      // TODO: Make this a query
      this.getNamespaces()
        .then((namespaces: Array<INamespaceData>) => {
          let namespaceArray = new Array<INamespaceData>();

          let i = namespaces.length;
          while (i--) {
            if (namespaces[i].identity === identity) {
              namespaceArray.push(namespaces[i]);
            }
          }

          namespaceArray = this.general.reverseArray(namespaceArray);

          resolve(namespaceArray);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  // #endregion

  // #region Setters

  /**
   * Create a new namespace
   *
   * @param {INamespaceData} namespace
   * @param {string} identityId
   * @returns {Promise<INamespaceData>}
   * @memberof NamespaceService
   */
  public create(
    namespace: INamespaceData,
    identityId: string
  ): Promise<INamespaceData> {
    return new Promise((resolve, reject) => {
      namespace.identity = identityId;

      this.onboard(namespace)
        .then(() => {
          return this.save(namespace);
        })
        .then((storedData: INamespaceData) => {
          resolve(storedData);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  // #endregion

  // #region Internal save

  /**
   * Run the transaction that will onboard the namespace
   *
   * @private
   * @param {INamespaceData} namespace
   * @returns {Promise<void>}
   * @memberof NamespaceService
   */
  private onboard(namespace: INamespaceData): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const transaction = new NamespaceTransaction();
      let identity = new IdentityData();

      this.identityService
        .findById(namespace.identity)
        .then((_identity: IIdentityData) => {
          identity = _identity;
          transaction.$tx.$i[identity.streamId] = {
            namespace: namespace.name
          };
          return this.ledgerService.findById(identity.connection);
        })
        .then((connection: IConnectionData) => {
          return this.ledgerService.sendTransaction(
            transaction,
            identity,
            connection
          );
        })
        .then(() => {
          resolve();
        })
        .catch((err: any) => {
          reject(`Error onboarding namespace. ${err}`);
        });
    });
  }

  /**
   * Save the namespace to the local database
   *
   * @private
   * @param {NamespaceData} namespace
   * @returns {Promise<NamespaceData>}
   * @memberof NamespaceService
   */
  private save(namespace: NamespaceData): Promise<NamespaceData> {
    return new Promise((resolve, reject) => {
      namespace.type = DBTypes.NAMESPACE;
      this.dbService
        .add(namespace)
        .then((storedData: NamespaceData) => {
          resolve(storedData);
          this.logger.info(
            `Namespace saved\nConnected to identity: ${namespace.identity}`
          );
        })
        .catch((err: any) => {
          this.logger.error(
            "There was an error trying to save the namespace..."
          );
          reject(err);
        });
    });
  }
  // #endregion
}
