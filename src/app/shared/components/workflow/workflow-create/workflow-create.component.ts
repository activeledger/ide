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
import { Workflow } from "../../../structures/workflow.structures";
import { IdentityService } from "../../../services/identity.service";
import { IIdentityData } from "../../../interfaces/identity.interfaces";
import { WorkflowService } from "../../../services/workflow.service";
import { MatSnackBar } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { IWorkflow } from "../../../interfaces/workflow.interfaces";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-workflow-create",
  templateUrl: "./workflow-create.component.html",
  styleUrls: ["./workflow-create.component.scss"]
})
export class WorkflowCreateComponent implements OnInit {
  public workflow = new Workflow();
  public identities: IIdentityData[] = [];

  public backIcon = faArrowLeft;

  public contractId: string;

  constructor(
    private identityService: IdentityService,
    private workflowService: WorkflowService,
    private snackbar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getIdentities();
    this.checkForId();
  }

  private checkForId(): void {
    this.route.params.subscribe(params => {
      if (params["id"] && params["id"] !== "undefined") {
        this.getWorkflow(params["id"]);
      }
    });
  }

  private getWorkflow(id: string): void {
    this.workflowService
      .findById(id)
      .then((workflow: IWorkflow) => {
        this.workflow = workflow;
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }

  private getIdentities(): void {
    this.identityService
      .getIdentities()
      .then((identityData: IIdentityData[]) => {
        this.filterIdentities(identityData);
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }

  private filterIdentities(identityData: IIdentityData[]): void {
    const identityHasCorrectStreamID = (identity: IIdentityData) =>
      identity.streamId && identity.streamId.length === 64 ? true : false;

    this.identities = identityData.filter(identityHasCorrectStreamID);
    /* let i = identityData.length;
    while (i--) {
      if (identityData[i].streamId && identityData[i].streamId.length === 64) {
        this.identities.push(identityData[i]);
      }
    } */
  }

  public save(): void {
    const update = this.workflow._id !== undefined;

    this.workflowService
      .save(this.workflow, update)
      .then(() => {
        this.snackbar.open("Saved", null, {
          duration: 2000
        });
        // this.router.navigateByUrl("/contracts/open/" + this.contractId);
        this.router.navigateByUrl("/contracts");
      })
      .catch((err: unknown) => {
        console.error(err);
        this.snackbar.open("Error saving...", null, {
          duration: 2000
        });
      });
  }
}
