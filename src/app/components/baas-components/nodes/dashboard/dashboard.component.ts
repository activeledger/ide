import { Component, OnInit } from "@angular/core";
import { DialogService } from "../../../../shared/services/dialog.service";
import { EChartOption } from "echarts";

@Component({
  selector: "dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
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

  public noNodes = false;

  public cpuChartOptions: EChartOption = {
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: ["15m", "10m", "5m", "0m"],
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
      },
    ],
    series: [
      {
        data: [90, 80, 40, 10, 40, 70, 60],
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

  constructor(private readonly dialogService: DialogService) {}

  ngOnInit(): void {}

  addConnection(): void {
    const ref = this.dialogService.addSSHConnection();
  }
}
