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
import { DatabaseService } from "../../../../providers/database.service";
import { WorkspaceHolder } from "../../../../shared/interfaces/workspace.interfaces";
import { DialogService } from "../../../../shared/services/dialog.service";
import { ElectronService } from "../../../../shared/services/electron.service";
import { UserService } from "../../../../shared/services/user.service";

@Component({
  selector: "app-settings-developer",
  templateUrl: "./developer.component.html",
  styleUrls: ["./developer.component.css"]
})
export class DeveloperComponent implements OnInit {
  // #region UI Data

  /**
   * Holds the workspaces
   *
   * @type {WorkspaceHolder}
   * @memberof DeveloperComponent
   */
  public workspaces: WorkspaceHolder;

  /**
   * Holds the workspace name
   *
   * @type {string}
   * @memberof DeveloperComponent
   */
  public workspace: string;

  public justData = false;

  /**
   * UI control
   *
   * @memberof DeveloperComponent
   */
  public setup = {
    showSelectiveWipe: false
  };
  // #endregion

  /**
   * Creates an instance of DeveloperComponent.
   * @param {DatabaseService} dbService
   * @param {DialogService} dialogService
   * @param {ElectronService} electronService
   * @param {UserService} userService
   * @memberof DeveloperComponent
   */
  constructor(
    private dbService: DatabaseService,
    private dialogService: DialogService,
    private electronService: ElectronService,
    private userService: UserService
  ) {}

  // #region Angular Control
  ngOnInit() {
    this.getWorkspaces();
  }
  // #endregion

  // #region UI Control
  /**
   * Wipe specified data
   *
   * @param {boolean} [all]
   * @memberof DeveloperComponent
   */
  public wipe(all?: boolean): void {
    if (this.workspace && !all) {
      this.deleteWorkspace(this.workspace, this.justData);
    } else {
      const workspaces = this.workspaces.workspaces;
      let i = workspaces.length;

      const promises = [];

      while (i--) {
        promises.push(this.dbService.removeWorkspace(workspaces[i]));
      }

      Promise.all(promises)
        .then(() => {
          this.dialogService
            .info("Database purged. Click ok to restart")
            .then(() => {
              // Need to restart to make sure everything initialises correctly
              this.restart();
            });
        })
        .catch((err: unknown) => {
          this.dialogService.error("Unable to wipe database.");
          console.log(err);
        });
    }
  }

  /**
   * Clear User data
   *
   * @memberof DeveloperComponent
   */
  public wipeUser(): void {
    this.userService.wipe();
  }

  /**
   * List stored user data
   *
   * @memberof DeveloperComponent
   */
  public listUserDb(): void {
    this.userService.list();
  }

  /**
   * Restart electron
   *
   * @memberof DeveloperComponent
   */
  public restart(): void {
    this.electronService.restart();
  }

  /**
   * List the data in the database
   *
   * @memberof DeveloperComponent
   */
  public listDb(): void {
    this.dbService
      .findAll()
      .then((data: any) => {
        console.log(data);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }
  // #endregion

  // #region Getters
  private getWorkspaces(): void {
    this.dbService.getWorkspaces().then((workspaces: WorkspaceHolder) => {
      this.workspaces = workspaces;
    });
  }
  // #endregion

  // #region Internal
  private deleteWorkspace(workspace: string, justData?: boolean): void {
    this.dbService
      .removeWorkspace(workspace, justData)
      .then(() => {
        if (justData) {
          this.dialogService.info("Workspace cleaned.");
        } else {
          this.dialogService
            .info("Workspace purged. Click ok to restart")
            .then(() => {
              // Need to restart for the Quick bar to update correctly
              this.restart();
            });
        }
      })
      .catch((err: unknown) => {
        this.dialogService.error("Unable to clear workspace.");
        console.log(err);
      });
  }
  // #endregion
}
