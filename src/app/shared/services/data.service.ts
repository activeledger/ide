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
import { KeyService } from "./key.service";
import { NamespaceService } from "./namespace.service";
import { LedgerService } from "./ledger.service";
import { ContractService } from "./contract.service";
import { ConnectionData } from "../structures/connection.structures";
import { ContractData } from "../structures/contract.structures";
import { KeyData } from "../structures/key.structures";
import { NamespaceData } from "../structures/namespace.structures";

/**
 * Provides getters for various data
 *
 * @export
 * @class DataService
 */
@Injectable({
  providedIn: "root"
})
export class DataService {
  /**
   * Data holders
   *
   * @private
   * @memberof DataService
   */
  private dataArrays = {
    connections: new Array<ConnectionData>(),
    contracts: new Array<ContractData>(),
    keys: new Array<KeyData>(),
    namespaces: new Array<NamespaceData>()
  };

  /**
   * Creates an instance of DataService.
   * @param {KeyService} keyService
   * @param {NamespaceService} namespaceService
   * @param {LedgerService} ledgerService
   * @param {ContractService} contractService
   * @memberof DataService
   */
  constructor(
    private keyService: KeyService,
    private namespaceService: NamespaceService,
    private ledgerService: LedgerService,
    private contractService: ContractService
  ) {}

  /**
   * Get the list of keys
   *
   * @private
   * @memberof ContractsComponent
   */
  private getKeys(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.keyService
        .getKeys()
        .then((keyData: Array<KeyData>) => {
          this.dataArrays.keys = keyData;
          resolve();
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /**
   * Get the list of namespaces
   *
   * @private
   * @memberof ContractsComponent
   */
  private getNamespaces(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.namespaceService
        .getNamespaces()
        .then((namespaceData: Array<NamespaceData>) => {
          this.dataArrays.namespaces = namespaceData;
          resolve();
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /**
   * Get the list of connections
   *
   * @private
   * @memberof ContractsComponent
   */
  private getConnections(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ledgerService
        .getConnections()
        .then((connectionData: Array<ConnectionData>) => {
          this.dataArrays.connections = connectionData;
          resolve();
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /**
   * Get the list of contracts
   *
   * @private
   * @memberof ContractsComponent
   */
  public getContracts(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contractService
        .getContracts()
        .then((contracts: Array<ContractData>) => {
          this.dataArrays.contracts = contracts;
          resolve(contracts);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /**
   * Get all data
   *
   * @returns {Promise<any>}
   * @memberof DataService
   */
  public getDataArrays(): Promise<any> {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getKeys(),
        this.getNamespaces(),
        this.getConnections(),
        this.getContracts()
      ])
        .then(() => {
          resolve(this.dataArrays);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
}
