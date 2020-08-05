import { DBTypes } from "../enums/db.enum";

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

export interface INetworkBuilderConfigExport {
  debug: boolean;
  host: string;
  security: ISecurityConfig;
  db: IDatabaseConfig;
  consensus: { reached: number };
  autostart: IAutostartConfig;
  api: IApiConfig;
  neighbourhood: INeighbourhoodConfig[];
}

export interface INetworkBuilderConfig {
  _id: string;
  _rev: string;
  type: DBTypes.NETWORKCONFIG;
  config: IGeneralConfig;
  nodes: INodeConfig[];
  created: Date;
  updated: Date;
  onboarded: boolean;
}

export interface INetworkConfigTimeline {
  _id: "network-config-timeline";
  _rev?: string;
  type: DBTypes.NETWORKTIMELINE;
  created: [{ data: string; date: Date }];
  updated: [{ data: string; date: Date }];
  removed: [{ data: string; date: Date }];
  onboarded: [{ data: string; date: Date }];
  imported: [{ data: string; date: Date }];
  exported: [{ data: string; date: Date }];
  latestTen: [{ data: string; date: Date }];
}

export enum TimelineEvents {
  CREATED = "created",
  UPDATED = "updated",
  REMOVED = "removed",
  ONBOARDED = "onboarded",
  IMPORTED = "imported",
  EXPORTED = "exported",
}

export interface INetworkBuilderConfigCreate {
  type: DBTypes.NETWORKCONFIG;
  config: IGeneralConfig;
  nodes: INodeConfig[];
  created: Date;
  updated: Date;
  onboarded: boolean;
}

export interface IGeneralConfig {
  name: string;
  debug: boolean;
  activeledger: IActiveledgerConfig;
  security: ISecurityConfig;
  networking: INetworkingConfig;
  database: IDatabasegGeneralConfig;
}

export interface INodeConfig {
  host: string;
  port: string;
  publicKey: string;
}

interface IDatabasegGeneralConfig {
  ledger: string;
  event: string;
  error: string;
}

interface IActiveledgerConfig {
  consensus: number;
  autostart: { core: boolean; restore: boolean };
}

interface INetworkingConfig {
  bindingAddress: string;
  selfHosted: boolean;
  selfHostIP?: string;
  selfHostPort?: string;
  url?: string;
  corePort: string;
}

interface ISecurityConfig {
  signedConsensus: boolean;
  encryptedConsensus: boolean;
  hardenedKeys: boolean;
}

interface IDatabaseConfig {
  selfhost?: { host: string; port: number };
  url?: string;
  database: string;
  event: string;
  error: string;
}

interface IAutostartConfig {
  core: boolean;
  restore: boolean;
}

interface IApiConfig {
  port: number;
}

interface INeighbourhoodConfig {
  identity: { type: string; public: string };
  host: string;
  port: string;
}
