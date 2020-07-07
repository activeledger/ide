import { Component, OnInit, ViewChild } from "@angular/core";
import { SshService } from "../../../../shared/services/ssh.service";
import { ISSH } from "../../../../shared/interfaces/ssh.interface";
import {
  faSync,
  faExternalLink,
  faPlug,
  faPen,
  faTrash,
  faPowerOff,
  faRedo,
  faWifi,
  faWifiSlash,
} from "@fortawesome/pro-light-svg-icons";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "management",
  templateUrl: "./management.component.html",
  styleUrls: ["./management.component.scss"],
})
export class ManagementComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public connectionData: ISSH[] = [];
  public connections = new MatTableDataSource<ISSH>(this.connectionData);
  public node: ISSH;

  public icons = {
    refresh: faSync,
    view: faExternalLink,
    add: faPlug,
    edit: faPen,
    remove: faTrash,
    restart: faRedo,
    stop: faPowerOff,
    connected: faWifi,
    disconnected: faWifiSlash,
  };

  public displayColumns = [
    "name",
    "tags",
    "status",
    "uptime",
    "autoRestarts",
    "totalRestarts",
    "refresh",
    "view",
  ];

  public selectedNodeConnected = false;

  constructor(private readonly ssh: SshService) {}

  ngOnInit(): void {
    this.getSshConnections();
  }

  public connect(): void {}

  public getNodeData(connection: ISSH): void {}

  private async getSshConnections(): Promise<void> {
    try {
      this.connectionData = await this.ssh.getConnections();
    } catch (error) {
      console.error(error);
    }
    this.connections = new MatTableDataSource<ISSH>(this.connectionData);
    this.paginator.pageSize = 20;
    this.connections.paginator = this.paginator;
  }
}
