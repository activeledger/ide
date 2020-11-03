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

import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { WebviewTag } from "electron";
import { ElectronService } from "../../services/electron.service";

@Component({
  selector: "app-monaco-editor",
  templateUrl: "./monaco-editor.component.html",
  styleUrls: ["./monaco-editor.component.css"],
})
export class MonacoEditorComponent implements OnInit {
  @Output() loaded = new EventEmitter<boolean>();

  // Monaco Editor HTML file for webview
  public monaco = `file://${__dirname}/assets/monaco.html`; // For Build
  private monacoDev = "../../../../../assets/monaco.html"; // For development

  // Definition files
  private definitionsPath = `${__dirname}/assets/definitions`; // For Build
  private definitionsPathDev = "src/assets/definitions"; // For development

  private wv: WebviewTag;

  private monacoLoaded = false;
  private waitingLoad = false;
  private body: string;

  constructor(private electron: ElectronService) {
    // Override for dev
    if (this.electron.isDev) {
      this.monaco = this.monacoDev;
      this.definitionsPath = this.definitionsPathDev;
    }
  }

  ngOnInit() {}

  public async finishLoading(id: string) {
    this.wv = document.getElementById(id) as WebviewTag;
    await this.loadDefinitions(this.wv);
    await this.loadEditor(this.wv);
    this.monacoLoaded = true;

    if (this.waitingLoad) {
      this.setValue(this.body);
      this.waitingLoad = false;
    }
  }

  public electronConsole(e) {
    // Console output not currently working
    //console.log(e);
  }

  public getValue(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await this.wv.executeJavaScript("getValue()"));
      } catch (err) {
        reject(err);
      }
    });
  }

  public setValue(body): void {
    const bodyValue = body
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\"/g, `\\"`);

    if (this.monacoLoaded) {
      this.wv.executeJavaScript(`setNewValue("${bodyValue}");`);
    } else {
      this.body = body;
      this.waitingLoad = true;
    }
  }

  public clearEditor(): void {
    this.wv.executeJavaScript(`clearEditor()`);
  }

  public setDefault(): void {
    this.clearEditor();
    this.wv.executeJavaScript(`reset();`);
  }

  /**
   * Reads the definition files installed via npm and loads into the editor
   *
   * @private
   * @param {WebviewTag} wv
   * @memberof ContractsComponent
   */
  private loadDefinitions(wv: WebviewTag) {
    // Definition files to read and send
    const definitionFiles = [
      `${this.definitionsPath}/@activeledger/activecrypto/index.d.ts`,
      `${this.definitionsPath}/@activeledger/activecrypto/crypto/index.d.ts`,
      `${this.definitionsPath}/@activeledger/activecrypto/crypto/hash.d.ts`,
      `${this.definitionsPath}/@activeledger/activecrypto/crypto/keypair.d.ts`,
      `${this.definitionsPath}/@activeledger/activelogger/index.d.ts`,
      `${this.definitionsPath}/@activeledger/activedefinitions/index.d.ts`,
      `${this.definitionsPath}/@activeledger/activedefinitions/definitions/index.d.ts`,
      `${this.definitionsPath}/@activeledger/activedefinitions/definitions/document.d.ts`,
      `${this.definitionsPath}/@activeledger/activedefinitions/definitions/ledger.d.ts`,
      `${this.definitionsPath}/@activeledger/activequery/index.d.ts`,
      `${this.definitionsPath}/@activeledger/activecontracts/index.d.ts`,
      `${this.definitionsPath}/@activeledger/activecontracts/stream.d.ts`,
      `${this.definitionsPath}/@activeledger/activecontracts/standard.d.ts`,
      `${this.definitionsPath}/@activeledger/activecontracts/query.d.ts`,
      `${this.definitionsPath}/@activeledger/activecontracts/event.d.ts`,
      `${this.definitionsPath}/@activeledger/activecontracts/queryevent.d.ts`,
      `${this.definitionsPath}/@activeledger/activecontracts/postprocess.d.ts`,
      `${this.definitionsPath}/@activeledger/activecontracts/postprocessevent.d.ts`,
      `${this.definitionsPath}/@activeledger/activecontracts/postprocessquery.d.ts`,
      `${this.definitionsPath}/@activeledger/activecontracts/postprocessqueryevent.d.ts`,
      `${this.definitionsPath}/@activeledger/activeutilities/index.d.ts`,
      `${this.definitionsPath}/@activeledger/activeutilities/gzip.d.ts`,
      `${this.definitionsPath}/@activeledger/activeutilities/request.d.ts`,
      `${this.definitionsPath}/@activeledger/activetoolkits/index.d.ts`,
      `${this.definitionsPath}/@activeledger/activetoolkits/pdf/index.d.ts`,
      `${this.definitionsPath}/@activeledger/activetoolkits/pdf/interfaces.d.ts`,
      //`${this.definitionsPath}/@types/node/index.d`,
    ];

    // Loop Definition files
    for (let index = 0; index < definitionFiles.length; index++) {
      // Get File
      const file = definitionFiles[index];

      // Read File & Prepare for sending to webview
      const fileContents = this.electron.fs
        .readFileSync(file)
        .toString()
        .replace(/\"/g, `\\"`);
      // .replace(/\n|\r/g, "")
      // .replace(`/// <reference types="node" />`, "")
      // .replace(/\"/g, `\\"`);

      // Get import name
      let importName = file.replace(this.definitionsPath + "/", "");

      // Typescript is special for building
      // if (importName === "@types/node/index.d") {
      //   importName += ".ts";
      // }

      // Send to Monaco inside webview element
      wv.executeJavaScript(
        `def("${fileContents}","node_modules/${importName}");`
      );
    }
  }

  /**
   * Load Editor
   *
   * @private
   * @param {WebviewTag} wv
   * @memberof ContractsComponent
   */
  private async loadEditor(wv: WebviewTag) {
    await wv.executeJavaScript(`load()`);
    this.loaded.emit(true);
  }
}
