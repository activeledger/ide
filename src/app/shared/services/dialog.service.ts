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

import { Injectable } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from "@angular/material/dialog";
import { ErrorDialogComponent } from "../dialogs/error-dialog/error-dialog.component";
import { AdvancedConfirmDialogComponent } from "../dialogs/advanced-confirm-dialog/advanced-confirm-dialog.component";
import { ConfirmDialogComponent } from "../dialogs/confirm-dialog/confirm-dialog.component";
import { WarningDialogComponent } from "../dialogs/warning-dialog/warning-dialog.component";
import { InfoDialogComponent } from "../dialogs/info-dialog/info-dialog.component";
import { InputDialogComponent } from "../dialogs/input-dialog/input-dialog.component";
import { ContractInfoDialogComponent } from "../dialogs/contract-info-dialog/contract-info-dialog.component";
import { LoginDialogComponent } from "../dialogs/login-dialog/login-dialog.component";
import { ContractData } from "../structures/contract.structures";
import { ILoginData } from "../interfaces/user.interfaces";
import { BlockedDialogComponent } from "../dialogs/blocked-dialog/blocked-dialog.component";
import { AddSshConnectionDialogComponent } from "../dialogs/add-ssh-connection/add-ssh-connection.component";

/**
 * Provides dialogs
 *
 * @export
 * @class DialogService
 */
@Injectable({
  providedIn: "root",
})
export class DialogService {
  /**
   *Creates an instance of DialogService.
   * @param {MatDialog} dialog
   * @memberof DialogService
   */
  constructor(private dialog: MatDialog) {}

  /**
   * Creates an error dialog
   *
   * @param {string} message
   * @param {string} [code]
   * @param {*} [settings]
   * @memberof DialogService
   */
  public error(message: string, code?: string, settings?: any): void {
    let width = "250px";
    if (settings && settings.width) {
      width = settings.width;
    }

    if (!code) {
      code = "2000";
    }

    this.dialog.open(ErrorDialogComponent, {
      width: width,
      data: { error: message, code: code },
    });
  }

  /**
   * Create an info dialog
   *
   * @param {string} message
   * @param {*} [settings]
   * @returns {Promise<void>}
   * @memberof DialogService
   */
  public info(message: string, settings?: any): Promise<void> {
    return new Promise((resolve, reject) => {
      let width = "250px";
      let allowCopy = false;
      let stringToCopy: string;

      if (settings && settings.width) {
        width = settings.width;
        allowCopy = settings.allowCopy;
        stringToCopy = settings.copy;
      }

      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: width,
        data: {
          message: message,
          allowCopy: allowCopy,
          copy: stringToCopy,
        },
      });

      dialogRef.afterClosed().subscribe(() => {
        resolve();
      });
    });
  }

  /**
   * Create a blocking dialog
   *
   * @param {string} message
   * @param {*} [settings]
   * @returns {MatDialogRef<BlockedDialogComponent>}
   * @memberof DialogService
   */
  public blocker(
    message: string,
    settings?: any
  ): MatDialogRef<BlockedDialogComponent> {
    let width = "250px";

    if (settings && settings.width) {
      width = settings.width;
    }

    return this.dialog.open(BlockedDialogComponent, {
      width: width,
      data: {
        message: message,
      },
    });
  }

  /**
   * Create a contract information dialog
   *
   * @param {ContractData} contract
   * @param {*} [settings]
   * @memberof DialogService
   */
  public contractInfo(contract: ContractData, settings?: any): void {
    let width = "250px";
    let allowCopy = false;
    let stringToCopy: string;

    if (settings && settings.width) {
      width = settings.width;
      allowCopy = settings.allowCopy;
      stringToCopy = settings.copy;
    }

    this.dialog.open(ContractInfoDialogComponent, {
      width: width,
      data: {
        contract: contract,
        allowCopy: allowCopy,
        copy: stringToCopy,
      },
    });
  }

  /**
   * Create a warning dialog
   *
   * @param {string} message
   * @param {*} [settings]
   * @memberof DialogService
   */
  public warning(message: string, settings?: any): void {
    let width = "250px";
    if (settings && settings.width) {
      width = settings.width;
    }

    this.dialog.open(WarningDialogComponent, {
      width: width,
      data: { message: message },
    });
  }

  /**
   * Create a confirmation dialog
   *
   * @param {string} message
   * @param {*} [settings]
   * @returns {Promise<boolean>}
   * @memberof DialogService
   */
  public confirm(message: string, settings?: any): Promise<boolean> {
    let width = "250px";
    if (settings && settings.width) {
      width = settings.width;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: width,
      data: { message: message },
    });

    return new Promise((resolve, reject) => {
      dialogRef.afterClosed().subscribe((result: boolean) => {
        resolve(result);
      });
    });
  }

  /**
   * Create an input dialog
   *
   * @param {string} message
   * @param {*} [settings]
   * @returns {(Promise<string | null>)}
   * @memberof DialogService
   */
  public input(message: string, settings?: any): Promise<string | null> {
    let width = "250px";
    if (settings && settings.width) {
      width = settings.width;
    }

    const data = {
      message: message,
      type: undefined,
    };

    if (settings && settings.type) {
      data.type = settings.type;
    }

    const dialogRef = this.dialog.open(InputDialogComponent, {
      width: width,
      data: data,
    });

    return new Promise((resolve, reject) => {
      dialogRef.afterClosed().subscribe((result: string | null) => {
        resolve(result);
      });
    });
  }

  /**
   * Create an advanced confirmation dialog
   *
   * @param {string} message
   * @param {*} [settings]
   * @memberof DialogService
   */
  public advancedConfirm(message: string, settings?: any): void {
    let width = "250px";
    if (settings && settings.width) {
      width = settings.width;
    }

    this.dialog.open(AdvancedConfirmDialogComponent, {
      width: width,
      data: { message: message },
    });
  }

  public addSSHConnection(settings?: any): Promise<boolean> {
    let width = "450px";
    let height = "auto";
    if (settings) {
      if (settings.width) {
        width = settings.width;
      }

      if (settings.height) {
        height = settings.height;
      }
    }

    const config = new MatDialogConfig();
    config.height = "auto";
    config.width = width;

    const ref = this.dialog.open(AddSshConnectionDialogComponent, {
      width,
      height,
    });

    return new Promise((resolve) => {
      ref.afterClosed().subscribe((result: boolean) => {
        resolve(result);
      });
    });
  }

  /**
   * Create a login dialog
   *
   * @param {*} [settings]
   * @returns {Promise<ILoginData>}
   * @memberof DialogService
   */
  public login(settings?: any): Promise<ILoginData> {
    let width = "250px";

    if (settings && settings.width) {
      width = settings.width;
    }

    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: width,
    });

    return new Promise((resolve, reject) => {
      dialogRef.afterClosed().subscribe((result: ILoginData) => {
        resolve(result);
      });
    });
  }
}
