import { Injectable } from "@angular/core";
import { ElectronService } from "./electron.service";
import {
  IGeneralConfig,
  INodeConfig,
  INetworkBuilderConfigExport,
  INetworkBuilderConfigCreate,
  INetworkBuilderConfig,
  INetworkConfigTimeline,
  TimelineEvents,
} from "../interfaces/baas.interfaces";
import { DatabaseService } from "../../providers/database.service";
import { DBTypes } from "../enums/db.enum";
import { OpenDialogOptions } from "electron";

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
        await this.saveFile(payload, saveLocation.filePath);

        await this.addTimelineEvent(
          `Exported ${generalConfig.name}`,
          TimelineEvents.EXPORTED
        );
      }
    } catch (error) {
      console.error(`Export failed.\n${error}`);
      throw error;
    }
  }

  public async importConfig(): Promise<void> {
    const dialog = this.electronService.remote.dialog;

    const config: OpenDialogOptions = {
      filters: [
        {
          name: "JSON",
          extensions: ["json"],
        },
      ],
      properties: ["multiSelections"],
    };

    try {
      const openLocation = await dialog.showOpenDialog(config);

      if (openLocation.filePaths) {
        await this.importConfigFiles(openLocation.filePaths);
      }
    } catch (error) {
      console.error(`Import failed.\n${error}`);
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
      config.updated = new Date();

      await this.db.update(config);
      await this.addTimelineEvent(
        `Updated ${generalConfig.name}`,
        TimelineEvents.UPDATED
      );
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
      await this.addTimelineEvent(
        `Created ${generalConfig.name}`,
        TimelineEvents.CREATED
      );
    }
  }

  public async updateConfig(
    config: INetworkBuilderConfig,
    onboard: boolean = false
  ): Promise<void> {
    await this.db.update(config);

    if (!onboard) {
      await this.addTimelineEvent(
        `Updated ${config.config.name}`,
        TimelineEvents.UPDATED
      );
    } else {
      let data = `Onboared ${config.config.name}`;

      if (!config.onboarded) {
        data = `Offboarded ${config.config.name}`;
      }

      await this.addTimelineEvent(data, TimelineEvents.ONBOARDED);
    }
  }

  public async getConfigs(): Promise<INetworkBuilderConfig[]> {
    return await this.db.findByType(DBTypes.NETWORKCONFIG);
  }

  public async getConfig(id: string): Promise<INetworkBuilderConfig> {
    return await this.db.findById(id);
  }

  public async duplicateConfig(id: string): Promise<void> {
    const baseConfig: INetworkBuilderConfig = await this.getConfig(id);
    const configs: INetworkBuilderConfig[] = await this.getConfigs();

    let duplicate = 1;
    const regex = new RegExp(baseConfig.config.name + "\\s\\(\\d\\)", "g");
    for (const config of configs) {
      if (
        baseConfig.config.name === config.config.name ||
        regex.test(config.config.name)
      ) {
        duplicate++;
      }
    }

    baseConfig.config.name = baseConfig.config.name + ` (${duplicate})`;
    delete baseConfig._id;
    delete baseConfig._rev;
    baseConfig.created = new Date();
    baseConfig.updated = new Date();

    await this.db.add(baseConfig);
    await this.addTimelineEvent(
      `Created duplicate ${baseConfig.config.name}`,
      TimelineEvents.CREATED
    );
  }

  public async removeConfig(id: string): Promise<void> {
    const config = await this.getConfig(id);
    await this.db.remove(id);

    await this.addTimelineEvent(
      `Removed ${config.config.name}`,
      TimelineEvents.REMOVED
    );
  }

  private async addTimelineEvent(
    data: string,
    type: TimelineEvents
  ): Promise<void> {
    try {
      let timeline: INetworkConfigTimeline = await this.db.findById(
        "network-config-timeline"
      );
      let create = false;

      if (!timeline) {
        create = true;
        timeline = {
          _id: "network-config-timeline",
          type: DBTypes.NETWORKTIMELINE,
          created: [] as any,
          updated: [] as any,
          removed: [] as any,
          onboarded: [] as any,
          imported: [] as any,
          exported: [] as any,
          latestTen: [] as any,
        };
      }

      const payload = { data, date: new Date() };
      timeline[type].push(payload);
      timeline.latestTen.push(payload);

      if (timeline.latestTen.length > 10) {
        timeline.latestTen = timeline.latestTen.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        timeline.latestTen.pop();
      }

      if (create) {
        await this.db.add(timeline);
      } else {
        await this.db.update(timeline);
      }
    } catch (error) {
      console.error(`There was an error updating the timeline\n${error}`);
    }
  }

  public async getTimeline(
    amount: number = 7
  ): Promise<[{ data: string; date: Date }]> {
    const timeline: INetworkConfigTimeline = await this.db.findById(
      "network-config-timeline"
    );

    if (!timeline) {
      return [] as any;
    }

    // If amount requested is less than the default latest stored
    if (amount < 10) {
      const holder = timeline.latestTen.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      if (amount >= timeline.latestTen.length) {
        return holder;
      }

      return holder.slice(0, amount) as [{ data: string; date: Date }];

      // If the amount is exactly 10
    } else if (amount === 10) {
      return timeline.latestTen;

      // Otherwise join all arrays and return the amount requested
    } else {
      let allEvents = [
        ...timeline.created,
        ...timeline.updated,
        ...timeline.removed,
        ...timeline.onboarded,
        ...timeline.imported,
        ...timeline.exported,
      ];
      allEvents = allEvents.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      console.log("allEvents");
      console.log(allEvents);

      // If amount requested is greater than stored events or if it is 0 return all
      if (amount >= allEvents.length || amount === 0) {
        return allEvents as [{ data: string; date: Date }];
      }

      return allEvents.slice(0, amount) as [{ data: string; date: Date }];
    }
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

  private async importConfigFiles(paths: string[]): Promise<void> {
    for (const path of paths) {
      const splitChar = this.electronService.isWindows ? "\\" : "/";

      const configName =
        path.slice(path.lastIndexOf(splitChar) + 1, path.indexOf(".json")) +
        " (Import)";

      const data: INetworkBuilderConfigExport = JSON.parse(
        this.electronService.fs.readFileSync(path).toString()
      );

      const nodes: INodeConfig[] = [];

      for (const node of data.neighbourhood) {
        nodes.push({
          host: node.host,
          port: node.port,
          publicKey: node.identity.public,
        });
      }

      const config: INetworkBuilderConfigCreate = {
        type: DBTypes.NETWORKCONFIG,
        config: {
          name: configName,
          debug: data.debug,
          activeledger: {
            consensus: data.consensus.reached,
            autostart: data.autostart,
          },
          security: data.security,
          networking: {
            bindingAddress: data.host,
            selfHosted: data.db.url && data.db.url !== "" ? false : true,
            corePort: data.api.port.toString(),
          },
          database: {
            ledger: data.db.database,
            event: data.db.event,
            error: data.db.error,
          },
        },
        nodes: nodes,
        created: new Date(),
        updated: new Date(),
        onboarded: false,
      };

      if (data.db.url && data.db.url !== "") {
        config.config.networking.url = data.db.url;
      } else {
        config.config.networking.selfHostIP = data.db.selfhost.host;
        config.config.networking.selfHostPort = data.db.selfhost.port.toString();
      }

      try {
        await this.db.add(config);
        await this.addTimelineEvent(
          `Imported ${config.config.name}`,
          TimelineEvents.IMPORTED
        );
      } catch (error) {
        throw error;
      }
    }
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
}
