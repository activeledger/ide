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
import { MatDialog } from "@angular/material";
import { SaveContractDialogComponent } from "../dialogs/save-contract-dialog/save-contract-dialog.component";
import { ContractService } from "./contract.service";
import { DialogService } from "./dialog.service";
import { ContractData } from "../structures/contract.structures";
import { SaveErrorData } from "../classes/errors.classes";
import { ISaveDialogData } from "../interfaces/dialog.interfaces";
import { IWorkflowData } from "../interfaces/workflow.interfaces";
import { ISaveData, IContract } from "../interfaces/contract.interfaces";

/**
 * Handle saving a contract via dialog or workflow
 *
 * Dialog: Set name and version
 * Workflow: Automatic data setting and contract running
 *
 * @export
 * @class SaveService
 */
@Injectable({
  providedIn: "root"
})
export class SaveService {
  /**
   * The new contract body to be saved
   *
   * @private
   * @type {string}
   * @memberof SaveService
   */
  private editedBody: string;

  /**
   *
   *
   * @private
   * @type {*}
   * @memberof SaveService
   */
  private data: any;

  /**
   * The contract to be updated
   *
   * @private
   * @type {ContractData}
   * @memberof SaveService
   */
  private contract: ContractData;

  /**
   * Flag set to true if contract is new
   *
   * @private
   * @memberof SaveService
   */
  private isNew = false;

  /**
   * Flag set to true is this version is to be overwritten
   *
   * @private
   * @memberof SaveService
   */
  private overwrite = false;

  /**
   * Creates an instance of SaveService.
   *
   * @param {MatDialog} dialog
   * @param {ContractService} contractService
   * @param {DialogService} dialogService
   * @memberof SaveService
   */
  constructor(
    private dialog: MatDialog,
    private contractService: ContractService,
    private dialogService: DialogService
  ) {}

  /**
   * Main contract function for contract saving using dialog
   *
   * @param {ContractData} contract
   * @param {string} editedBody
   * @param {boolean} showSaveAndClose
   * @param {boolean} workflow - true if called via a worflow
   * @param {boolean} isNew - True is saving a new contract
   * @returns {Promise<ISaveData>}
   * @memberof SaveService
   */
  public saveContract(
    contract: IContract,
    editedBody: string,
    showSaveAndClose?: boolean,
    workflowData?: IWorkflowData
  ): Promise<ISaveData> {
    this.editedBody = editedBody;
    this.contract = contract;

    if (workflowData) {
      return this.saveViaWorkflow(workflowData);
    } else {
      return this.saveViaDialog(showSaveAndClose);
    }
  }

  /**
   * Open the main save dialog
   *
   * @private
   * @param {boolean} showSaveAndClose
   * @returns {Promise<ISaveData>}
   * @memberof SaveService
   */
  private saveViaDialog(showSaveAndClose: boolean): Promise<ISaveData> {
    return new Promise((resolve, reject) => {
      // Show Save dialog
      this.saveDialog(showSaveAndClose)
        .then((dialogData: any) => {
          this.data = dialogData;
          return this.saveChain();
        })
        .then((resolution: ISaveData) => {
          return resolve(resolution);
        })
        // Return thrown errors
        .catch((err: SaveErrorData) => {
          return reject(err);
        });
    });
  }

  /**
   * Save the contract via a workflow
   *
   * @private
   * @param {IWorkflowData} data
   * @returns {Promise<ISaveData>}
   * @memberof SaveService
   */
  private saveViaWorkflow(data: IWorkflowData): Promise<ISaveData> {
    this.data = data;

    return this.saveChain();
  }

