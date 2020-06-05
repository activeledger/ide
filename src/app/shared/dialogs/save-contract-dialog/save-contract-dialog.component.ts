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
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-save-contract-dialog",
  templateUrl: "./save-contract-dialog.component.html",
  styleUrls: ["./save-contract-dialog.component.css"]
})
export class SaveContractDialogComponent implements OnInit {
  public faSave = faSave;

  public name: string;
  public version: string;
  public currentVersion = "Not set";
  public new = true;
  public showSaveAndClose = true;

  constructor(
    public dialogRef: MatDialogRef<SaveContractDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data && this.data.currentVersion) {
      this.currentVersion = this.data.currentVersion;
      this.new = false;
    }
    this.showSaveAndClose = this.data.showSaveAndClose;

    if (this.data && this.data.name) {
      this.name = this.data.name;
    }
  }

  public save(): void {
    this.dialogRef.close({
      name: this.name,
      version: this.version
    });
  }

  public saveAsNew(): void {
    this.dialogRef.close({
      name: this.name,
      version: this.version,
      asNew: true,
      close: true
    });
  }

  public saveAndClose(): void {
    this.dialogRef.close({
      name: this.name,
      version: this.version,
      close: true
    });
  }

  public close(): void {
    this.dialogRef.close({
      cancelled: true
    });
  }
}
