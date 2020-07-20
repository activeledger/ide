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
  faTimesCircle,
} from "@fortawesome/pro-light-svg-icons";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogService } from "../../../../shared/services/dialog.service";
import { INodeStats } from "../../../../shared/interfaces/baas.interfaces";

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
  public nodeStats: { [id: string]: INodeStats } = {
    "2ab4bffb-5d7c-4737-be90-67122d340cff": {
      cpu: {
        cores: 15,
        one: 0.01123046875,
        five: 0.05859375,
        fifteen: 0.0224609375,
      },
      ram: {
        total: 31562493952,
        free: 29329895424,
      },
      hdd: {
        activeledger: 124,
        diskSize: 263174212,
        diskFree: 92779300,
        diskUsed: 156956756,
      },
      status: "alive",
      restarts: {
        all: 0,
        auto: 0,
      },
      uptime: 224788,
      version: "2.3.1",
    },
  };

  public icons = {
    refresh: faSync,
    view: faExternalLink,
    add: faPlug,
    edit: faPen,
    remove: faTrash,
    disconnect: faTimesCircle,
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
      // await this.ssh.sshToNode(row._id);
      await this.getNodeStats(row._id);
    } catch (error) {
      console.error(error);
    }
  }

  public async getNodeStats(id?: string): Promise<void> {
    if (!id) {
      id = this.node._id;
    }

    // let stats = await this.ssh.getStats(id);
    let stats: INodeStats = this.nodeStats[id];
    console.log(JSON.stringify(stats, null, 2));

    stats = this.ramToString(stats);
    stats = this.hddToString(stats);

    stats.cpu.currentPercent = Math.ceil(
      (stats.cpu.one / stats.cpu.cores) * 100
    );

    stats.uptime = this.formatUptime(stats.uptime as number);

    if (!this.nodeStats) {
      this.nodeStats = {
        [id]: stats,
      };
    } else {
      this.nodeStats[id] = stats;
    }
  }

  private formatUptime(uptime: number): string {
    let uptimeString = uptime + "ms";

    let seconds = uptime / 1000;
    let minutes = seconds / 60;
    let hours = minutes / 60;
    let days = hours / 24;

    console.log("Days: " + days);
    console.log("Hours: " + hours);
    console.log("Minutes: " + minutes);
    console.log("Seconds: " + seconds);

    if (days > 1) {
      days = Math.floor(days);
      hours = Math.floor(hours % 24);
      return `${days}d ${hours}h`;
    }

    if (hours > 1) {
      hours = Math.floor(hours);
      minutes = Math.floor(minutes % 60);
      return `${hours}h ${minutes}m`;
    }

    if (minutes > 1) {
      minutes = Math.floor(minutes);
      seconds = Math.floor(seconds % 60);
      return `${minutes}m ${seconds}s`;
    }

    if (seconds > 1) {
      seconds = Math.floor(seconds);
      uptime = Math.floor(uptime % 1000);
      return `${seconds}s ${uptime}ms`;
    }

    // if (seconds > 0)

    return uptimeString;
  }

  private hddToString(stats: INodeStats): INodeStats {
    if (stats.hdd.activeledger < 1024) {
      stats.hdd.activeledger += "KB";
    } else {
      (stats.hdd.activeledger as number) /= 1024;

      if (stats.hdd.activeledger > 1024) {
        stats.hdd.activeledger =
          (stats.hdd.activeledger as number) / 1024 + "GB";
      } else {
        stats.hdd.activeledger += "MB";
      }
    }

    stats.hdd.diskUsed = this.correctBytes(
      Math.ceil((stats.hdd.diskUsed as number) / (1024 ^ 2))
    );
    stats.hdd.diskSize = this.correctBytes(
      Math.ceil((stats.hdd.diskSize as number) / (1024 ^ 2))
    );

    return stats;
  }

  private ramToString(stats: INodeStats): INodeStats {
    stats.ram.used = (stats.ram.total as number) - (stats.ram.free as number);
    // stats.ram.used = stats.ram.used / 1024 / 1024;

    stats.ram = {
      total: this.correctBytes((stats.ram.total as number) / 1024 / 1024),
      free: this.correctBytes((stats.ram.free as number) / 1024 / 1024),
      used: this.correctBytes((stats.ram.used as number) / 1024 / 1024),
    };

    return stats;
  }

  private correctBytes(size: number): string {
    let sizeString;
    if (size > 1024) {
      sizeString = Math.ceil(size / 1024) + "GB";
    } else {
      sizeString = Math.ceil(size) + "MB";
    }

    return sizeString;
  }

  public getNodeData(connection: ISSH): void {}

  public async addConnection(): Promise<void> {
    const ref = await this.dialogService.addSSHConnection();
    if (!ref) {
    }
  }

  public async removeConnection(): Promise<void> {
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
        this.getSshConnections();
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
