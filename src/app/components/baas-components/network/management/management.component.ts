import { Component, OnInit, ViewChild } from "@angular/core";
import {
  faExternalLinkSquareAlt,
  faPen,
  faTrash,
  faPlus,
  faFileImport,
  faFileExport,
  faCopy,
  faShip,
} from "@fortawesome/free-solid-svg-icons";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { INetworkBuilderConfig } from "../../../../shared/interfaces/baas.interfaces";
import { NetworkBuilderService } from "../../../../shared/services/network-builder.service";

@Component({
  selector: "management",
  templateUrl: "./management.component.html",
  styleUrls: ["./management.component.scss"],
})
export class ManagementComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public timelineEntries: [{ data: string; date: Date }];

  public network: {
    id: string;
    name: string;
    created: Date;
    updated: Date;
    onboarded: boolean;
  };

  public networkData: {
    id: string;
    name: string;
    created: Date;
    updated: Date;
    onboarded: boolean;
  }[] = [];

  public networks = new MatTableDataSource<any>(this.networkData);

  public icons = {
    view: faExternalLinkSquareAlt,
    add: faPlus,
    duplicate: faCopy,
    edit: faPen,
    remove: faTrash,
    import: faFileImport,
    export: faFileExport,
    onboarded: faShip,
  };

  public displayColumns = ["name", "created", "updated", "onboarded", "view"];

  constructor(
    private readonly router: Router,
    private readonly networkBuilderService: NetworkBuilderService
  ) {}

  ngOnInit(): void {
    this.getNetworks();
    this.getTimeline();
  }

  viewNetwork(network): void {
    this.router.navigateByUrl("/network/builder/" + network.id);
  }

  public async getTimeline(): Promise<void> {
    try {
      this.timelineEntries = await this.networkBuilderService.getTimeline();
    } catch (error) {
      console.error(error);
    }
  }

  public selectNetwork(network): void {
    this.network = network;
  }

  public newConfig(): void {
    this.router.navigateByUrl("/network/builder");
  }

  public async duplicate(): Promise<void> {
    try {
      await this.networkBuilderService.duplicateConfig(this.network.id);
      this.getNetworks();
      this.getTimeline();
    } catch (error) {
      console.error(error);
    }
  }

  public async edit(): Promise<void> {
    this.router.navigateByUrl("/network/builder/" + this.network.id);
  }

  public async remove(): Promise<void> {
    try {
      await this.networkBuilderService.removeConfig(this.network.id);
      this.getNetworks();
      this.getTimeline();
    } catch (error) {
      console.error(error);
    }
  }

  public async onboard(): Promise<void> {
    try {
      const config = await this.networkBuilderService.getConfig(
        this.network.id
      );
      config.onboarded = !config.onboarded;
      await this.networkBuilderService.updateConfig(config, true);
      this.network.onboarded = true;
      this.getTimeline();
    } catch (error) {
      console.error(error);
    }
  }

  public async import(): Promise<void> {
    try {
      await this.networkBuilderService.importConfig();
      this.getNetworks();
      this.getTimeline();
    } catch (error) {
      console.error(error);
    }
  }

  public async export(): Promise<void> {
    try {
      const config = await this.networkBuilderService.getConfig(
        this.network.id
      );
      await this.networkBuilderService.exportConfig(
        config.config,
        config.nodes
      );
      this.getTimeline();
    } catch (error) {
      console.error(error);
    }
  }

  private async getNetworks(): Promise<void> {
    try {
      const configs: INetworkBuilderConfig[] = await this.networkBuilderService.getConfigs();

      this.networkData = [];

      for (const config of configs) {
        this.networkData.push({
          id: config._id,
          name: config.config.name,
          created: config.created,
          updated: config.updated,
          onboarded: config.onboarded,
        });
      }

      this.networks = new MatTableDataSource<{
        id: string;
        name: string;
        created: Date;
        updated: Date;
        onboarded: boolean;
      }>(this.networkData);

      this.paginator.pageSize = 20;
      this.networks.paginator = this.paginator;
    } catch (error) {
      console.error(error);
    }
  }
}
