import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormArray } from "@angular/forms";
import {
  faFileExport,
  faBath,
  faSave,
  faLayerPlus,
} from "@fortawesome/pro-light-svg-icons";
import { DialogService } from "../../../../shared/services/dialog.service";
import { INetworkBuilderConfig } from "../../../../shared/interfaces/baas.interfaces";
import { NetworkBuilderService } from "../../../../shared/services/network-builder.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "builder",
  templateUrl: "./builder.component.html",
  styleUrls: ["./builder.component.scss"],
})
export class BuilderComponent implements OnInit {
  public icons = {
    save: faSave,
    clear: faBath,
    export: faFileExport,
    addNode: faLayerPlus,
  };

  public configForm = new FormGroup({
    name: new FormControl(""),
    activeledger: new FormGroup({
      consensus: new FormControl(60),
      autostart: new FormGroup({
        core: new FormControl(true),
        restore: new FormControl(true),
      }),
    }),
    security: new FormGroup({
      signedConsensus: new FormControl(true),
      encryptedConsensus: new FormControl(true),
      hardenedKeys: new FormControl(true),
    }),
    networking: new FormGroup({
      bindingAddress: new FormControl("127.0.0.1:5260"),
      selfHosted: new FormControl(true),
      selfHostIP: new FormControl({ value: "127.0.0.1", disabled: true }),
      url: new FormControl(""),
      selfHostPort: new FormControl("5259"),
      corePort: new FormControl("5261"),
    }),
    database: new FormGroup({
      ledger: new FormControl("activeledger"),
      event: new FormControl("activeledgerevents"),
      error: new FormControl("activeledgererrors"),
    }),
    debug: new FormControl(false),
  });

  public nodeGroup = new FormGroup({
    host: new FormControl(""),
    port: new FormControl(""),
    publicKey: new FormControl(""),
  });

  public nodeForm = new FormGroup({
    nodes: new FormArray([this.nodeGroup]),
  });

  public selfHosted = true;

  private configOriginData: INetworkBuilderConfig;

  constructor(
    private readonly dialog: DialogService,
    private readonly networkBuilderService: NetworkBuilderService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.configForm
      .get("networking")
      .get("selfHosted")
      .valueChanges.subscribe((value: boolean) => {
        this.selfHosted = value;
      });
    this.checkForConfig();
  }

  get nodes() {
    return this.nodeForm.get("nodes") as FormArray;
  }

  addNode(): void {
    this.nodes.push(
      new FormGroup({
        host: new FormControl(""),
        port: new FormControl(""),
        publicKey: new FormControl(""),
      })
    );
  }

  public async checkForConfig(): Promise<void> {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.getConfig(params["id"]);
      }
    });
  }

  public async getConfig(id: string): Promise<void> {
    try {
      this.configOriginData = await this.networkBuilderService.getConfig(id);

      this.configForm.patchValue(this.configOriginData.config);
      this.nodeForm.patchValue(this.configOriginData.nodes);
    } catch (error) {
      console.error(error);
    }
  }

  public async saveConfig(): Promise<void> {
    if (!this.configForm.get("name").value) {
      await this.dialog.warning("Please set a name before saving!");
      return;
    }

    try {
      this.configOriginData
        ? await this.networkBuilderService.saveConfig(
            this.configForm.value,
            this.nodeForm.get("nodes").value,
            this.configOriginData._id
          )
        : await this.networkBuilderService.saveConfig(
            this.configForm.value,
            this.nodeForm.get("nodes").value
          );

      this.dialog.info(
        `Network config "${this.configForm.get("name").value}" has been saved`
      );
    } catch (error) {
      console.error(error);
    }
  }

  public async exportConfig(): Promise<void> {
    try {
      this.networkBuilderService.exportConfig(
        this.configForm.value,
        this.nodeForm.get("nodes").value
      );
    } catch (error) {
      this.dialog.error("Exporting failed.");
    }
  }

  public async clearConfig(): Promise<void> {
    try {
      const response = await this.dialog.confirm(
        "This will clear all data from the form, are you sure?"
      );

      if (response) {
        this.configForm.reset();
        this.nodeGroup.reset();
        this.nodeForm.reset();

        this.configForm.patchValue({
          activeledger: {
            consensus: 60,
          },
          networking: {
            bindingAddress: "127.0.0.1:5260",
            selfHosted: true,
            selfHostIP: "127.0.0.1",
            selfHostPort: "5259",
            corePort: "5261",
          },
          database: {
            ledger: "activeledger",
            event: "activeledgerevents",
            error: "activeledgererrors",
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}
