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
import { DialogService } from "../../../../shared/services/dialog.service";
import { ElectronService } from "../../../../shared/services/electron.service";
import { WorkspaceHolder } from "../../../../shared/interfaces/workspace.interfaces";

@Component({
  selector: "app-settings-workspace",
  templateUrl: "./workspace.component.html",
  styleUrls: ["./workspace.component.scss"]
})
export class WorkspaceComponent implements OnInit {
  // #region UI Data
  /**
   * Selected workspace name
   *
   * @type {string}
   * @memberof WorkspaceComponent
   */
  public workspace: string;

  /**
   * Holds the new name of a workspace when being renamed
   *
   * @type {string}
   * @memberof WorkspaceComponent
   */
  public newWorkspaceName: string;

  /**
   * Holds an array of available workspaces
   *
   * @type {string[]}
   * @memberof WorkspaceComponent
   */
  public workspaces: string[];

  /**
   * Switch for deleting the workspace or just it's data
   *
   * @memberof WorkspaceComponent
   */
  public cleanWorkspace = false;

  /**
   * UI display control
   *
   * @memberof WorkspaceComponent
   */
  public setup = {
    showRename: false
  };
  // #endregion

  /**
   * Creates an instance of WorkspaceComponent.
   * @param {DatabaseService} db
   * @param {DialogService} dialogService
   * @param {ElectronService} electron
   * @memberof WorkspaceComponent
   */
  constructor(
    private db: DatabaseService,
    private dialogService: DialogService,
    private electron: ElectronService
  ) {}

  // #region Angular control
  ngOnInit() {
    this.getWorkspaces();
  }
  // #endregion

  // #region Getters
  /**
   * Get the stored workspaces
   *
   * @private
   * @memberof WorkspaceComponent
   */
  private getWorkspaces(): void {
    this.db
      .getWorkspaces()
      .then((workspaces: WorkspaceHolder) => {
        this.workspaces = workspaces.workspaces;
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }
  // #endregion

  // #region Setters
  /**
   * Rename the selected workspace
   *
   * @memberof WorkspaceComponent
   */
  public rename(): void {
    this.db
      .renameWorkspace(this.workspace, this.newWorkspaceName)
      .then(() => {
        this.dialogService
          .info("Workspace renamed successfully. Click Ok to restart.")
          .then(() => {
            this.electron.restart();
          })
          .catch((err: unknown) => {
            console.error(err);
          });
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }

  /**
   * Delete the selected workspace
   *
   * @memberof WorkspaceComponent
   */
  public delete(): void {
    let verbs = {
      pre: "delete",
      post: "deleted",
      fail: "Deleting"
    };

    if (this.cleanWorkspace) {
      verbs = {
        pre: "clean",
        post: "cleaned",
        fail: "Cleaning"
      };
    }

    this.dialogService
      .confirm(
        `Are you sure you want to ${verbs.pre} the workspace: ${this.workspace}?`
      )
      .then((confirm: boolean) => {
        if (confirm) {
          this.db
            .removeWorkspace(this.workspace, this.cleanWorkspace)
            .then(() => {
              this.dialogService
                .info(
                  `Workspace ${this.workspace} has been ${verbs.post}. Click ok to restart.`
                )
                .then(() => {
                  this.electron.restart();
                })
                .catch((err: unknown) => {
                  console.error(err);
                });
            })
            .catch((err: unknown) => {
              console.error(err);
            });
        } else {
          this.dialogService.info(
            `The workspace ${this.workspace}, has not been ${verbs.post}.`
          );
        }
      })
      .catch((err: unknown) => {
        this.dialogService.error(`${verbs.fail} ${this.workspace} failed.`);
        console.error(err);
      });
  }
  // #endregion
}
