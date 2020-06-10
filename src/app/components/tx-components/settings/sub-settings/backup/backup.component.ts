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
  selector: "app-settings-backup",
  templateUrl: "./backup.component.html",
  styleUrls: ["./backup.component.css"],
})
export class BackupComponent implements OnInit {
  // #region UI Data
  /**
   * UI Display control
   *
   * @memberof BackupComponent
   */
  public setup = {
    exportSelected: false,
    exportInProgress: false,
  };

  /**
   * What data should be exported in a selective export
   *
   * @memberof BackupComponent
   */
  public exportsSelected = {
    keys: false,
    identities: false,
    namespaces: false,
    contracts: false,
    workflows: false,
    connections: false,
    savedTransactions: false,
    historicalTransactions: false,
  };

  /**
   * Should the backup be encrypted
   *
   * @memberof BackupComponent
   */
  public encryptBackup = false;

  /**
   * Password to encrypt the backup
   *
   * @type {string}
   * @memberof BackupComponent
   */
  public backupPassword: string;
  // #endregion

  // #region Internal Data
  /**
   * Customised logger
   *
   * @private
   * @memberof BackupComponent
   */
  private logger = (window as any).logger;
  // #endregion

  /**
   * Creates an instance of BackupComponent.
   * @param {ElectronService} electronService
   * @param {DialogService} dialogService
   * @param {BackupService} backupService
   * @memberof BackupComponent
   */
  constructor(
    private electronService: ElectronService,
    private dialogService: DialogService,
    private backupService: BackupService
  ) {}

  // #region Angular Controls
  ngOnInit() {}
  // #endregion

  // #region Export

  /**
   * Export backup files from the system
   *
   * @private
   * @param {boolean} [all]
   * @memberof SettingsComponent
   */
  public async export(all?: boolean): Promise<void> {
    const dialog = this.electronService.remote.dialog;

    try {
      const saveLocation = await dialog.showSaveDialog({
        filters: [
          {
            name: "Active Harmony Backup",
            extensions: ["ahb"],
          },
        ],
      });

      if (saveLocation.filePath) {
        this.exportFile(saveLocation.filePath, all);
      }
    } catch (error) {
      this.logger.error(`Export failed.\n${error}`);
      this.dialogService.error("Exporting failed.");
    }
  }

  /**
   * Export the specified data to the selected file
   *
   * @private
   * @param {*} filename
   * @param {*} [all]
   * @memberof BackupComponent
   */
  private exportFile(filename: string, all?: boolean) {
    // Indicate export is in progress
    this.setup.exportInProgress = true;

    if (all) {
      // The export all button has been clicked
      this.backupService
        .export(filename, this.encryptBackup, this.backupPassword)
        .then(() => {
          this.dialogService.info("Backup completed successfully.");
          this.setup.exportInProgress = false;
        })
        .catch((err: any) => {
          this.setup.exportInProgress = false;
          this.dialogService.error("Backup failed " + err);
          this.logger.error(`Backup failed.\n${err}`);
        });
    } else {
      // We need to check which items have been selected for backup
      // Start by converting the object to an array, so we can switch on it later.
      const selected = [];
      const keys = Object.keys(this.exportsSelected);

      let i = keys.length;
      while (i--) {
        const key = keys[i];
        if (this.exportsSelected[key] === true) {
          selected.push(key.toString());
        }
      }

      this.backupService
        .export(filename, this.encryptBackup, this.backupPassword, selected)
        .then(() => {
          this.setup.exportInProgress = false;
          this.dialogService.info("Backup completed successfully.");
        })
        .catch((err: any) => {
          this.setup.exportInProgress = false;
          this.dialogService.error("Backup failed.");
          this.logger.error(`Backup failed.\n${err}`);
        });
    }
  }
  // #endregion
}
