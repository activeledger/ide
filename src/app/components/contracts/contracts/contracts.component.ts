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

import {
  Component,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";

import { ContractService } from "../../../shared/services/contract.service";
import { EditContractsComponent } from "../edit-contracts/edit-contracts.component";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-contracts",
  templateUrl: "./contracts.component.html",
  styleUrls: ["./contracts.component.scss"]
})
export class ContractsComponent implements OnInit, AfterViewInit, OnDestroy {
  // #region UI Data
  /**
   * Contract editor
   *
   * @type {EditContractsComponent}
   * @memberof ContractsComponent
   */
  @ViewChild(EditContractsComponent, { static: true })
  editContracts: EditContractsComponent;

  /**
   * Load create
   *
   * @memberof ContractsComponent
   */
  public loadCreate = false;

  /**
   * Is editor initialised
   *
   * @memberof ContractsComponent
   */
  public editorInit = true;

  /**
   * Is view initialised
   *
   * @memberof ContractsComponent
   */
  public viewInitComplete = false;

  /**
   * UI display control
   *
   * @memberof ContractsComponent
   */
  public setup = {
    editorOn: false,
    contractOpened: false
  };

  // #region Subscriptions

  /**
   * Subscribe to navigation change event
   *
   * @private
   * @type {Subscription}
   * @memberof ContractsComponent
   */
  private navigationSubscription: Subscription;

  /**
   * Subscribe to contract opened event
   *
   * @private
   * @type {Subscription}
   * @memberof ContractsComponent
   */
  private contractOpenedSubscription: Subscription;

  /**
   * Subscribe to contract closed event
   *
   * @private
   * @type {Subscription}
   * @memberof ContractsComponent
   */
  private contractClosedSubscription: Subscription;
  // #endregion

  /**
   *Creates an instance of ContractsComponent.
   * @param {ActivatedRoute} route
   * @param {Router} router
   * @param {ContractService} contractService
   * @memberof ContractsComponent
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contractService: ContractService
  ) {}

  // #region Angular control

  ngOnInit() {
    this.checkRoute();
  }

  ngAfterViewInit() {
    this.viewInitComplete = true;
    if (this.loadCreate) {
      this.editContracts.setupCreateContract();
    }

    this.contractOpenedSubscription = this.editContracts.contractOpenedEvent.subscribe(
      () => {
        this.setup.contractOpened = true;
      }
    );

    this.contractClosedSubscription = this.editContracts.contractClosedEvent.subscribe(
      () => {
        this.setup.contractOpened = false;
      }
    );

    this.navigationSubscription = this.router.events.subscribe(
      (navEvent: any) => {
        if (navEvent instanceof NavigationEnd) {
          this.checkRoute();
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }

    if (this.contractOpenedSubscription) {
      this.contractOpenedSubscription.unsubscribe();
    }

    if (this.contractClosedSubscription) {
      this.contractClosedSubscription.unsubscribe();
    }
  }

  // #endregion

  /**
   * Check if there are parameters in the route
   *
   * @private
   * @memberof ContractsComponent
   */
  private checkRoute() {
    this.route.params.subscribe(params => {
      if (params["option"]) {
        this.loadCreateLoop();
      }

      if (params["id"]) {
        this.contractService.sendOpenContractEvent(params["id"]);
      }
    });
  }

  /**
   * Use a loop to try and load the create contract
   *
   * @private
   * @param {number} [attempts]
   * @memberof ContractsComponent
   */
  private loadCreateLoop(attempts?: number) {
    // TODO: Use an event to track if editor loaded?
    if (typeof attempts !== "number") {
      attempts = 0;
    } else {
      attempts++;
    }

    // TODO: Must get rid of recursion, loaded status?
    try {
      this.editContracts.setupCreateContract();
      this.setup.editorOn = true;
      this.setup.contractOpened = true;
    } catch (e) {
      if (attempts <= 10) {
        setTimeout(() => {
          this.loadCreateLoop(attempts++);
        }, 500);
      } else {
        console.error("Failed to load editor.");
        console.error(e);
        // Reset just incase
        this.setup.editorOn = false;
      }
    }
  }
}
