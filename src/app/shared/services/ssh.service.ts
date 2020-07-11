import { Injectable } from "@angular/core";
import {
  ISSHCreate,
  ISSH,
  ISSHKey,
  ISSHCreateData,
} from "../interfaces/ssh.interface";
import { KeyService } from "./key.service";
import { ElectronService } from "./electron.service";
import { DatabaseService } from "../../providers/database.service";
import { DBTypes } from "../enums/db.enum";
import * as util from "util";
import { threadId } from "worker_threads";

@Injectable({
  providedIn: "root",
})
export class SshService {
  public static connectionPool = {};

  constructor(
    private readonly keyService: KeyService,
    private readonly electron: ElectronService,
    private readonly dbService: DatabaseService
  ) {}

  public async saveConnection(data: ISSHCreate): Promise<void> {
    try {
      const sshKeyId = await this.generateKey(data.username);
      const connection: ISSHCreateData = {
        type: "ssh",
        name: data.name,
        address: data.address,
        port: data.port,
        keyID: sshKeyId,
      };

      await this.dbService.add(connection);
      await this.onboardSshKeyToNode(connection, data.password, data.port);
    } catch (error) {
      console.error(error);
    }
  }

  public async getConnection(id: string): Promise<ISSH> {
    return;
  }

  public async getConnections(): Promise<ISSH[]> {
    return this.dbService.findByType<ISSH>(DBTypes.SSH);
  }

  public async getKey(id: string): Promise<unknown> {
    return;
  }

  public async removeConnection(id: string): Promise<void> {
    try {
      const connection: ISSH = await this.dbService.findById(id);
      const removeKey = this.dbService.remove(connection.keyID);
      const removeConnection = this.dbService.remove(id);
      await removeKey;
      await removeConnection;
    } catch (error) {
      throw error;
    }
  }

  public async sshToNode(id: string): Promise<void> {
    const sshConnectionData: ISSH = await this.dbService.findById(id);
    const sshKey: ISSHKey = await this.dbService.findById(
      sshConnectionData.keyID
    );

    const config = {
      host: sshConnectionData.address,
      port: sshConnectionData.port,
      username: sshKey.identity,
      privateKey: this.electron.sshpk.parseKey(sshKey.private, "pkcs8"),
      debug: console.log,
      readyTimeout: 99999,
    };
    // .replace("(unnamed)", sshKey.identity),

    const connection = new this.electron.ssh.Client();
    const command = "cd ~/testnet/instance-0 && activeledger --stats";
    connection
      .on("ready", () => {
        console.log("Client :: ready");
        connection.exec(command, function (err, stream) {
          if (err) {
            console.log("SSH Error");
            console.error(err);
          }
          stream
            .on("close", function (code, signal) {
              console.log(
                "Stream :: close :: code: " + code + ", signal: " + signal
              );
              connection.end();
            })
            .on("data", function (data) {
              console.log("STDOUT: " + data);
            })
            .stderr.on("data", function (data) {
              console.log("STDERR: " + data);
            });
        });
      })
      .connect(config);

    /* const onReady = this.onReady(connection);
    await this.openConnection(connection, config);
    await onReady; */

    SshService.connectionPool[id] = connection;
  }

  public async getStats(id: string): Promise<any> {
    const connection = SshService.connectionPool[id];

    // TODO: User set dir when creating connection
    const command = "cd ~/testnet/instance-0 && activeledger --stats";
    try {
      return await this.execCommand(command, connection);
    } catch (error) {
      throw error;
    }
  }

  private execCommand(command: string, connection): Promise<unknown> {
    return new Promise((resolve, reject) => {
      connection.exec(command, (err, stream) => {
        if (err) {
          return reject(err);
        } else {
          stream
            .on("data", (data) => {
              resolve(data);
            })
            .stderr.on("data", (errData) => {
              reject(errData);
            });
        }
      });
    });
  }

  private onReady(connection): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        connection.on("ready", () => {
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  private openConnection(connection, config): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        console.log("Config");
        console.log(config);
        connection.connect(config);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  public closeConnection(id: string) {}

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
      readyTimeout: 99999,
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

    /* console.log("Attempting to connect via ssh");
      console.log(config);
      await ssh.connect(config);

      console.log("Attempting to onboard key");
      const onboardCmd = `if [ ! -d ~/.ssh ]; then mkdir ~/.ssh; ${key.sshPub} >> ~/.ssh/authorized_keys; else ${key.sshPub} >> ~/.ssh/authorized_keys; fi`;
      const onboardResp = await ssh.execCommand(onboardCmd);
      console.log("onboardResp");
      console.log(onboardResp);
    } catch (error) {
      console.error("Error onboarding ssh key");
      console.error(error);
    } */
  }

  private async generateKey(identity: string): Promise<string> {
    try {
      const rsakey: { pub: any; prv: any } = await this.keyService.generate(
        "rsa"
      );
      const sshKey = this.convertRSAtoSSH(rsakey.pub.pkcs8pem);

      const key: ISSHKey = {
        type: "sshkey",
        public: rsakey.pub.pkcs8pem,
        private: rsakey.prv.pkcs8pem,
        sshPub: sshKey.replace("(unnamed)", identity),
        identity,
      };

      const sshKeyResp = await this.dbService.add(key);
      return sshKeyResp._id;
    } catch (error) {
      console.error(error);
    }
  }

  private convertRSAtoSSH(keyPem: string): string {
    const key = this.electron.sshpk.parseKey(keyPem, "pkcs8");
    return key.toString("ssh");
  }
}
