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
import { ElectronService } from "../../../../../shared/services/electron.service";
import { DialogService } from "../../../../../shared/services/dialog.service";
import { BackupService } from "../../../../../shared/services/backup.service";

@Component({
  selector: "app-settings-restore",
  templateUrl: "./restore.component.html",
  styleUrls: ["./restore.component.css"]
})
export class RestoreComponent implements OnInit {
  // #region UI Data
  /**
   * UI display control
   *
   * @memberof RestoreComponent
   */
  public setup = {
    importInProgress: false
  };
  // #endregion

  // #region Internal Data
  /**
   * Custom internal logger
   *
   * @private
   * @memberof RestoreComponent
   */
  private logger = (window as any).logger;
  // #endregion

  /**
   * Creates an instance of RestoreComponent.
   * @param {ElectronService} electronService
   * @param {DialogService} dialogService
   * @param {BackupService} backupService
   * @memberof RestoreComponent
   */
  constructor(
    public electronService: ElectronService,
    private dialogService: DialogService,
    private backupService: BackupService
  ) { }

  ngOnInit() { }

  // #region Import

  /**
   * Open the file select dialog to select a backup to import
   *
   * @private
   * @memberof SettingsComponent
   */
  public import(snapshot?: boolean): void {
    const dialog = this.electronService.remote.dialog;

    const filenames = dialog.showOpenDialog({
      filters: [
        {
          name: "Activeledger IDE Backup",
          extensions: ["ahb"]
        }
      ]
    });

    if (filenames) {
      this.importFile(filenames[0], snapshot);
    }
  }

  /**
   * Import the selected file as either a restoration or snapshot
   *
   * @private
   * @param {string} file
   * @param {boolean} snapshot
   * @memberof RestoreComponent
   */
  private importFile(file: string, snapshot: boolean): void {
    this.setup.importInProgress = true;

    let importPromise: Promise<any>;

    if (snapshot) {
      importPromise = this.backupService.importSnapshot(file);
    } else {
      importPromise = this.backupService.import(file);
    }

    importPromise
      .then(() => {
        this.setup.importInProgress = false;
        if (snapshot) {
          this.dialogService.info("Snapshot restore completed successfully.");
        } else {
          this.dialogService.info("Restore completed successfully.");
        }
      })
      .catch((err: string | Error) => {
        if (err === "encrypted") {
          this.dialogService
            .input("Please enter the encryption password.", {
              width: "400px",
              type: "password"
            })
            .then(value => {
              if (snapshot) {
                return this.backupService.importSnapshot(file, value);
              } else {
                return this.backupService.importSecure(file, value);
              }
            })
            .then((resp: any) => {
              this.setup.importInProgress = false;
              if (resp && resp.cancelled) {
                this.dialogService.info("Restore cancelled.");
              } else if (snapshot) {
                this.dialogService.info(
                  "Snapshot restore completed successfully."
                );
              } else {
                this.dialogService.info("Restore completed successfully.");
              }
            })
            .catch((error: any) => {
              this.setup.importInProgress = false;
              this.dialogService.error("Secure Restore failed.");
              this.logger.error(`Secure Restore failed.\n${error}`);
            });
        } else {
          this.setup.importInProgress = false;
          this.dialogService.error("Restore failed.");
          this.logger.error(`Restore failed.\n${err}`);
        }
      });
  }
  // #endregion
}
