import { Injectable } from "@angular/core";
import {
  ISSHCreate,
  ISSH,
  ISSHKey,
  ISSHCreateData,
  ISSHLogin,
  ISSHTags,
  ISSHTagsCreate,
} from "../interfaces/ssh.interface";
import { KeyService } from "./key.service";
import { ElectronService } from "./electron.service";
import { DatabaseService } from "../../providers/database.service";
import { DBTypes } from "../enums/db.enum";
import { DialogService } from "./dialog.service";

@Injectable({
  providedIn: "root",
})
export class SshService {
  public static connectionPool: Map<
    string,
    { connection: any; stream: any; location: string }
  > = new Map();

  public tempPrivate: string;

  constructor(
    private readonly keyService: KeyService,
    private readonly electron: ElectronService,
    private readonly dbService: DatabaseService,
    private readonly dialogService: DialogService
  ) {}

  public hasOpenConnection(id: string): boolean {
    return SshService.connectionPool.has(id);
  }

  private getLatestVersion(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = SshService.connectionPool.get(id).stream;

      stream
        .on("data", (data) => {
          const regexVersion = new RegExp("\\d+\\.\\d+\\.\\d+");
          const regexChars = new RegExp("[A-z]+");

          if (!regexChars.test(data) && regexVersion.test(data)) {
            resolve(data);
          }
        })
        .stderr.on("data", (data) => {
          reject(data);
        });

      stream.write("npm show @activeledger/activeledger version\r");
    });
  }

  public async install(id: string, autostart: boolean = false): Promise<void> {
    try {
      const stream = SshService.connectionPool.get(id).stream;
      const sshData = await this.getConnection(id);

      stream.stderr.on("data", (data) => {
        console.log("STDERR: " + data);
        throw new Error("An error occured during installation.");
      });

      await this.execCommand(
        id,
        `npm i -g @activeledger/activeledger @activeledger/activerestore @activeledger/activecore && cd ${sshData.nodeLocation} && activeledger\r`
      );

      if (autostart) {
      }

      const node = await this.getConnection(id);
      node.installed = true;
      node.autostartEnabled = autostart;
    } catch (error) {
      throw error;
    }
  }

  public async update(id: string): Promise<void> {
    try {
      const stream = SshService.connectionPool.get(id).stream;
      const sshData = await this.getConnection(id);

      stream.stderr.on("data", (data) => {
        console.log("STDERR: " + data);
        throw new Error("An error occured during update.");
      });

      await this.execCommand(
        id,
        `npm i -g @activeledger/activeledger @activeledger/activerestore @activeledger/activecore && cd ${sshData.nodeLocation} && activeledger --restart --auto\r`
      );
    } catch (error) {
      throw error;
    }
  }

  public async autostart(id: string): Promise<void> {}

  public async rollback(id: string, version: string): Promise<void> {
    try {
      const stream = SshService.connectionPool.get(id).stream;
      const sshData = await this.getConnection(id);

      stream.stderr.on("data", (data) => {
        console.log("STDERR: " + data);
        throw new Error("An error occured during rollback.");
      });

      await this.execCommand(
        id,
        `npm i -g @activeledger/activeledger@${version} @activeledger/activerestore@${version} @activeledger/activecore@${version} && cd ${sshData.nodeLocation} && activeledger --restart --auto\r`
      );
    } catch (error) {
      throw error;
    }
  }

  public async joinNetwork(id: string): Promise<void> {}

  public async saveConnection(data: ISSHCreate): Promise<void> {
    try {
      let sshKeyId, authMethod;

      switch (data.authMethod) {
        case "generate":
          sshKeyId = await this.generateKey(data.username);
          authMethod = "key";
          break;
        case "onboard":
          sshKeyId = await this.onboardKey(data.username, data.key);
          authMethod = "key";
          break;
        case "password":
          authMethod = "password";
          break;
      }

      const connection: ISSHCreateData = {
        tags: data.tags,
        type: "ssh",
        name: data.name,
        address: data.address,
        port: data.port,
        nodeLocation: data.nodeLocation,
        authMethod,
        installed: false,
        joined: false,
        autostartEnabled: false,
        newVersionAvailable: false,
      };

      if (sshKeyId) {
        connection["keyID"] = sshKeyId;
      }

      await this.dbService.add(connection);

      // Onboard key if generated
      if (data.authMethod === "generate") {
        await this.onboardSshKeyToNode(connection, data.password, data.port);
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async getConnection(id: string): Promise<ISSH> {
    return await this.dbService.findById(id);
  }

  public async getConnections(): Promise<ISSH[]> {
    return await this.dbService.findByType<ISSH>(DBTypes.SSH);
  }

  public async addTags(newTags: string[]): Promise<void> {
    try {
      const tags: ISSHTags = await this.dbService.findById<ISSHTags>(
        DBTypes.SSHTAGS
      );

      if (!tags) {
        const tags: ISSHTagsCreate = {
          _id: DBTypes.SSHTAGS,
          tags: newTags,
          type: DBTypes.SSHTAGS,
        };

        await this.dbService.add(tags);
      } else {
        tags.tags = [...tags.tags, ...newTags];
        await this.dbService.update(tags);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteTags(deleteTags: string[]): Promise<void> {
    try {
      const promisePool = [];

      // Get stored tags list
      const tags: ISSHTags = await this.dbService.findById<ISSHTags>(
        DBTypes.SSHTAGS
      );

      // Remove deleted tags
      for (const tag of deleteTags) {
        tags.tags.splice(tags.tags.indexOf(tag), 1);
      }
      await this.dbService.update(tags);

      // Remove deleted tags from connections
      const connections = await this.getConnections();
      for (const connection of connections) {
        if (connection.tags && connection.tags.length > 0) {
          for (const tag of connection.tags) {
            if (deleteTags.includes(tag)) {
              connection.tags.splice(connection.tags.indexOf(tag));
            }
          }
        }

        promisePool.push(this.dbService.update(connection));
      }

      // Process database updates
      await Promise.all(promisePool);
    } catch (error) {
      console.error(error);
    }
  }

  public async getTags(): Promise<string[]> {
    const tags: ISSHTags = await this.dbService.findById<ISSHTags>(
      DBTypes.SSHTAGS
    );

    return tags ? tags.tags : [];
  }

  public async filterByTag(tag: string): Promise<ISSH[]> {
    const connections = await this.getConnections();
    const filteredConnections: ISSH[] = [];

    for (const conn of connections) {
      if (conn.tags && conn.tags.length > 0 && conn.tags.includes(tag)) {
        filteredConnections.push(conn);
      }
    }

    return filteredConnections;
  }

  public async addTagsToConnection(id: string, tags: string[]): Promise<void> {
    const connection = await this.getConnection(id);

    if (connection.tags) {
      connection.tags = [...connection.tags, ...tags];
    } else {
      connection.tags = tags;
    }

    await this.dbService.update(connection);
  }

  public async removeTagsFromConnection(
    id: string,
    tags: string[]
  ): Promise<void> {
    const connection = await this.getConnection(id);

    for (const tag of tags) {
      connection.tags.splice(connection.tags.indexOf(tag), 1);
    }

    await this.dbService.update(connection);
  }

  public async editConnection(id: string): Promise<void> {
    const sshData: ISSH = await this.dbService.findById(id);
    const editedData: ISSH = await this.dialogService.editSshConnection(
      sshData
    );
    if (editedData) {
      await this.dbService.update(editedData);
    }
  }

  public async removeConnection(id: string): Promise<void> {
    try {
      const connection: ISSH = await this.dbService.findById(id);
      let removeKey;
      if (connection.authMethod !== "password") {
        removeKey = this.dbService.remove(connection.keyID);
      }

      const removeConnection = this.dbService.remove(id);

      if (removeKey) {
        await removeKey;
      }

      await removeConnection;
    } catch (error) {
      throw error;
    }
  }

  public async createSshConfig(id: string): Promise<any> {
    const sshData = await this.getConnection(id);

    let config = {
      host: sshData.address,
      port: sshData.port,
      readyTimeout: 5000,
    };

    if (sshData.authMethod === "password") {
      const login: ISSHLogin = await this.dialogService.sshLogin();

      if (login.cancelled || !login.username || !login.password) {
        console.log("Not connecting");
        return false;
      }

      config["username"] = login.username;
      config["password"] = login.password;
    } else {
      const key: ISSHKey = await this.dbService.findById(sshData.keyID);

      config["username"] = key.identity;
      config["privateKey"] = key.sshPrv;
    }

    return config;
  }

  public async sshToNode(id: string): Promise<boolean> {
    try {
      console.log("Initialising SSH Connection...");
      let connection, stream;

      // Check if there is an open connection/stream for this node
      if (!SshService.connectionPool.has(id)) {
        const sshConnectionData: ISSH = await this.dbService.findById(id);

        const config = await this.createSshConfig(id);

        connection = new this.electron.ssh();

        await this.openConnection(connection, config);
        stream = await this.onReady(connection);

        if (!sshConnectionData.firstSeen) {
          sshConnectionData.firstSeen = new Date();

          await this.dbService.update(sshConnectionData);
        }

        // TODO: Add last used
        SshService.connectionPool.set(id, {
          connection,
          stream,
          location: sshConnectionData.nodeLocation,
        });

        const pool = SshService.connectionPool;
        const poolSize = pool.size;
        if (poolSize > 5) {
          // Remove oldest key
          SshService.connectionPool.delete(pool.keys().next().value);
        }

        console.log("Connection made");
        return true;
      } else {
        return true;
      }
    } catch (error) {
      throw error;
    }
  }

  public getStats(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const stream = SshService.connectionPool.get(id).stream;
      const location = SshService.connectionPool.get(id).location;

      stream
        .on("data", (data: Buffer) => {
          if (data.includes('"cpu": {')) {
            const stripped =
              "{" +
              data
                .toString()
                .slice(data.indexOf('"cpu":'), data.lastIndexOf("}") + 1);

            const obj = JSON.parse(stripped);
            resolve(obj);
          }
        })
        .stderr.on("data", (data) => {
          reject(data);
        });

      await this.execCommand(id, `cd ${location} && activeledger --stats\r\n`);
    });
  }

  public async restart(id: string): Promise<any> {
    const location = SshService.connectionPool.get(id).location;
    await this.execCommand(id, `cd ${location} && activeledger --restart\r\n`);
  }

  public async start(id: string): Promise<any> {
    const location = SshService.connectionPool.get(id).location;
    await this.execCommand(id, `cd ${location} && activeledger\r\n`);
  }

  public async stop(id: string): Promise<any> {
    const location = SshService.connectionPool.get(id).location;
    await this.execCommand(id, `cd ${location} && activeledger --stop\r\n`);
  }

  public closeConnection(id: string) {
    const stream = SshService.connectionPool.get(id).stream;
    const connection = SshService.connectionPool.get(id).connection;

    // Listen for stream close and end connection
    stream.on("close", (code, signal) => {
      console.log("Stream :: close :: code: " + code + ", signal: " + signal);
      connection.end();
    });

    // Exit the shell
    stream.write("exit\r\n");

    // Remove from pool
    SshService.connectionPool.delete(id);
  }

  private openConnection(connection, config): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        connection.connect(config);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  private onReady(connection): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        connection.on("ready", () => {
          connection.shell((err, stream) => {
            if (err) {
              return reject(err);
            }
            resolve(stream);
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  private execCommand<T>(id: string, command: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const stream = SshService.connectionPool.get(id).stream;
      stream.write(command);
      resolve();
    });
  }

  private async onboardSshKeyToNode(
    connectionData: ISSHCreateData,
    password: string,
    port: number
  ): Promise<void> {
    const ssh = new this.electron.ssh();

    // try {
    const key: ISSHKey = await this.dbService.findById(connectionData.keyID);

    const config = {
      host: connectionData.address,
      username: key.identity,
      password,
      port,
      debug: console.log,
      readyTimeout: 5000,
      tryKeyboard: true,
      onKeyboardInteractive: (
        name,
        instructions,
        instructionsLang,
        prompts,
        finish
      ) => {
        if (
          prompts.length > 0 &&
          prompts[0].prompt.toLowerCase().includes("password")
        ) {
          finish([password]);
        }
      },
    };

    console.log("Initialising SSH Connection...");
    ssh
      .on("ready", () => {
        console.log("SSH Client :: Ready");
        console.log("SSH Client :: Attempting to onboard key");
        const onboardCmd = `if [ ! -d ~/.ssh ]; then mkdir ~/.ssh; echo "${key.sshPub}" >> ~/.ssh/authorized_keys; else echo "${key.sshPub}" >> ~/.ssh/authorized_keys; fi`;
        console.log("SSH Client :: Running the following command.");
        console.log(onboardCmd);
        ssh.exec(onboardCmd, (err, stream) => {
          if (err) {
            console.error("SSH Client :: Error onboarding key");
            console.error(err);
          }

          stream
            .on("close", (code, signal) => {
              console.log(
                "Stream :: close :: code: " + code + ", signal: " + signal
              );
              ssh.end();
            })
            .on("data", (data) => {
              console.log("STDOUT: " + data);
            })
            .stderr.on("data", (data) => {
              console.log("STDERR: " + data);
            });
        });
      })
      .connect(config);
  }

  private async generateKey(identity: string): Promise<string> {
    try {
      const rsakey: { pub: any; prv: any } = await this.keyService.generate(
        "rsa"
      );
      const key: ISSHKey = {
        type: "sshkey",
        public: rsakey.pub.pkcs8pem,
        private: rsakey.prv.pkcs8pem,
        sshPub: this.convertRSAtoSSH(rsakey.pub.pkcs8pem), //.replace("(unnamed)", identity),
        sshPrv: this.convertRSAtoSSH(rsakey.prv.pkcs8pem, true), //.replace("(unnamed)", identity),
        identity,
      };

      const sshKeyResp = await this.dbService.add(key);
      return sshKeyResp._id;
    } catch (error) {
      console.error(error);
    }
  }

  private async onboardKey(
    identity: string,
    onboardKey: string
  ): Promise<string> {
    try {
      const key: ISSHKey = {
        type: "sshkey",
        sshPrv: onboardKey,
        identity,
      };

      const sshKeyResp = await this.dbService.add(key);
      return sshKeyResp._id;
    } catch (error) {
      console.error(error);
    }
  }

  private convertRSAtoSSH(keyPem: string, privateKey?: boolean): string {
    let key;
    if (privateKey) {
      key = this.electron.sshpk
        .parsePrivateKey(keyPem, "auto")
        .toString("openssh");
    } else {
      key = this.electron.sshpk.parseKey(keyPem, "auto").toString("ssh");
    }
    return key;
  }
}
