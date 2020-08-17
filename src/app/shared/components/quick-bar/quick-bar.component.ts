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

import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";
import { ElectronService } from "../../services/electron.service";
import { GeneralService } from "../../services/general.service";
import { DatabaseService } from "../../../providers/database.service";
import {
  faBars,
  faWrench,
  faUser,
  faSync,
  faPlusSquare,
  faAngleDown,
  faCartArrowDown,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { DialogService } from "../../services/dialog.service";
import { WorkspaceHolder } from "../../interfaces/workspace.interfaces";
import { UserService } from "../../services/user.service";
import { MenuService } from "../../services/menu.service";

@Component({
  selector: "app-quick-bar",
  templateUrl: "./quick-bar.component.html",
  styleUrls: ["./quick-bar.component.scss"],
})
export class QuickBarComponent implements OnInit {
  public burgerIco = faBars;
  public settingsIco = faWrench;
  public userIco = faUser;
  public syncIco = faSync;
  public newIco = faPlusSquare;
  public arrowIco = faAngleDown;
  public marketIco = faCartArrowDown;
  public workspaceIco = faBuilding;
  public showQuickCreate = false;
  public showWorkspaceSelect = false;
  public workspaces = [];
  public workspace = "default";
  public title: Promise<string> | null = null;
  public resolve: Function | null = null;
  public page = "Home";

  public setup = {
    workspaceMenuPosition: 85,
    isTx: true,
  };

  @Output()
  changeMenuState = new EventEmitter();

  public txBaasSwitchEmitter = new EventEmitter();

  constructor(
    private router: Router,
    public electronService: ElectronService,
    private generalService: GeneralService,
    private dialogService: DialogService,
    private dbService: DatabaseService,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    this.getWorkspaces();

    this.setPageTitle();
  }

  public txBaasSwitch(): void {
    this.setup.isTx = this.setup.isTx ? false : true;
    this.menuService.txBaasSwitch(this.setup.isTx ? "tx" : "baas");

    this.setup.isTx
      ? this.goTo("/", "Home")
      : this.goTo("/nodes/dashboard", "Dashboard");
  }

  public getWorkspaces(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.dbService
        .getWorkspaces()
        .then((workspaces: WorkspaceHolder) => {
          this.workspaces = workspaces.workspaces;
          resolve();
        })
        .catch((err: unknown) => {
          reject(err);
        });
    });
  }

  public setPageTitle(title?: string): void {
    if (title) {
      this.page = title;
    }

    const workspace = this.workspace;
    const friendlyWorkspace =
      workspace.charAt(0).toUpperCase() + workspace.slice(1);
    this.title = new Promise<string>((resolve, reject) => {
      resolve(friendlyWorkspace + " - " + this.page);
    });
  }

  public menuButtonClick(): void {
    this.changeMenuState.next();
  }

  public quickCreate(): void {
    this.showQuickCreate = !this.showQuickCreate;
  }

  public switchWorkspace(): void {
    this.showWorkspaceSelect = !this.showWorkspaceSelect;
  }

  /**
   * Navigate to a specific page
   *
   * @public
   * @param {string} url
   * @memberof AppComponent
   */
  public goTo(url: string, title: string): void {
    if (url.includes("/network/") || url.includes("/nodes/")) {
      this.setup.isTx = false;
      this.menuService.txBaasSwitch("baas");
    } else {
      this.setup.isTx = true;
      this.menuService.txBaasSwitch("tx");
    }

    this.router.navigateByUrl(url);

    this.setPageTitle(title);
  }

  public openWorkspace(space: string): void {
    this.dbService
      .openWorkspace(space)
      .then(() => {
        this.workspace = space;
        this.generalService.setAccent();
        this.goTo("/", "Home");
        // Make sure we have the latest list
        this.getWorkspaces();
        this.workspace = space;
      })
      .catch((err: any) => {
        console.error(err);
      });

    this.showWorkspaceSelect = false;
  }

  public createWorkspace(): void {
    this.dialogService
      .input("What would you like the new workspace to be called?")
      .then((name: string) => {
        if (name && name.length > 0) {
          this.dbService
            .createWorkspace(name)
            .then(() => {
              this.openWorkspace(name);
              this.dialogService.info(
                `Created workspace ${name} successfully!`
              );

              this.dbService
                .getWorkspaces()
                .then((workspaces: WorkspaceHolder) => {
                  this.workspaces = workspaces.workspaces;
                });
            })
            .catch(() => {
              this.dialogService.warning(`Error creating workspace ${name}`);
            });
        }
      });
  }
}
