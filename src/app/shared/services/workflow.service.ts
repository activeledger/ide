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
import {
  IWorkflow,
  IWorkflowData,
  IStoredWorkflow
} from "../interfaces/workflow.interfaces";
import { DatabaseService } from "../../providers/database.service";
import { IContract, ISaveData } from "../interfaces/contract.interfaces";
import * as SemVer from "semver";
import { SaveService } from "./save.service";
import { DialogService } from "./dialog.service";
import { UploadService } from "./upload.service";
import { IIdentityData } from "../interfaces/identity.interfaces";
import { DBTypes } from "../enums/db.enum";

@Directive()
@Injectable({
  providedIn: "root"
})
export class WorkflowService {
  // #region Events
  /**
   * Run workflow event button
   *
   * @memberof WorkflowService
   */
  @Output() runWorkflowEvent = new EventEmitter();

  /**
   * Show upload button event
   *
   * @memberof WorkflowService
   */
  @Output() showUploadButtonEvent = new EventEmitter();

  /**
   * Show update button event
   *
   * @memberof WorkflowService
   */
  @Output() showUpdateButtonEvent = new EventEmitter();

  /**
   * Set the contract ID in the workflow menu service
   *
   * @memberof WorkflowService
   */
  @Output() setContractIdEvent = new EventEmitter();

  /**
   * Workflow start event
   *
   * @memberof WorkflowService
   */
  @Output() workflowStartEvent = new EventEmitter();

  /**
   * Workflow end event
   *
   * @memberof WorkflowService
   */
  @Output() workflowEndEvent = new EventEmitter();
  // #endregion

  /**
   * Creates an instance of WorkflowService.
   * @param {DatabaseService} dbService
   * @param {SaveService} saveService
   * @param {DialogService} dialogService
   * @param {UploadService} uploadService
   * @memberof WorkflowService
   */
  constructor(
    private dbService: DatabaseService,
    private saveService: SaveService,
    private dialogService: DialogService,
    private uploadService: UploadService
  ) {}

  // #region Getters
  /**
   * Get all the workflows stored in the database
   *
   * @returns {Promise<Array<IWorkflow>>}
   * @memberof WorkflowService
   */
  public getWorkflows(): Promise<Array<IWorkflow>> {
    return this.dbService.findByType<IWorkflow>(DBTypes.WORKFLOW);
  }

  /**
   * Find a workspace using its ID
   *
   * @param {string} id
   * @returns {Promise<IWorkflow>}
   * @memberof WorkflowService
   */
  public findById(id: string): Promise<IWorkflow> {
    return this.dbService.findById<IWorkflow>(id);
  }
  // #endregion

  // #region Setters

  /**
   * Save a new workspace
   *
   * @param {IWorkflow} workflow
   * @param {boolean} [update]
   * @returns {Promise<IWorkflow>}
   * @memberof WorkflowService
   */
  public save(
    workflow: IWorkflow,
    update?: boolean
  ): Promise<IWorkflow | void> {
    if (update) {
      return this.dbService.update<IStoredWorkflow>(
        workflow as IStoredWorkflow
      );
    } else {
      return this.dbService.add<IWorkflow>(workflow);
    }
  }

  // #endregion

  // #region Event control

  /**
   * Emit an event that tells the contract editor to pass the required data to this service
   *
   * @param {string} workflowId
   * @memberof WorkflowService
   */
  public sendRunEvent(workflowId: string): void {
    this.runWorkflowEvent.emit({ workflowId });
  }

  /**
   * Emit an event alerting the app that it should update the contract ID in the workspace menu
   *
   * @param {string} contractId
   * @memberof WorkflowService
   */
  public sendSetContractIdEvent(contractId: string): void {
    this.setContractIdEvent.emit({ contractId });
  }

  /**
   * Emit an event to alert the UI it should be showing the upload button
   *
   * @memberof WorkflowService
   */
  public sendShowUploadButtonEvent(): void {
    this.showUploadButtonEvent.emit();
  }