  /**
   * Promise chain for handling saves
   *
   * @private
   * @param {boolean} [dialog]
   * @returns {Promise<ISaveData>}
   * @memberof SaveService
   */
  private saveChain(dialog?: boolean): Promise<ISaveData> {
    return new Promise((resolve, reject) => {
      this.validation()
        // Validate Version
        .then(() => {
          if (this.data.asNew) {
            // If saving exisiting as a new contract
            return this.saveAsNew();
          } else {
            // If updating an exisiting contract
            return this.saveVersion();
          }
        })
        // Prepare data for saving
        .then(() => {
          return this.preSavePrep();
        })
        // Get the new contract body
        .then(() => {
          return this.processContract();
        })
        // Save the contract
        .then(() => {
          return this.contractService.save(this.contract);
        })
        // Get the saved and stored version
        .then(() => {
          return this.contractService.findById(this.contract._id);
        })
        // Show success dialog
        .then((updatedContract: ContractData) => {
          this.contract = updatedContract;
          return new Promise(resolveConfirm => {
            if (dialog) {
              this.dialogService.info(
                `Contract ${
                  this.contract.name
                } saved successfully to version ${this.data.version.replace(
                  "@latest",
                  ""
                )}.`
              );
            }

            resolveConfirm(updatedContract);
          });
        })
        // Return the new contract and handling parameters
        .then((updatedContract: ContractData) => {
          const resolution: ISaveData = {
            version: this.data.version,
            overwrite: this.overwrite,
            close: this.data.close,
            contract: updatedContract
          };

          return resolve(resolution);
        })
        // Return thrown errors
        .catch((err: SaveErrorData) => {
          // console.log(err);
          return reject(err);
        });
    });
  }

