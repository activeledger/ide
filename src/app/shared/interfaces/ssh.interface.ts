type TSSHAuth = "password" | "sshKey";
export interface ISSHCreate {
  name: string;
  address: string;
  port: number;
  username: string;
  password: string;
  nodeLocation: string;
  authMethod: string;
  key?: string;
}

export interface ISSHCreateData {
  _id?: string;
  _rev?: string;
  type: "ssh";
  name: string;
  address: string;
  port: number;
  keyID?: string;
  nodeLocation: string;
  authMethod: TSSHAuth;
}

export interface ISSH {
  _id: string;
  name: string;
  address: string;
  port: number;
  keyID: string;
  nodeLocation: string;
  firstSeen?: Date;
  authMethod: TSSHAuth;
}

export interface ISSHKey {
  _id?: string;
  _rev?: string;
  type: "sshkey";
  identity: string;
  private?: string;
  public?: string;
  sshPub?: string;
  sshPrv: string;
}
