import { Injectable } from "@angular/core";
import { ISSHCreate, ISSH } from "../interfaces/ssh.interface";

@Injectable({
  providedIn: "root",
})
export class SshService {
  constructor() {}

  public addSshConnection(data: ISSHCreate): void {}

  public async getSshConnection(id: string): Promise<ISSH> {
    return;
  }

  public async getSshConnections(): Promise<ISSH[]> {
    return;
  }

  public async getSshKey(id: string): Promise<unknown> {
    return;
  }

  public async sshToNode(id: string): Promise<ISSH[]> {
    return;
  }
}
