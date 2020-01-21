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
import { faBan, faWindowMinimize } from "@fortawesome/free-solid-svg-icons";
import { ConsoleService } from "../../services/console.service";
import { ElectronService } from "../../services/electron.service";
import { GeneralService } from "../../services/general.service";

/*
  --- Console usage
  private logger = (window as any).logger;

  this.logger.info("info");
  this.logger.warning("warning");
  this.logger.error("error");
*/
@Component({
  selector: "app-console",
  templateUrl: "./console.component.html",
  styleUrls: ["./console.component.scss"]
})
export class ConsoleComponent implements OnInit {
  public clearIcon = faBan;
  public minimizeIcon = faWindowMinimize;

  private showing = "output";

  public setup = {
    show: {
      output: true,
      error: false,
      warning: false,
      info: false
    }
  };

  private data = {
    info: "",
    warning: "",
    error: "",
    output: ""
  };

  public counts = {
    info: 0,
    warning: 0,
    error: 0,
    all: 0
  };

  @Output() initComplete = new EventEmitter();
  @Output() minimise = new EventEmitter();

  constructor(
    private consoleService: ConsoleService,
    private electron: ElectronService,
    private generalService: GeneralService
  ) {}

  ngOnInit() {
    this.initComplete.next();

    this.consoleService.emitter.on("info", data => {
      this.add("info", data);
    });

    this.consoleService.emitter.on("warning", data => {
      this.add("warning", data);
    });

    this.consoleService.emitter.on("error", data => {
      this.add("error", data);
    });

    this.showWelcome();
  }

  public openTo(tab: string): void {
    this.show(tab);
  }

  private showWelcome(): void {
    const message = `Welcome to Active Harmony! \nYou are using ${this.generalService.version}, enjoy...`;
    this.data.output += message + "\r\n\n";
  }

  public minimiseConsole() {
    this.minimise.next();
  }

  public show(element: string): void {
    this.showing = element;

    // Set all to false
    const keys = Object.keys(this.setup.show);
    let i = keys.length;
    while (i--) {
      this.setup.show[keys[i]] = false;
      document.getElementById(keys[i]).classList.remove("active");
    }

    // Show the selected element
    this.setup.show[element] = true;

    // Make that element tab button active
    document.getElementById(element).classList.add("active");

    this.scrollUpdate();
  }

  private add(element: string, data: any): void {
    // Update count
    this.counts[element]++;
    this.counts.all++;

    // Add to data
    this.data[element] += data + "\r\n\n";

    // Add to output data
    this.data.output += data + "\r\n\n";

    // Update scroll position to bottom
    this.scrollUpdate();
  }

  private scrollUpdate(): void {
    const element = document.getElementById("console-body");
    element.scrollTop = element.scrollHeight;
  }

  public clear() {
    this.data[this.showing] = "";

    if (this.showing === "output") {
      this.counts.all = 0;
    } else {
      this.counts[this.showing] = 0;
    }
  }
}
