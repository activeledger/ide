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

@Injectable({
  providedIn: "root",
})
export class SshService {
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

  public async sshToNode(id: string): Promise<ISSH[]> {
    return;
  }

  private async onboardSshKeyToNode(
    connectionData: ISSHCreateData,
    password: string,
    port: number
  ): Promise<void> {
    const ssh = new this.electron.NodeSSH();

    try {
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

      console.log("Attempting to connect via ssh");
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
    }
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
    const key = this.electron.sshpk.parseKey(keyPem, "pem");
    return key.toString("ssh");
  }
}
