import { Component, OnInit, ViewChild } from "@angular/core";
import {
  faExternalLink,
  faPen,
  faTrash,
  faPlus,
  faFileImport,
  faFileExport,
  faCopy,
} from "@fortawesome/pro-light-svg-icons";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";

@Component({
  selector: "management",
  templateUrl: "./management.component.html",
  styleUrls: ["./management.component.scss"],
})
export class ManagementComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public timelineEntries = [
    {
      timestamp: Date.now(),
      message: "Onboarded network xyz",
    },
    {
      timestamp: Date.now(),
      message: "Exported network xyz",
    },
    {
      timestamp: Date.now(),
      message: "Created network template xyz",
    },
    {
      timestamp: Date.now(),
      message: "Imported network xyz",
    },
    {
      timestamp: Date.now(),
      message: "Onboarded network xyz",
    },
    {
      timestamp: Date.now(),
      message: "Onboarded network xyz",
    },
    {
      timestamp: Date.now(),
      message: "Exported network xyz",
    },
    {
      timestamp: Date.now(),
      message: "Created network template xyz",
    },
    {
      timestamp: Date.now(),
      message: "Imported network xyz",
    },
    {
      timestamp: Date.now(),
      message: "Onboarded network xyz",
    },
    {
      timestamp: Date.now(),
      message: "Onboarded network xyz",
    },
    {
      timestamp: Date.now(),
      message: "Exported network xyz",
    },
    {
      timestamp: Date.now(),
      message: "Created network template xyz",
    },
    {
      timestamp: Date.now(),
      message: "Imported network xyz",
    },
    {
      timestamp: Date.now(),
      message: "Onboarded network xyz",
    },
  ];

  public networkData = [
    {
      name: "XYZ",
      created: Date.now(),
      updated: Date.now(),
      onboarded: true,
    },
  ];
  public networks = new MatTableDataSource<any>(this.networkData);

  public icons = {
    view: faExternalLink,
    add: faPlus,
    duplicate: faCopy,
    edit: faPen,
    remove: faTrash,
    import: faFileImport,
    export: faFileExport,
  };

  public displayColumns = ["name", "created", "updated", "onboarded", "view"];

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.networks.paginator = this.paginator;
  }

  viewNetwork(network): void {
    console.log(network);
    this.router.navigateByUrl("/network/config");
  }

  private async getNetworks(): Promise<void> {
    /* try {
      this.connectionData = await this.ssh.getConnections();
    } catch (error) {
      console.error(error);
    }
    this.connections = new MatTableDataSource<ISSH>(this.connectionData);
    this.paginator.pageSize = 20;
    this.connections.paginator = this.paginator; */
  }
}
