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
  public static connectionPool: Map<
    string,
    { connection: any; stream: any; location: string }
  > = new Map();

  public tempPrivate: string;

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
        nodeLocation: data.nodeLocation,
      };

      await this.dbService.add(connection);
      await this.onboardSshKeyToNode(connection, data.password, data.port);
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
    try {
      console.log("Initialising SSH Connection...");
      let connection, stream;

      // Check if there is an open connection/stream for this node
      if (!SshService.connectionPool.has(id)) {
        const sshConnectionData: ISSH = await this.dbService.findById(id);
        const key: ISSHKey = await this.dbService.findById(
          sshConnectionData.keyID
        );
        const config = {
          host: sshConnectionData.address,
          username: key.identity,
          privateKey: key.sshPrv,
          port: sshConnectionData.port,
          readyTimeout: 99999,
        };

        connection = new this.electron.ssh();

        await this.openConnection(connection, config);
        stream = await this.onReady(connection);

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
            console.log(obj);
            console.log(obj.cpu);
            resolve(obj);
          }
        })
        .stderr.on("data", (data) => {
          reject(data);
        });

      console.log("Getting stats");
      await this.execCommand(id, `cd ${location} && activeledger --stats\r\n`);
    });
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

  private execCommand<T>(id: string, command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = SshService.connectionPool.get(id).stream;
      stream.write(command);
      resolve();
    });
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
