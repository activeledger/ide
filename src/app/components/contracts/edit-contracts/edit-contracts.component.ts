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
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
} from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import {
  faSave,
  faEllipsisV,
  faArrowLeft,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

import { Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { ContractData } from "../../../shared/structures/contract.structures";
import { DialogService } from "../../../shared/services/dialog.service";
import { DataService } from "../../../shared/services/data.service";
import { GeneralService } from "../../../shared/services/general.service";
import { SaveService } from "../../../shared/services/save.service";
import { QuickBarComponent } from "../../../shared/components/quick-bar/quick-bar.component";
import { ElectronService } from "../../../shared/services/electron.service";
import { FileService } from "../../../shared/services/file.service";
import { WorkflowService } from "../../../shared/services/workflow.service";
import { ContractService } from "../../../shared/services/contract.service";
import { ISaveData } from "../../../shared/interfaces/contract.interfaces";
import { SaveErrorData } from "../../../shared/classes/errors.classes";
import {
  MonacoEditorLoaderService,
  MonacoEditorComponent,
} from "@materia-ui/ngx-monaco-editor";
import { filter, take } from "rxjs/operators";
import { ContractTemplatesService } from "./contract-templates.service";

/**
 * Contract editor
 *
 * @export
 * @class EditContractsComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: "app-edit-contracts",
  templateUrl: "./edit-contracts.component.html",
  styleUrls: ["./edit-contracts.component.scss"],
})
export class EditContractsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  public editorOptions = {
    theme: "vs-dark",
    language: "typescript",
    autoClosingBrackets: true,
    autoIndent: true,
  };
  public code: string = 'function x() {\nconsole.log("Hello world!");\n}';

  // #region UI Data

  /**
   * Holds all contracts stored in the database
   *
   * @type {Array<ContractData>}
   * @memberof EditContractsComponent
   */
  public contracts: Array<ContractData>;

  /**
   * Holds the data for the opened contract
   *
   * @public
   * @type {ContractData}
   * @memberof EditContractsComponent
   */
  public contract: ContractData;

  /**
   * Icon for the back button
   *
   * @memberof EditContractsComponent
   */
  public backIco = faArrowLeft;

  /**
   * Save Icon
   *
   * @memberof EditContractsComponent
   */
  public saveIco = faSave;

  /**
   * Kebab Icon
   *
   * @memberof EditContractsComponent
   */
  public kebabIco = faEllipsisV;

  /**
   * Down arrow Icon
   *
   * @memberof EditContractsComponent
   */
  public downIco = faChevronDown;

  /**
   * Holds UI setup data
   *
   * @memberof EditContractsComponent
   */
  public setup = {
    showEditor: false,
    showLoader: true,
    showVersionSelect: false,
    showOptionsMenu: false,
  };

  /**
   * Holds all version numbers of the contract
   *
   * @private
   * @type {Array<string>}
   * @memberof EditContractsComponent
   */
  public versions: Array<string>;

  /**
   * Columns to display in the table
   *
   * @memberof EditContractsComponent
   */
  public displayedColumns = [
    "name",
    "created",
    "updated",
    "uploaded",
    "streamid",
    "info",
  ];

  // #endregion

  // #region Internal Data

  /**
   * Holds the current contract version
   *
   * @private
   * @type {string}
   * @memberof EditContractsComponent
   */
  private contractVersion: string;

  /**
   * Holds the selected contract version
   *
   * @private
   * @type {string}
   * @memberof EditContractsComponent
   */
  private selectedVersion: string;

  /**
   * Custom logger
   *
   * @private
   * @memberof EditContractsComponent
   */
  private logger = (window as any).logger;

  /**
   * Instance of the monaco editor from the window
   *
   * @private
   * @type {*}
   * @memberof EditContractsComponent
   */
  private monaco: any;

  // #endregion

  // #region Event emitters
  /**
   * Emits an event when the contract is finished loading
   *
   * @memberof EditContractsComponent
   */
  @Output() editorLoaded = new EventEmitter();

  /**
   * Emits an event when the contract is opened
   *
   * @memberof EditContractsComponent
   */
  @Output() contractOpenedEvent = new EventEmitter();

  /**
   * Emits an event when the contract is closed
   *
   * @memberof EditContractsComponent
   */
  @Output() contractClosedEvent = new EventEmitter();

  // #endregion

  // #region Event subscriptions
  /**
   * Subscription to the run workflow event
   *
   * @private
   * @type {Subscription}
   * @memberof EditContractsComponent
   */
  private runWorkflowSubscription: Subscription;

  /**
   * Subscription to the upload contract event
   *
   * @private
   * @type {Subscription}
   * @memberof EditContractsComponent
   */
  private uploadContractSubscription: Subscription;

  /**
   * Subscription to the open contract event
   *
   * @private
   * @type {Subscription}
   * @memberof EditContractsComponent
   */
  private openContractSubscription: Subscription;
  // #endregion

  /**
   * Creates an instance of EditContractsComponent.
   * @param {DialogService} dialogService
   * @param {DataService} dataService
   * @param {NgxSpinnerService} spinner
   * @param {GeneralService} generalService
   * @param {Router} router
   * @param {SaveService} saveService
   * @param {QuickBarComponent} quickBar
   * @param {ElectronService} electronService
   * @param {FileService} fileService
   * @param {ChangeDetectorRef} cd
   * @param {WorkflowService} workflowService
   * @param {ContractService} contractService
   * @memberof EditContractsComponent
   */
  constructor(
    private dialogService: DialogService,
    private dataService: DataService,
    private spinner: NgxSpinnerService,
    private generalService: GeneralService,
    public router: Router,
    private saveService: SaveService,
    private quickBar: QuickBarComponent,
    public electronService: ElectronService,
    private fileService: FileService,
    private cd: ChangeDetectorRef,
    private workflowService: WorkflowService,
    private contractService: ContractService,
    private monacoLoadService: MonacoEditorLoaderService,
    private contractTemplateService: ContractTemplatesService
  ) {
    this.monacoLoadService.isMonacoLoaded$
      .pipe(
        filter((isLoaded) => isLoaded),
        take(1)
      )
      .subscribe(() => {
        this.monaco = (window as any).monaco;
        this.initialiseMonaco();
      });

    this.contract = new ContractData();
  }

  // #region Angular control

  ngOnInit() {
    this.quickBar.setPageTitle("Contract Editor");
    this.getContracts();
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    this.runWorkflowSubscription.unsubscribe();
    this.uploadContractSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.editorLoaded.next();
    this.runWorkflowSubscription = this.workflowService.runWorkflowEvent.subscribe(
      ($event) => {
        this.runWorkflow($event.workflowId);
      }
    );

    this.uploadContractSubscription = this.contractService.uploadContractEvent.subscribe(
      async ($event) => {
        try {
          await this.contractService.uploadContract(
            this.code,
            this.contract,
            this.selectedVersion,
            $event.identityId,
            $event.update
          );

          this.workflowService.sendShowUpdateButtonEvent(this.contract._id);
          this.getContracts();
        } catch (error) {
          console.error(error);
        }
      }
    );

    this.openContractSubscription = this.contractService.openContractEvent.subscribe(
      ($event) => {
        this.contract = $event.contract;
        this.openContractSubscription.unsubscribe();
      }
    );
  }

  // #endregion

  // #region Initialisation

  /**
   * Initialise the editor
   * Setup compiler options
   * Set definition files
   *
   * @memberof EditContractsComponent
   */
  public initialiseMonaco(): void {
    // Definition files
    let definitionsPath = `${__dirname}/assets/definitions`; // For Build
    const definitionsPathDev = "src/assets/definitions"; // For development

    if (this.electronService.isDev) {
      definitionsPath = definitionsPathDev;
    }

    this.monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2016,
      allowNonTsExtensions: true,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
    });

    this.code = this.contractTemplateService.default;

    // Definition files to read and send
    const definitionFiles = [
      `${definitionsPath}/@activeledger/activecrypto/index.d.ts`,
      `${definitionsPath}/@activeledger/activecrypto/crypto/index.d.ts`,
      `${definitionsPath}/@activeledger/activecrypto/crypto/hash.d.ts`,
      `${definitionsPath}/@activeledger/activecrypto/crypto/keypair.d.ts`,
      `${definitionsPath}/@activeledger/activelogger/index.d.ts`,
      `${definitionsPath}/@activeledger/activedefinitions/index.d.ts`,
      `${definitionsPath}/@activeledger/activedefinitions/definitions/index.d.ts`,
      `${definitionsPath}/@activeledger/activedefinitions/definitions/document.d.ts`,
      `${definitionsPath}/@activeledger/activedefinitions/definitions/ledger.d.ts`,
      `${definitionsPath}/@activeledger/activequery/index.d.ts`,
      `${definitionsPath}/@activeledger/activecontracts/index.d.ts`,
      `${definitionsPath}/@activeledger/activecontracts/stream.d.ts`,
      `${definitionsPath}/@activeledger/activecontracts/standard.d.ts`,
      `${definitionsPath}/@activeledger/activecontracts/query.d.ts`,
      `${definitionsPath}/@activeledger/activecontracts/event.d.ts`,
      `${definitionsPath}/@activeledger/activecontracts/queryevent.d.ts`,
      `${definitionsPath}/@activeledger/activecontracts/postprocess.d.ts`,
      `${definitionsPath}/@activeledger/activecontracts/postprocessevent.d.ts`,
      `${definitionsPath}/@activeledger/activecontracts/postprocessquery.d.ts`,
      `${definitionsPath}/@activeledger/activecontracts/postprocessqueryevent.d.ts`,
      `${definitionsPath}/@activeledger/activeutilities/index.d.ts`,
      `${definitionsPath}/@activeledger/activeutilities/gzip.d.ts`,
      `${definitionsPath}/@activeledger/activeutilities/request.d.ts`,
      `${definitionsPath}/@activeledger/activetoolkits/index.d.ts`,
      `${definitionsPath}/@activeledger/activetoolkits/pdf/index.d.ts`,
      `${definitionsPath}/@activeledger/activetoolkits/pdf/interfaces.d.ts`,
      `${definitionsPath}/@types/node/index.d`,
    ];

    // Loop Definition files
    for (const file of definitionFiles) {
      console.log("Reading file at ");
      console.log(file);

      // Read File & Prepare for sending to webview
      const fileContents = this.electronService.fs
        .readFileSync(file)
        .toString()
        .replace(/\n|\r/g, "")
        .replace(/\"/g, `\\"`);

      // Get import name
      let importName = file.replace(definitionsPath + "/", "");

      // Typescript is special for building
      if (importName === "@types/node/index.d") {
        importName += ".ts";
      }

      this.monaco.languages.typescript.typescriptDefaults.addExtraLib(
        fileContents,
        `node_modules/${importName}`
      );

      // ! Not sure if this is needed, it errors when live
      /* this.monaco.editor.createModel(
        fileContents,
        "typescript",
        new monaco.Uri().with({ path: `node_modules/${importName}` })
      ); */
    }

    // #endregion
  }

  // #region External
  /**
   * Initiate the creation of a new contract
   *
   * @memberof EditContractsComponent
   */
  public setupCreateContract(): void {
    this.newContract();
  }

  /**
   * Show the contract editor
   *
   * @private
   * @memberof EditContractsComponent
   */
  private showEditor(): void {
    this.setup.showEditor = true;
    this.contractOpenedEvent.emit();
    this.workflowService.sendSetContractIdEvent(this.contract._id);
  }

  /**
   * Hide the contract editor
   *
   * @private
   * @memberof EditContractsComponent
   */
  private hideEditor(): void {
    this.setup.showEditor = false;
    this.contractClosedEvent.emit();
  }

  // #endregion

  // #region Menu items

  /**
   * Show the list of saved contracts
   *
   * @public
   * @memberof EditContractsComponent
   */
  public showLoader() {
    this.hideEditor();
    this.setup.showLoader = true;
    this.toggleVersionSelect(true);
    this.toggleOptionsMenu(true);
  }

  /**
   * Load the default contract for editing
   *
   * @private
   * @memberof EditContractsComponent
   */
  private newContract() {
    this.contract = new ContractData();

    if (this.setup.showEditor) {
      this.code = this.contractTemplateService.default;
    } else {
      this.setup.showLoader = false;
      this.showEditor();
      this.code = this.contractTemplateService.default;
      // Change detection due to out of scope call (this.setupCreateComponent)
      // this.cd.detectChanges();
    }
  }

  /**
   * Clear the monaco editor
   *
   * @private
   * @memberof EditContractsComponent
   */
  public clearEditor(): void {
    this.code = "";
  }

  /**
   * Export a contraact to the filesystem
   *
   * @memberof EditContractsComponent
   */
  public export(): void {
    this.fileService
      .getSaveLocation()
      .then(() => {
        return this.fileService.save(
          atob(this.contract.versions[this.selectedVersion])
        );
      })
      .then(() => {
        this.dialogService.info("Contract exported successfully.");
      })
      .catch((err: unknown) => {
        this.dialogService.error("There was an error exporting the contract.");
        console.error(err);
      });
  }

  // #endregion

  // #region Contract loader

  /**
   * Get the saved contracts
   *
   * @memberof EditContractsComponent
   */
  public getContracts() {
    this.dataService
      .getContracts()
      .then((contracts: Array<ContractData>) => {
        this.contracts = contracts;
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  /**
   * Open a specific contract
   *
   * @private
   * @param {ContractData} contract
   * @memberof EditContractsComponent
   */
  public open(contract: ContractData): void {
    this.setup.showLoader = false;
    this.contract = contract;

    // Setup the versions
    this.getVersions();

    this.selectedVersion = this.versions[this.versions.length - 1];
    let i = this.versions.length;
    while (i--) {
      if (this.versions[i].indexOf("@latest") > -1) {
        this.selectedVersion = this.versions[i];
      }
    }
    this.loadContract();
  }

  /**
   * Get and display the stream id of a contract
   *
   * @private
   * @param {ContractData} contract
   * @memberof EditContractsComponent
   */
  public getID(contract: ContractData) {
    this.dialogService.contractInfo(contract, {
      width: "800px",
      allowCopy: true,
    });
  }

  /**
   * Open a dialog with information about the open contract
   *
   * @private
   * @memberof EditContractsComponent
   */
  public showContractInfo(contract?: ContractData): void {
    if (contract) {
      this.contract = contract;
    }
    this.toggleOptionsMenu();

    const url =
      "/contracts/info/" + this.contract._id + "/" + this.selectedVersion;

    this.router.navigateByUrl(url);
  }

  // #endregion

  // #region Contract editor

  /**
   * Load the opened contract into the monaco editor
   *
   * @private
   * @memberof EditContractsComponent
   */
  public loadContract() {
    if (this.contract && this.contract._id) {
      if (!this.versions) {
        this.getVersions();
      }

      const body = this.contract.versions[this.selectedVersion];

      if (this.generalService.isb64(body)) {
        this.code = atob(body);
      } else {
        this.code = body;
      }
    } else {
      this.code = this.contractTemplateService.default;
    }
    this.setup.showLoader = false;
    this.showEditor();
  }

  /**
   * Open a specific version
   *
   * @param {string} version
   * @memberof EditContractsComponent
   */
  public openVersion(version: string): void {
    this.selectedVersion = version;
    this.toggleVersionSelect();
    this.loadContract();
  }

  /**
   * Get the versions of the loaded contract
   *
   * @private
   * @memberof EditContractsComponent
   */
  private getVersions(): void {
    this.versions = Object.keys(this.contract.versions);
  }

  /**
   * Check that the contract has a version
   *
   * @private
   * @returns {object}
   * @memberof EditContractsComponent
   */
  public versionCheck(): object {
    let valid = false;

    const checks = {
      isSet: false,
      used: false,
    };

    // Check the version has actually been set
    if (this.contractVersion && this.contractVersion !== "") {
      checks.isSet = true;
    }

    // Check that the version hasn't already been used.
    const versions = Object.keys(this.contract.versions);
    let i = versions.length;
    while (i--) {
      const version = versions[i];

      if (version.indexOf(this.contractVersion) > -1) {
        checks.used = true;
        break;
      }
    }

    if (checks.isSet && !checks.used) {
      valid = true;
    }

    const payload = {
      validity: valid,
      checked: checks,
    };

    return payload;
  }

  /**
   * Save the contract in the editor
   *
   * @memberof EditContractsComponent
   */
  public async saveContract(): Promise<void> {
    this.selectedVersion = "";

    try {
      const response = await this.saveService.saveContract(
        this.contract,
        this.code,
        true
      );
      this.getContracts();
      this.contract = response.contract;
      this.getVersions();
      this.selectedVersion = response.version;
      this.spinner.hide();

      if (response.close) {
        this.showLoader();
      }
    } catch (error) {
      this.spinner.hide();

      if (error.error !== "cancelled") {
        console.error(error);
        this.dialogService.error(error.description, error.code);
      }
    }
  }

  /**
   * Toggle the version selector
   *
   * @public
   * @param {boolean} [hide]
   * @memberof EditContractsComponent
   */
  public toggleVersionSelect(hide?: boolean): void {
    if (hide) {
      this.setup.showVersionSelect = false;
    } else {
      this.setup.showVersionSelect = !this.setup.showVersionSelect;
    }
  }

  /**
   * Toggle the options menu
   *
   * @public
   * @param {boolean} [hide]
   * @memberof EditContractsComponent
   */
  public toggleOptionsMenu(hide?: boolean): void {
    if (hide) {
      this.setup.showOptionsMenu = false;
    } else {
      this.setup.showOptionsMenu = !this.setup.showOptionsMenu;
    }
  }

  //#endregion

  // #region Workflows
  /**
   * Run a specific workflow
   *
   * @private
   * @param {string} workflowId
   * @memberof EditContractsComponent
   */
  private async runWorkflow(workflowId: string): Promise<void> {
    try {
      const savedData = await this.workflowService.run(
        workflowId,
        this.contract,
        this.code
      );
      this.contract = savedData.contract;
      this.selectedVersion = savedData.version;
      this.workflowService.sendShowUpdateButtonEvent(this.contract._id);
      this.getContracts();
    } catch (error) {
      this.dialogService.error("There was an error running the workflow.");
      console.error(error);
    }
  }
  // #endregion
}
