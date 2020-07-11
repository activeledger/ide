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
import { DialogService } from "../../../../shared/services/dialog.service";

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
    "firstSeen",
    "tags",
    "status",
    "uptime",
    "autoRestarts",
    "totalRestarts",
    "refresh",
    "view",
  ];

  public selectedNodeConnected = false;

  constructor(
    private readonly ssh: SshService,
    private readonly dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getSshConnections();
  }

  public connect(): void {}

  public async connectTo(row): Promise<void> {
    try {
      this.node = row;
      await this.ssh.sshToNode(row._id);
      const data = await this.ssh.getStats(row._id);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  public getNodeData(connection: ISSH): void {}

  public async addConnection(): Promise<void> {
    const ref = await this.dialogService.addSSHConnection();
    if (!ref) {
    }
  }

  public async removeConnection(): Promise<void> {
    console.log("Debug");
    if (!this.node) {
      this.dialogService.warning("No node selected!");
      return;
    }

    try {
      const confirm = await this.dialogService.confirm(
        `Deleting this connection will remove ${this.node.name} with IP ${this.node.address}, all its details, and the key pair. Are you sure?`
      );
      if (confirm) {
        await this.ssh.removeConnection(this.node._id);
        this.dialogService.info("Connection removed.");
      }
    } catch (error) {
      this.dialogService.error("There was an error removing the connection.");
      console.error(error);
    }
  }

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