  /**
   * Emit an event to alert the UI to show the update button instead of upload
   *
   * @param {string} contractId
   * @memberof WorkflowService
   */
  public sendShowUpdateButtonEvent(contractId: string): void {
    this.showUpdateButtonEvent.emit({ contractId });
  }
  // #endregion

  // #region Run workflow
  /**
   * Run a workflow
   *
   * @param {string} workflowId
   * @param {IContract} contract
   * @param {string} contractBody
   * @returns {Promise<ISaveData>}
   * @memberof WorkflowService
   */
  public run(
    workflowId: string,
    contract: IContract,
    contractBody: string
  ): Promise<ISaveData> {
    return new Promise((resolve, reject) => {
      /*
        1. Check if contract uploaded, if yes set to update
        2. Increment version number if option selected
        3. Save contract
        */

      let workflow: IWorkflow;
      let workflowData: IWorkflowData;
      let identity: IIdentityData;

      this.workflowStartEvent.emit({ workflowId });

      this.findById(workflowId)
        .then((storedWorkflow: IWorkflow) => {
          workflow = storedWorkflow;
          return this.checkForContractName(contract);
        })
        .then((nameCheckedContract: IContract) => {
          contract = nameCheckedContract;

          workflowData = {
            name: contract.name,
            asNew: false,
            version: ""
          };

          // Increment the version
          if (workflow.incrementVersion) {
            workflowData = this.incrementVersion(
              contract,
              workflow,
              workflowData
            );
          }

          return this.dbService.findById(workflow.identity);
        })
        .then((_identity: IIdentityData) => {
          identity = _identity;

          return this.uploadService.initialise(
            contractBody,
            contract,
            workflowData.version,
            identity
          );
        })
        .then(() => {
          // If identity ID in onboardData this identity has already been uploaded once with it
          if (
            Object.keys(contract.onboardData).indexOf(workflow.identity) >= 0
          ) {
            return this.uploadService.updateContract();
          } else {
            return this.uploadService.uploadContract();
          }
        })
        .then((uploadedContract: IContract) => {
          return this.saveService.saveContract(
            uploadedContract,
            contractBody,
            false,
            workflowData
          );
        })
        .then((saveData: ISaveData) => {
          this.workflowEndEvent.emit();
          return resolve(saveData);
        })
        .catch((err: unknown) => {
          this.workflowEndEvent.emit();

          return reject(err);
        });
    });
  }

  private incrementVersion(
    contract,
    workflow: IWorkflow,
    workflowData: IWorkflowData
  ): IWorkflowData {
    let version: string;

    // If contract._id exists this has already been saved
    if (contract._id) {
      const versions = Object.keys(contract.versions);
      version = versions[versions.length - 1];

      let latestVersion = version.replace("@latest", "");

      // If latest version is a single digit convert it to semantic versioning
      if (latestVersion.length === 1 && parseInt(latestVersion, 0) !== NaN) {
        latestVersion = latestVersion + ".0.0";
      }

      if (SemVer.valid(latestVersion)) {
        const verSplit = latestVersion.split(".");

        verSplit[2] = (parseInt(verSplit[2], 0) + 1).toString();

        workflowData.version = verSplit.join(".");
      }
    } else {
      workflow.versionStart
        ? (workflowData.version = workflow.versionStart)
        : (workflowData.version = "1.0.0");
    }

    return workflowData;
  }

  /**
   * Check that the contract has a name
   * If it has a name then it has been saved
   *
   * @private
   * @param {IContract} contract
   * @returns {Promise<IContract>}
   * @memberof WorkflowService
   */
  private checkForContractName(contract: IContract): Promise<IContract> {
    return new Promise((resolve, reject) => {
      if (!contract.name) {
        contract.name = "Autosave: " + new Date();
      }

      resolve(contract);
    });
  }

  // #endregion
}
