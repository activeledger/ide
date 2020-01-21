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

import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { IWorkflow } from "../../../interfaces/workflow.interfaces";
import { WorkflowService } from "../../../services/workflow.service";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { Subscription } from "rxjs/Subscription";
import { ContractService } from "../../../services/contract.service";
import { IIdentityData } from "../../../interfaces/identity.interfaces";
import { IdentityService } from "../../../services/identity.service";
import { IContract } from "../../../interfaces/contract.interfaces";
import { UploadService } from "../../../services/upload.service";

@Component({
  selector: "app-workflow-contracts",
  templateUrl: "./workflow-contracts.component.html",
  styleUrls: ["./workflow-contracts.component.scss"]
})
export class WorkflowContractsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  // #region UI Data
  /**
   * Holds available workflows
   *
   * @type {IWorkflow[]}
   * @memberof WorkflowContractsComponent
   */
  public workflows: IWorkflow[] = [];

  /**
   * Edit icon
   *
   * @memberof WorkflowContractsComponent
   */
  public editIco = faCog;

  /**
   * Currently unused
   *
   * @memberof WorkflowContractsComponent
   */
  public downArrowIco = faCog;

  /**
   * Should we be uploading the contract, otherwise update it
   *
   * @memberof WorkflowContractsComponent
   */
  public isUpload = true;

  /**
   * Should we be showing the select Identity option
   *
   * @memberof WorkflowContractsComponent
   */
  public showSelectIdentity = true;

  /**
   * Should the identity selection menu be shown
   *
   * @memberof WorkflowContractsComponent
   */
  public showSelectIdentityMenu = false;

  /**
   * Array of identities
   *
   * @type {IIdentityData[]}
   * @memberof WorkflowContractsComponent
   */
  public identities: IIdentityData[] = [];

  /**
   * Current identity
   *
   * @type {string}
   * @memberof WorkflowContractsComponent
   */
  public identity: string;

  /**
   * Opened contract id
   *
   * @type {string}
   * @memberof WorkflowContractsComponent
   */
  public contractId: string;

  /**
   * Progress indicator display control
   *
   * @memberof WorkflowContractsComponent
   */
  public progressIndicator = {
    show: false,
    upload: false,
    workflowId: undefined
  };
  // #endregion

  // #region Subscriptions
  /**
   * Show upload button ecent
   *
   * @private
   * @type {Subscription}
   * @memberof WorkflowContractsComponent
   */
  private showUploadButtonEvent: Subscription;

  /**
   * Show update button event
   *
   * @private
   * @type {Subscription}
   * @memberof WorkflowContractsComponent
   */
  private showUpdateButtonEvent: Subscription;

  /**
   * Set contract ID event
   *
   * @private
   * @type {Subscription}
   * @memberof WorkflowContractsComponent
   */
  private setContractIdEvent: Subscription;

  /**
   * Start contract upload event
   *
   * @private
   * @type {Subscription}
   * @memberof WorkflowContractsComponent
   */
  private uploadStartEvent: Subscription;

  /**
   * Upload end event
   *
   * @private
   * @type {Subscription}
   * @memberof WorkflowContractsComponent
   */
  private uploadEndEvent: Subscription;

  /**
   * Start running workflow event
   *
   * @private
   * @type {Subscription}
   * @memberof WorkflowContractsComponent
   */
  private workflowStartEvent: Subscription;

  /**
   * Workflow end event
   *
   * @private
   * @type {Subscription}
   * @memberof WorkflowContractsComponent
   */
  private workflowEndEvent: Subscription;
  // #endregion

  /**
   * Creates an instance of WorkflowContractsComponent.
   * @param {Router} router
   * @param {WorkflowService} workflowService
   * @param {ContractService} contractService
   * @param {IdentityService} identityService
   * @param {UploadService} uploadService
   * @memberof WorkflowContractsComponent
   */
  constructor(
    public router: Router,
    private workflowService: WorkflowService,
    private contractService: ContractService,
    private identityService: IdentityService,
    private uploadService: UploadService
  ) {}

  // #region Angular control
  ngOnInit() {
    this.getWorkflows();
    this.getIdentities();
  }

  ngAfterViewInit() {
    this.subscribeToEvents();
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.

    this.showUploadButtonEvent.unsubscribe();
    this.showUpdateButtonEvent.unsubscribe();
    this.setContractIdEvent.unsubscribe();
    this.uploadStartEvent.unsubscribe();
    this.uploadEndEvent.unsubscribe();
    this.workflowStartEvent.unsubscribe();
    this.workflowEndEvent.unsubscribe();
  }
  // #endregion

  // #region Event handlers
  /**
   * Subscribe to events
   *
   * @private
   * @memberof WorkflowContractsComponent
   */
  private subscribeToEvents(): void {
    this.showUploadButtonEvent = this.workflowService.showUploadButtonEvent.subscribe(
      () => {
        this.isUpload = true;
      }
    );

    this.showUpdateButtonEvent = this.workflowService.showUpdateButtonEvent.subscribe(
      $event => {
        if ($event.contractId) {
          this.checkUploadedWithIdentity($event.contractId);
        }
      }
    );

    this.setContractIdEvent = this.workflowService.setContractIdEvent.subscribe(
      $event => {
        this.contractId = $event.contractId;
      }
    );

    this.uploadStartEvent = this.uploadService.uploadStartEvent.subscribe(
      () => {
        this.progressIndicator.show = true;
        this.progressIndicator.upload = true;
      }
    );

    this.uploadEndEvent = this.uploadService.uploadEndEvent.subscribe(() => {
      this.progressIndicator.show = false;
      this.progressIndicator.upload = false;
    });

    this.workflowStartEvent = this.workflowService.workflowStartEvent.subscribe(
      $event => {
        this.progressIndicator.show = true;
        this.progressIndicator.upload = false;
        this.progressIndicator.workflowId = $event.workflowId;
      }
    );

    this.workflowEndEvent = this.workflowService.workflowEndEvent.subscribe(
      () => {
        this.progressIndicator.show = false;
        this.progressIndicator.workflowId = undefined;
      }
    );
  }
  // #endregion

  // #region Getters
  /**
   * Get a list of identites
   *
   * @private
   * @memberof WorkflowContractsComponent
   */
  private getIdentities(): void {
    this.identityService
      .getIdentities()
      .then((identities: IIdentityData[]) => {
        let i = identities.length;
        while (i--) {
          if (identities[i].namespace) {
            this.identities.push(identities[i]);
          }
        }
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }

  /**
   * Get available workflows
   *
   * @private
   * @memberof WorkflowContractsComponent
   */
  private getWorkflows(): void {
    this.workflowService
      .getWorkflows()
      .then((workflows: IWorkflow[]) => {
        this.workflows = workflows;
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }
  // #endregion

  // #region UI functions

  /**
   * Run a workflow
   *
   * @param {string} workflowId
   * @memberof WorkflowContractsComponent
   */
  public run(workflowId: string): void {
    this.workflowService.sendRunEvent(workflowId);
  }

  /**
   * Upload or update a contract
   *
   * @memberof WorkflowContractsComponent
   */
  public uploadOrUpdate(): void {
    this.contractService.sendUploadContractEvent(this.identity, !this.isUpload);
  }

  /**
   * Toggle identity selector
   *
   * @param {boolean} [hide]
   * @memberof WorkflowContractsComponent
   */
  public toggleSelectIdentity(hide?: boolean): void {
    hide
      ? (this.showSelectIdentityMenu = false)
      : (this.showSelectIdentityMenu = !this.showSelectIdentityMenu);
  }

  /**
   * Use the selected identity
   *
   * @param {string} identityId
   * @memberof WorkflowContractsComponent
   */
  public selectIdentity(identityId: string): void {
    this.showSelectIdentityMenu = false;
    this.identity = identityId;
    this.showSelectIdentity = false;
    this.checkUploadedWithIdentity();
  }

  /**
   * Check the selected identity
   *
   * @param {string} id
   * @returns {boolean}
   * @memberof WorkflowContractsComponent
   */
  public checkSelectedIdentity(id: string): boolean {
    if (this.identity === id) {
      return true;
    } else {
      return false;
    }
  }
  // #endregion

  /**
   * Check the identity selected has already uploaded the contract
   *
   * @private
   * @param {string} [contractId]
   * @memberof WorkflowContractsComponent
   */
  private checkUploadedWithIdentity(contractId?: string): void {
    if (!contractId && this.contractId) {
      contractId = this.contractId;
    } else {
      // We don't want to go further than this if we don't have any information
      return;
    }

    this.contractService
      .findById(contractId)
      .then((contract: IContract) => {
        const identities = Object.keys(contract.onboardData);

        if (identities.indexOf(this.identity) >= 0) {
          this.isUpload = false;
        } else {
          this.isUpload = true;
        }
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }
}
