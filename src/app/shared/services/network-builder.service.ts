import { Injectable } from "@angular/core";
import { ElectronService } from "./electron.service";
import {
  IGeneralConfig,
  INodeConfig,
  INetworkBuilderConfigExport,
  INetworkBuilderConfigCreate,
  INetworkBuilderConfig,
} from "../interfaces/baas.interfaces";
import { DatabaseService } from "../../providers/database.service";
import { DBTypes } from "../enums/db.enum";

@Injectable({
  providedIn: "root",
})
export class NetworkBuilderService {
  constructor(
    private readonly electronService: ElectronService,
    private readonly db: DatabaseService
  ) {}

  public async exportConfig(
    generalConfig: IGeneralConfig,
    nodeConfig: INodeConfig[]
  ): Promise<void> {
    const dialog = this.electronService.remote.dialog;

    const config = {
      filters: [
        {
          name: "JSON",
          extensions: ["json"],
        },
      ],
    };

    if (generalConfig.name) {
      config["defaultPath"] = name + ".json";
    }

    try {
      const saveLocation = await dialog.showSaveDialog(config);

      if (saveLocation.filePath) {
        const payload = this.generateExportConfig(generalConfig, nodeConfig);
        this.saveFile(payload, saveLocation.filePath);
      }
    } catch (error) {
      console.error(`Export failed.\n${error}`);
      throw error;
    }
  }

  public async saveConfig(
    generalConfig: IGeneralConfig,
    nodeConfig: INodeConfig[],
    id?: string
  ): Promise<void> {
    if (id) {
      const config: INetworkBuilderConfig = await this.getConfig(id);

      config.config = generalConfig;
      config.nodes = nodeConfig;

      await this.db.update(config);
    } else {
      const config: INetworkBuilderConfigCreate = {
        type: DBTypes.NETWORKCONFIG,
        config: generalConfig,
        nodes: nodeConfig,
        created: new Date(),
        updated: new Date(),
        onboarded: false,
      };
      await this.db.add(config);
    }
  }

  public async updateConfig(config: INetworkBuilderConfig): Promise<void> {
    await this.db.update(config);
  }

  public async getConfigs(): Promise<INetworkBuilderConfig[]> {
    return await this.db.findByType(DBTypes.NETWORKCONFIG);
  }

  public async getConfig(id: string): Promise<INetworkBuilderConfig> {
    return await this.db.findById(id);
  }

  private generateExportConfig(
    generalConfig: IGeneralConfig,
    nodeConfig: INodeConfig[]
  ): INetworkBuilderConfigExport {
    const config: INetworkBuilderConfigExport = {
      debug: generalConfig.debug,
      host: generalConfig.networking.bindingAddress,
      security: generalConfig.security,
      db: {
        url: "",
        database: generalConfig.database.ledger,
        event: generalConfig.database.event,
        error: generalConfig.database.error,
      },
      consensus: { reached: generalConfig.activeledger.consensus },
      autostart: generalConfig.activeledger.autostart,
      api: { port: parseInt(generalConfig.networking.corePort) },
      neighbourhood: [],
    };

    if (generalConfig.networking.selfHosted) {
      config.db.selfhost = {
        host: "127.0.0.1",
        port: parseInt(generalConfig.networking.selfHostPort),
      };
    } else {
      config.db.url = generalConfig.networking.url;
    }

    for (const node of nodeConfig) {
      config.neighbourhood.push({
        identity: {
          type: "rsa",
          public: node.publicKey,
        },
        host: node.host,
        port: node.port,
      });
    }

    return config;
  }

  private saveFile(data, exportLocation: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.electronService.fs.writeFile(
        exportLocation,
        JSON.stringify(data, null, 2),
        (err) => {
          if (err) {
            reject(err);
          }

          resolve();
        }
      );
    });
  }

  private async generateSaveConfig(): Promise<void> {}
}
