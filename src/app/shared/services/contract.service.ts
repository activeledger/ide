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

import { Injectable, EventEmitter, Output } from "@angular/core";

import { DatabaseService } from "../../providers/database.service";
import { UploadService } from "./upload.service";
import { IdentityService } from "./identity.service";

import { ContractData } from "../structures/contract.structures";

import { IContract } from "../interfaces/contract.interfaces";
import { IIdentityData } from "../interfaces/identity.interfaces";
import { DBTypes } from "../enums/db.enum";
import { GeneralService } from "./general.service";

@Injectable({
  providedIn: "root"
})
export class ContractService {
  // #region Event emitters
  @Output() uploadContractEvent = new EventEmitter();
  @Output() openContractEvent = new EventEmitter();
  // #endregion

  /**
   * Creates an instance of ContractService.
   * @param {DatabaseService} dbService
   * @param {UploadService} uploadService
   * @param {IdentityService} identityService
   * @memberof ContractService
   */
  constructor(
    private dbService: DatabaseService,
    private uploadService: UploadService,
    private identityService: IdentityService,
    private generalService: GeneralService
  ) {}

  // #region Run event
  public sendUploadContractEvent(identityId: string, update?: boolean): void {
    this.uploadContractEvent.emit({ update: update, identityId: identityId });
  }

  public sendOpenContractEvent(contractId: string): void {
    this.findById(contractId)
      .then((contract: IContract) => {
        this.openContractEvent.emit({ contract });
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }
  // #endregion

  public getContracts(): Promise<Array<ContractData>> {
    return this.dbService.findByType<ContractData>(DBTypes.CONTRACT);
  }

  public findById(id: string): Promise<ContractData> {
    return this.dbService.findById<ContractData>(id);
  }

  public update(contract: ContractData): Promise<void> {
    return this.dbService.update<ContractData>(contract);
  }

  private checkForIO(contract: ContractData): Promise<ContractData> {
    return new Promise<ContractData>(resolve => {
      const versions = Object.keys(contract.versions);
      let latest = "";
      let ioVersion = "";
      let io = {};

      let i = versions.length;
      while (i--) {
        const version = versions[i];
        if (version.indexOf("@latest") !== -1) {
          latest = atob(contract.versions[version]);
          ioVersion = version.replace("@latest", "");
          break;
        }
      }

      if (latest.indexOf("#io") !== -1) {
        try {
          io = JSON.parse(
            latest
              .substring(latest.indexOf("#io") + 3, latest.indexOf("#endio"))
              .trim()
          );

          contract.versionIO[ioVersion] = io;

          (window as any).logger.info("IO Object found and stored");
        } catch (err) {
          console.error(err);
          (window as any).logger
            .error(`There was an error parsing the IO data, the contract will be stored without it.
The contract body will still contain the #io region, please check the JSON and try again.\n${err}`);
        }
      }

      resolve(contract);
    });
  }

  /**
   * Save the contract
   *
   * @param {ContractData} contract
   * @returns {Promise<any>}
   * @memberof ContractService
   */
  public save(contract: ContractData): Promise<ContractData> {
    return new Promise((resolve, reject) => {
      this.checkForIO(contract)
        .then((_contract: ContractData) => {
          return this.dbService.add<ContractData>(_contract);
        })
        .then((resp: ContractData) => {
          resolve(resp);
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  /**
   * Clear "@latest" from the contract versions
   *
   * @param {string} id
   * @param {IContract} [contract]
   * @returns {Promise<ContractData>}
   * @memberof ContractService
   */
  public clearLatest(id: string, contract?: IContract): Promise<ContractData> {
    return new Promise(async (resolve, reject) => {
      if (!contract) {
        try {
          contract = await this.findById(id);
        } catch (err) {
          reject(err);
        }
      }

      const identities = Object.keys(contract.versions);
      let i = identities.length;
      const temp = {
        identity: "",
        body: ""
      };

      while (i--) {
        if (identities[i].indexOf("@latest") > -1) {
          temp.identity = identities[i].slice(0, identities[i].indexOf("@"));
          temp.body = contract.versions[identities[i]];
          delete contract.versions[identities[i]];
          contract.versions[temp.identity] = temp.body;
        }
      }

      resolve(contract);
    });
  }

  /**
   * Upload the contract
   *
   * @param {string} contractBody
   * @param {IContract} contract
   * @param {string} version
   * @param {string} identityId
   * @param {boolean} [update]
   * @returns {Promise<void>}
   * @memberof ContractService
   */
  public uploadContract(
    contractBody: string,
    contract: IContract,
    version: string,
    identityId: string,
    update?: boolean
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // We can't upload an unnamed contract so give it a name and version
      if (!contract._id) {
        contract.name = "Autosave: " + new Date();
        version = "0.0.1";
      }

      this.identityService
        .findById(identityId)
        .then((identity: IIdentityData) => {
          return this.uploadService.initialise(
            contractBody,
            contract,
            version,
            identity
          );
        })
        .then(() => {
          if (update) {
            return this.uploadService.updateContract();
          } else {
            return this.uploadService.uploadContract();
          }
        })
        .then((uploadedData: IContract) => {
          if (contract._id) {
            return this.update(contract);
          } else {
            return this.autoSave(contractBody, version, uploadedData);
          }
        })
        .then(() => {
          resolve();
        })
        .catch((err: unknown) => {
          reject(err);
        });
    });
  }

  /**
   * If a contract has been saved before the upload process is initialised this should be run
   *
   * @private
   * @param {*} body
   * @param {*} version
   * @param {*} contract
   * @returns {Promise<void>}
   * @memberof ContractService
   */
  private async autoSave(body, version, contract): Promise<void> {
    if (!this.generalService.isb64(body)) {
      body = btoa(body);
    }

    contract.versions[version] = body;
    await this.save(contract);

    return Promise.resolve();
  }
}
