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
import { KeyService } from "../../../shared/services/key.service";
import { IKeyData } from "../../../shared/interfaces/key.interfaces";
import { IKey, TransactionHandler } from "@activeledger/sdk";

import * as ace from "brace";
import "brace/mode/json";
import "brace/theme/merbivore_soft";
import "brace/ext/beautify";

@Component({
  selector: "app-signing",
  templateUrl: "./signing.component.html",
  styleUrls: ["./signing.component.scss"]
})
export class SigningComponent implements OnInit {
  // #region UI Data

  /**
   * The transaction to be signed
   *
   * @type {string}
   * @memberof SigningComponent
   */
  public transaction: string;

  /**
   * The key to sign the transaction with
   *
   * @type {IKeyData}
   * @memberof SigningComponent
   */
  public key: IKeyData;

  /**
   * The signature
   *
   * @memberof SigningComponent
   */
  public signature = "Signature";

  /**
   * A list of keys that can be used for signing
   *
   * @type {IKeyData[]}
   * @memberof SigningComponent
   */
  public keys: IKeyData[];

  /**
   * Whether the output should be shown as HEX or not
   *
   * @memberof SigningComponent
   */
  public outputHex = false;
  // #endregion

  // #region Internal Data
  /**
   * JSON editor holder
   *
   * @private
   * @memberof SigningComponent
   */
  private editor;
  // #endregion

  /**
   * Creates an instance of SigningComponent.
   * @param {KeyService} keyService
   * @memberof SigningComponent
   */
  constructor(private keyService: KeyService) {}

  // #region Angular control
  ngOnInit() {
    this.getKeys();

    this.editor = ace.edit("json-editor");
    this.editor.getSession().setMode("ace/mode/json");
    this.editor.setTheme("ace/theme/merbivore_soft");

    // Insert a transaction template
    this.editor.setValue(
      JSON.stringify(
        {
          $namespace: "",
          $contract: "",
          $entry: "",
          $i: {},
          $o: {}
        },
        null,
        4
      )
    );

    this.editor.clearSelection();
    this.editor.moveCursorTo(0, 0);
  }
  // #endregion

  // #region Page Control
  public switchType(): void {
    let inFormat = "base64";
    let outFormat = "hex";

    if (this.outputHex) {
      inFormat = "hex";
      outFormat = "base64";
    }

    // inFormat needs to be typed BufferEncoding
    const holder = Buffer.from(this.signature, inFormat as any);
    this.signature = holder.toString(outFormat);
  }
  // #endregion

  // #region Getters
  private getKeys(): void {
    this.keyService
      .getKeys()
      .then((keys: IKeyData[]) => {
        this.keys = keys;
      })
      .catch((err: unknown) => {
        console.log(err);
      });
  }
  // #endregion

  // #region Sign
  public sign(): void {
    const txHandler = new TransactionHandler();
    const key: IKey = {
      key: {
        prv: this.key.prv,
        pub: this.key.pub
      },
      name: this.key.name,
      type: this.key.encryption
    };

    try {
      this.transaction = JSON.stringify(JSON.parse(this.editor.getValue()));
    } catch (err) {
      // Not a JSON object
    }

    txHandler
      .signTransaction(this.transaction, key)
      .then((sig: string) => {
        if (this.outputHex) {
          const holder = Buffer.from(sig, "base64");
          this.signature = holder.toString("hex");
        } else {
          this.signature = sig;
        }
      })
      .catch((err: unknown) => {
        console.log(err);
      });
  }
  // #endregion
}
