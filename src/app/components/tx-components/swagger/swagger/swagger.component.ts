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
import SwaggerUI from "swagger-ui";

import { LedgerService } from "../../../../shared/services/ledger.service";
import { ConnectionData } from "../../../../shared/structures/connection.structures";

@Component({
  selector: "app-swagger",
  templateUrl: "./swagger.component.html",
  styleUrls: ["./swagger.component.scss"],
})
export class SwaggerComponent implements OnInit {
  // #region UI data

  /**
   * Array of connections
   *
   * @type {Array<ConnectionData>}
   * @memberof SwaggerComponent
   */
  public connections: Array<ConnectionData>;

  /**
   * Show or hide the swagger element
   *
   * @memberof SwaggerComponent
   */
  public noswag = false;
  // #endregion

  /**
   *Creates an instance of SwaggerComponent.
   * @param {LedgerService} ledger
   * @memberof SwaggerComponent
   */
  constructor(private ledger: LedgerService) {}

  // #region Angular Controls
  ngOnInit() {
    this.getConnections();
  }
  // #endregion

  // #region Getters
  /**
   * Get stored connections
   * Some nice code copy (connections.com)
   *
   * @private
   * @memberof SettingsComponent
   */
  private getConnections(): void {
    this.ledger
      .getConnections()
      .then((connections: Array<ConnectionData>) => {
        this.connections = connections;
      })
      .catch((err: any) => {
        console.error(err);
      });
  }
  // #endregion

  // #region Load API Explorer
  /**
   * Load Swagger from a Ledger connection
   *
   * @param {*} event
   * @memberof SwaggerComponent
   */
  public loadApi(event) {
    SwaggerUI({
      dom_id: "#swaggerId",
      url: `${event.value.protocol}://${event.value.address}:${
        parseInt(event.value.port, 10) + 1
      }/openapi.json`,
    });
    // Show card
    this.noswag = true;
  }

  /**
   * Load a custom openapi json file
   *
   * @param {*} event
   * @memberof SwaggerComponent
   */
  public loadCustomApi(event) {
    SwaggerUI({
      dom_id: "#swaggerId",
      url: event,
    });
    // Show card
    this.noswag = true;
  }
  // #endregion
}