  /**
   * Show the save dialog
   *
   * @private
   * @returns {Promise<any>}
   * @memberof SaveService
   */
  private saveDialog(_showSaveAndClose: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      const dialogData: ISaveDialogData = {
        name: "",
        currentVersion: "",
        showSaveAndClose: _showSaveAndClose
      };

      // Check that contract has been set
      if (this.contract) {
        // Prepare data to show in dialog
        if (this.contract && this.contract.name) {
          dialogData.name = this.contract.name;
        }

        const versions = Object.keys(this.contract.versions);
        if (this.contract && versions.length > 0) {
          dialogData.currentVersion = versions[versions.length - 1];
        }

        const dialog = this.dialog.open(SaveContractDialogComponent, {
          width: "540px",
          data: dialogData
        });

        dialog.afterClosed().subscribe((response: any) => {
          if (response && response.cancelled) {
            const error: SaveErrorData = {
              description: "User cancelled save",
              code: "4000",
              error: "cancelled"
            };

            reject(error);
          } else {
            resolve(response);
          }
        });
      } else {
        const error: SaveErrorData = {
          description: "Contract not set",
          code: "4001",
          error: "Contract not set"
        };

        reject(error);
      }
    });
  }

  /**
   * Validate the name and version
   *
   * @private
   * @returns {Promise<void>}
   * @memberof SaveService
   */
  private validation(): Promise<void> {
    return new Promise((resolve, reject) => {
      const checks = {
        name: false,
        version: false
      };

      if (this.data.name && this.data.name.length > 0) {
        checks.name = true;
      }

      if (this.data.version && this.data.version.length > 0) {
        checks.version = true;
      }

      // If any check is false resolve false
      const keys = Object.keys(checks);
      let i = 0;

      // Want to check in order
      while (i < keys.length) {
        if (checks[keys[i]] === false) {
          const error: SaveErrorData = {
            description: `Validation failed on ${keys[i]}`,
            code: "4002",
            error: `Validation failed on ${keys[i]}`
          };
          return reject(error);
        }
        i++;
      }
      resolve();
    });
  }

  /**
   * Handle saving as new contract (duplicate open version)
   *
   * @private
   * @returns {Promise<void>}
   * @memberof SaveService
   */
  private saveAsNew(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.contract = new ContractData();
      this.data.asNew = true;
      this.data.close = true;
      resolve();
    });
  }

  /**
   * Handle creating a new version
   *
   * @private
   * @returns {Promise<any>}
   * @memberof SaveService
   */
  private saveVersion(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Check if version has been used
      let versionUsed = false;
      const keys = Object.keys(this.contract.versions);
      let i = keys.length;
      while (i--) {
        const cleanVersion = keys[i].replace("@latest", "");
        if (cleanVersion === this.data.version) {
          versionUsed = true;
          break;
        }
      }

      // If the version has already been used
      // Go to overwriteVersion() function
      if (versionUsed) {
        this.overwriteVersion()
          .then(() => {
            resolve();
          })
          .catch((err: any) => {
            return reject(err);
          });

        // If the version has not already been used
      } else {
        resolve();
      }
    });
  }

  /**
   * Handle overwriting an existing version
   *
   * @private
   * @returns {Promise<boolean>}
   * @memberof SaveService
   */
  private overwriteVersion(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Show confirm dialog
      // If accepted then find version and overwrite

      this.dialogService
        .confirm("This will overwrite an existing version!")
        .then(overwrite => {
          if (overwrite) {
            this.overwrite = true;
            resolve();

            // We don't want to save/overwrite the contract
          } else {
            const error: SaveErrorData = {
              description: "User cancelled overwrite of version",
              code: "4000",
              error: "cancelled"
            };
            return reject(error);
          }
        })
        .catch((err: any) => {
          const error: SaveErrorData = {
            description: "Error overwriting contract version",
            code: "4003",
            error: err
          };
          return reject(error);
        });
    });
  }

  /**
   * Pre save preparation
   *
   * @private
   * @param {*} [data]
   * @returns {Promise<any>}
   * @memberof SaveService
   */
  private preSavePrep(data?: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      // Check if we are saving an existing contract
      if (this.contract._id) {
        try {
          const contractCache = this.contract;
          this.contract = await this.contractService.findById(
            this.contract._id
          );

          this.contract.name = contractCache.name;
          this.contract.versions = contractCache.versions;
          this.contract.versionIO = contractCache.versionIO;
          this.contract.onboardData = contractCache.onboardData;
        } catch (error) {
          reject(error);
        }
      }

      this.contract.name = this.data.name;
      resolve(data);
    });
  }

  /**
   * Process the contract for saving
   *
   * @private
   * @param {string} body
   * @returns {Promise<any>}
   * @memberof SaveService
   */
  private processContract(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.contract._id) {
        this.updateContract()
          .then(() => {
            this.saveContractData(this.editedBody)
              .then(() => {
                resolve();
              })
              .catch((err: any) => {
                return reject(err);
              });
          })
          .catch((err: any) => {
            return reject(err);
          });
      } else {
        this.saveContractData(this.editedBody).then(() => {
          resolve();
        });
      }
    });
  }

  /**
   * Update the local contract with the new data
   *
   * @private
   * @returns {Promise<any>}
   * @memberof SaveService
   */
  private updateContract(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contractService
        .clearLatest(this.contract._id, this.contract)
        .then((cleanedContract: ContractData) => {
          // Store name in case user changed it
          const contractName = this.contract.name;
          this.contract = cleanedContract;
          this.contract.name = contractName;

          resolve();
        })
        .catch((err: any) => {
          const error: SaveErrorData = {
            description: "Error updating contract for save",
            code: "4005",
            error: err
          };
          return reject(error);
        });
    });
  }

  /**
   * Save the new contract data to the local holder
   *
   * @private
   * @param {string} body
   * @returns {Promise<any>}
   * @memberof SaveService
   */
  private saveContractData(body: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const bodyValid = body && body.length > 0;

      if (bodyValid) {
        if (this.data.version.indexOf("@latest") <= -1) {
          this.data.version += "@latest";
        }

        this.contract.versions[this.data.version] = btoa(body);

        if (this.overwrite) {
          const cleanVersion = this.data.version.replace("@latest", "");
          delete this.contract.versions[cleanVersion];
        }

        if (!this.isNew) {
          this.contract.updated = new Date();
        }

        resolve();
      } else {
        const error: SaveErrorData = {
          description: "Error preparing contract for save",
          code: "4006",
          error: "Error preparing contract for save"
        };
        return reject(error);
      }
    });
  }
}
