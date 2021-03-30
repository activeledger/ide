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

import { Component, OnInit, Inject } from "@angular/core";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ContractData } from "../../structures/contract.structures";
import { IdentityService } from "../../services/identity.service";
import { IdentityData } from "../../structures/identity.structure";

@Component({
  selector: "app-contract-info-dialog",
  templateUrl: "./contract-info-dialog.component.html",
  styleUrls: ["./contract-info-dialog.component.css"]
})
export class ContractInfoDialogComponent implements OnInit {
  public faInfo = faThumbsUp;
  public contract: ContractData;
  public showCopy = false;
  public stringToCopy: string;
  public copySuccess = false;

  public contractData = new Array<any>();

  public setup = {
    showStreams: false
  };

  constructor(
    public dialogRef: MatDialogRef<ContractInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private identityService: IdentityService
  ) {}

  ngOnInit() {
    this.contract = this.data.contract;
    this.showCopy = this.data.allowCopy;
    this.stringToCopy = this.data.copy;

    this.setupData();
  }

  private setupData(): void {
    const identities = Object.keys(this.contract.onboardData);
    let i = identities.length;

    if (i > 0) {
      this.setup.showStreams = true;

      while (i--) {
        this.getIdentityName(identities[i]);
      }
    }
  }

  private getIdentityName(identity: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.identityService
        .findById(identity)
        .then((identityData: IdentityData) => {
          this.contractData.push({
            name: identityData.name,
            id: Object.keys(this.contract.onboardData[identity])[0]
          });

          resolve();
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  public close(): void {
    this.dialogRef.close();
  }
}
