import { Component, OnInit, ViewChild } from "@angular/core";
import { DialogService } from "../../../../shared/services/dialog.service";
import { EChartOption } from "echarts";
import { faExternalLink } from "@fortawesome/pro-light-svg-icons";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { INodeStats } from "../../../../shared/interfaces/baas.interfaces";
import { ISSH } from "../../../../shared/interfaces/ssh.interface";
import { MatTableDataSource } from "@angular/material/table";
import { SshService } from "../../../../shared/services/ssh.service";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: "dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

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

  public hostInfo = {
    cpu: {
      value: 0,
      percent: "0%",
      max: 100,
      unit: "%",
    },
    ram: {
      value: 0,
      percent: "0%",
      max: 0,
      unit: "GB",
    },
    hdd: {
      value: 0,
      percent: "0",
      max: 0,
      unit: "GB",
    },
  };

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

  public noNodes = false;

  public icons = {
    refresh: faSync,
    view: faExternalLink,
  };

  public cpuChartOptions: EChartOption = {
    height: "100px",
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: ["15m", "5m", "1m"],
        axisLabel: {
          show: true,
          color: "#fff",
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        data: ["0%", "50%", "100%"],
        axisLabel: {
          show: true,
          color: "#fff",
        },
        min: 0,
        max: 100,
      },
    ],
    series: [
      {
        data: [0, 0, 0],
        type: "line",
        areaStyle: {},
        color: "#EB6CEB",
      },
    ],
  };

  public nodes = [
    {
      name: "testnet-uk",
      tags: ["tag x"],
      status: "Online",
      uptime: "2d 15h",
      restarts: {
        auto: 5,
        total: 10,
      },
    },
    {
      name: "testnet-uk",
      tags: ["tag x"],
      status: "Online",
      uptime: "2d 15h",
      restarts: {
        auto: 5,
        total: 10,
      },
    },
  ];

  public chartInstance;

  public mergeOption;

  public problems = [
    {
      date: Date.now(),
      body: `Lost connection to node x\nLast successful connection: 10:00:00`,
    },
    {
      date: Date.now(),
      body: `Lost connection to node x\nLast successful connection: 10:00:00`,
    },
    {
      date: Date.now(),
      body: `Lost connection to node x\nLast successful connection: 10:00:00`,
    },
    {
      date: Date.now(),
      body: `Lost connection to node x\nLast successful connection: 10:00:00`,
    },
    {
      date: Date.now(),
      body: `Lost connection to node x\nLast successful connection: 10:00:00`,
    },
    {
      date: Date.now(),
      body: `Lost connection to node x\nLast successful connection: 10:00:00`,
    },
    {
      date: Date.now(),
      body: `Lost connection to node x\nLast successful connection: 10:00:00`,
    },
    {
      date: Date.now(),
      body: `Lost connection to node x\nLast successful connection: 10:00:00`,
    },
    {
      date: Date.now(),
      body: `Lost connection to node x\nLast successful connection: 10:00:00`,
    },
  ];

  constructor(
    private readonly ssh: SshService,
    private readonly dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getSshConnections();
  }

  private updateCpuChart(): void {
    const stats = this.nodeStats[this.node._id];

    const one = Math.ceil((stats.cpu.one / stats.cpu.cores) * 100);
    const five = Math.ceil((stats.cpu.five / stats.cpu.cores) * 100);
    const fifteen = Math.ceil((stats.cpu.fifteen / stats.cpu.cores) * 100);

    this.mergeOption = { series: [{ data: [fifteen, five, one] }] };
  }

  public onChartInit(echart): void {
    this.chartInstance = echart;
  }

  public refresh(event): void {
    event.stopPropagation();
    this.getNodeStats();
  }

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

    stats = this.ramToString(stats);
    stats = this.hddToString(stats);

    stats.cpu.currentPercent = Math.ceil(
      (stats.cpu.one / stats.cpu.cores) * 100
    );

    console.log(stats);

    this.hostInfo.cpu.value = stats.cpu.currentPercent;
    // RAM
    this.hostInfo.ram.value = parseInt(
      (stats.ram.used as string).replace(/\D/g, "")
    );
    this.hostInfo.ram.max = parseInt(
      (stats.ram.total as string).replace(/\D/g, "")
    );
    this.hostInfo.ram.percent =
      (this.hostInfo.ram.value / this.hostInfo.ram.max) * 100 + "%";
    this.hostInfo.ram.unit = (stats.ram.total as string).replace(/\d/g, "");

    // HDD
    this.hostInfo.hdd.value = parseInt(
      (stats.hdd.diskUsed as string).replace(/\D/g, "")
    );
    this.hostInfo.hdd.max = parseInt(
      (stats.hdd.diskSize as string).replace(/\D/g, "")
    );
    this.hostInfo.hdd.percent =
      (this.hostInfo.hdd.value / this.hostInfo.hdd.max) * 100 + "%";
    this.hostInfo.ram.unit = (stats.hdd.diskSize as string).replace(/\d/g, "");

    stats.uptime = this.formatUptime(stats.uptime as number);

    if (!this.nodeStats) {
      this.nodeStats = {
        [id]: stats,
      };
    } else {
      this.nodeStats[id] = stats;
    }

    this.updateCpuChart();
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
