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
import { HttpClient } from "@angular/common/http";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { ConnectionData } from "../../../../../shared/structures/connection.structures";
import { LedgerService } from "../../../../../shared/services/ledger.service";

@Component({
  selector: "app-settings-connections",
  templateUrl: "./connections.component.html",
  styleUrls: ["./connections.component.css"],
})
export class ConnectionsComponent implements OnInit {
  // #region UI Data
  /**
   * Icon for the edit button
   *
   * @memberof ConnectionsComponent
   */
  public editIco = faPencilAlt;

  /**
   * Holds available connections
   *
   * @type {Array<ConnectionData>}
   * @memberof ConnectionsComponent
   */
  public connections: Array<ConnectionData>;

  /**
   * Holds data for a new connection
   *
   * @private
   * @memberof ConnectionsComponent
   */
  private newConnection = new ConnectionData();

  /**
   * Holder for connection data being modified
   *
   * @memberof ConnectionsComponent
   */
  public connectionModificationData = new ConnectionData();

  /**
   * UI Setup control
   *
   * @memberof ConnectionsComponent
   */
  public setup = {
    showAddConnection: false,
  };

  /**
   * Handle editing specific elements
   *
   * @private
   * @memberof SettingsComponent
   */
  public renameSelector = {
    id: "",
    type: "",
  };

  /**
   * Holds the result of testing the specific connection
   *
   * @memberof ConnectionsComponent
   */
  public connectionTestResult = {};

  /**
   * Holds array of protocol data for selection
   *
   * @memberof ConnectionsComponent
   */
  public protocols = ["http", "https"];
  // #endregion

  /**
   * Creates an instance of ConnectionsComponent.
   * @param {LedgerService} ledger
   * @param {HttpClient} http
   * @memberof ConnectionsComponent
   */
  constructor(private ledger: LedgerService, private http: HttpClient) {}

  // #region Angular controls
  ngOnInit() {
    this.getConnections();
  }
  // #endregion

  // #region UI Control
  /**
   * Enable renaming of data
   *
   * @private
   * @param {string} id
   * @param {string} type
   * @memberof SettingsComponent
   */
  public enableEdit(connection: ConnectionData, type: string): void {
    this.renameSelector.id = connection._id;
    this.renameSelector.type = type;

    this.connectionModificationData = connection;
  }

  /**
   * Save a new connection
   *
   * @private
   * @memberof SettingsComponent
   */
  public saveConnection(): void {
    this.setup.showAddConnection = false;
    this.ledger
      .addConnection(this.newConnection)
      .then(() => {
        this.getConnections();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * Save an updated connection address
   *
   * @private
   * @param {string} id
   * @memberof SettingsComponent
   */
  public saveEdit(id: string): void {
    this.renameSelector.id = "";
    this.renameSelector.type = "";

    let connection: ConnectionData;

    let i = this.connections.length;
    while (i--) {
      if (this.connections[i]._id === id) {
        this.connections[i] = connection = this.connectionModificationData;
        break;
      }
    }

    this.ledger
      .updateConnection(connection)
      .then(() => {
        this.getConnections();
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  /**
   * Test a connection by attempting to connect to the ledger status page
   *
   * @param {string} id
   * @memberof ConnectionsComponent
   */
  public testConnection(id: string): void {
    let i = this.connections.length;
    while (i--) {
      if (this.connections[i]._id === id) {
        const connection: ConnectionData = this.connections[i];
        const url = `${connection.protocol}://${connection.address}:${connection.port}/a/status`;

        this.connectionTestResult[connection._id] = "wait";

        this.http.get(url).subscribe(
          // Response received
          () => (this.connectionTestResult[connection._id] = "success"),
          // Error received
          () => (this.connectionTestResult[connection._id] = "failed")
        );
      }
    }
  }

  /**
   * Remove a connection
   *
   * @private
   * @param {ConnectionData} connection
   * @memberof SettingsComponent
   */
  public removeConnection(connection: ConnectionData): void {
    this.ledger
      .removeConnection(connection)
      .then((success: boolean) => {
        if (success) {
          this.getConnections();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
  // #endregion

  // #region Getters
  /**
   * Get stored connections
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
}
