import { Component, OnInit, ViewChild } from "@angular/core";
import { SshService } from "../../../../shared/services/ssh.service";
import { ISSH, ISSHCreate } from "../../../../shared/interfaces/ssh.interface";
import {
  faSync,
  faPlug,
  faPen,
  faTrash,
  faPowerOff,
  faRedo,
  faWifi,
  faWifiSlash,
  faTimesCircle,
  faFileAlt,
  faTag,
  faTags,
  faDownload,
  faUndoAlt,
  faFileSignature,
  faUpload,
} from "@fortawesome/pro-light-svg-icons";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogService } from "../../../../shared/services/dialog.service";
import { INodeStats } from "../../../../shared/interfaces/baas.interfaces";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "management",
  templateUrl: "./management.component.html",
  styleUrls: ["./management.component.scss"],
})
export class ManagementComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public filter: string;
  public tags: string[];

  public connectionData: ISSH[] = [];
  public connections = new MatTableDataSource<ISSH>(this.connectionData);
  public node: ISSH;
  public nodeConnected = false;
  public nodeStats: { [id: string]: INodeStats } = {};

  public updateAvailable = false;

  public icons = {
    refresh: faSync,
    logs: faFileAlt,
    add: faPlug,
    edit: faPen,
    remove: faTrash,
    disconnect: faTimesCircle,
    restart: faRedo,
    stop: faPowerOff,
    connected: faWifi,
    disconnected: faWifiSlash,
    manageTags: faTag,
    manageTagsAll: faTags,
    install: faDownload,
    update: faUpload,
    rollback: faUndoAlt,
    joinNetwork: faFileSignature,
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
    "logs",
  ];

  public selectedNodeConnected = false;

  constructor(
    private readonly ssh: SshService,
    private readonly dialogService: DialogService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  public async install(): Promise<void> {
    await this.ssh.install(this.node._id);
  }

  public async update(): Promise<void> {
    await this.ssh.update(this.node._id);
  }

  public async rollback(): Promise<void> {
    // await this.ssh.rollback(this.node._id);
  }

  public async joinNetwork(): Promise<void> {}

  public refresh(event, node): void {
    this.node = node;

    event.stopPropagation();
    if (this.ssh.hasOpenConnection(this.node._id)) {
      this.getNodeStats();
    } else {
      this.connectTo(this.node);
    }
  }

  public async connectTo(row?): Promise<void> {
    if (row) {
      this.node = row;
    }

    try {
      if (await this.ssh.sshToNode(this.node._id)) {
        await this.getNodeStats(this.node._id);
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async disconnect(): Promise<void> {
    this.nodeConnected = false;
    await this.ssh.closeConnection(this.node._id);
    await this.getNodeStats();
  }

  public async restart(): Promise<void> {
    try {
      await this.ssh.restart(this.node._id);
      setTimeout(async () => {
        await this.getNodeStats();
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }

  public async start(): Promise<void> {
    try {
      await this.ssh.start(this.node._id);
      setTimeout(async () => {
        await this.getNodeStats();
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }

  public async stop(): Promise<void> {
    try {
      await this.ssh.stop(this.node._id);
      await this.getNodeStats();
    } catch (error) {
      console.error(error);
    }
  }

  public async getNodeStats(id?: string): Promise<void> {
    this.nodeConnected = true;

    if (!id) {
      id = this.node._id;
    }

    let stats = await this.ssh.getStats(id);
    // let stats: INodeStats = this.nodeStats[id];

    if (!stats) {
      return;
    }

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

  public async manageTags(): Promise<void> {
    const tags = await this.dialogService.manageTags(this.tags);

    if (!tags) {
      return;
    }

    if (tags.removeTags.length > 0) {
      await this.ssh.deleteTags(tags.removeTags);
    }
    if (tags.addTags.length > 0) {
      await this.ssh.addTags(tags.addTags);
    }

    this.tags = await this.ssh.getTags();
  }

  public openLog(event, node): void {
    event.stopPropagation();

    this.router.navigateByUrl("nodes/logs/" + node._id);
  }

  public async manageConnectionTags(): Promise<void> {
    const tags = await this.dialogService.manageTagsConnection(
      JSON.parse(JSON.stringify(this.tags)),
      JSON.parse(JSON.stringify(this.node.tags)),
      this.node.name
    );

    if (!tags) {
      return;
    }

    if (tags.removeTags.length > 0) {
      await this.ssh.removeTagsFromConnection(this.node._id, tags.removeTags);
    }
    if (tags.addTags.length > 0) {
      await this.ssh.addTagsToConnection(this.node._id, tags.addTags);
    }

    await this.getSshConnections();
  }

  public async filterByTag(event): Promise<void> {
    if (!event.value) {
      await this.getSshConnections();
    } else {
      this.connectionData = await this.ssh.filterByTag(event.value);
      this.connections = new MatTableDataSource<ISSH>(this.connectionData);
      this.paginator.pageSize = 20;
      this.connections.paginator = this.paginator;
    }
  }

  public async addConnection(): Promise<void> {
    try {
      const sshCreateData: ISSHCreate = await this.dialogService.addSSHConnection();

      // Cancelled
      if (!sshCreateData) {
        return;
      }

      await this.ssh.saveConnection(sshCreateData);

      this.getSshConnections();
    } catch (error) {
      console.error(error);
    }
  }

  public async removeConnection(): Promise<void> {
    if (!this.node) {
      this.dialogService.warning("No node selected!");
      return;
    }

    try {
      const confirm = await this.dialogService.confirm(
        `Deleting this connection will remove "${this.node.name}" with IP "${this.node.address}", all its details, and the key pair if it exists. Are you sure?`,
        { width: "500px" }
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

  public async editConnection(): Promise<void> {
    try {
      await this.ssh.editConnection(this.node._id);
      this.getSshConnections();
    } catch (error) {
      console.error(error);
    }
  }

  private async load(): Promise<void> {
    await this.getSshConnections();
    this.checkForIdParam();
  }

  private checkForIdParam(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        for (const connection of this.connectionData) {
          if (connection._id === params["id"]) {
            this.node = connection;
            break;
          }
        }
        this.connectTo(this.node);
      }
    });
  }

  private formatUptime(uptime: number): string {
    let uptimeString = uptime + "ms";

    let seconds = uptime / 1000;
    let minutes = seconds / 60;
    let hours = minutes / 60;
    let days = hours / 24;

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

  private async getSshConnections(): Promise<void> {
    try {
      this.tags = await this.ssh.getTags();
      this.connectionData = await this.ssh.getConnections();
    } catch (error) {
      console.error(error);
    }
    this.connections = new MatTableDataSource<ISSH>(this.connectionData);
    this.paginator.pageSize = 20;
    this.connections.paginator = this.paginator;
  }
}
