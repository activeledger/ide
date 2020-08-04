export interface INodeStats {
  cpu: ICPUStats;
  hdd: IHDDStats;
  ram: IRAMStats;
  restarts: IRestartStats;
  status: "dead" | "alive";
  uptime: number | string;
  version: string;
}

interface ICPUStats {
  currentPercent?: number;
  cores: number;
  one: number;
  five: number;
  fifteen: number;
}

interface IHDDStats {
  activeledger: number | string;
  diskSize: number | string;
  diskFree: number | string;
  diskUsed: number | string;
}

interface IRAMStats {
  total: number | string;
  free: number | string;
  used?: number | string;
}

interface IRestartStats {
  all: number;
  auto: number;
}
