type TSSHAuth = "password" | "sshKey";
export interface ISSHCreate {
  name: string;
  tags: string[];
  address: string;
  port: number;
  username?: string;
  password: string;
  nodeLocation: string;
  authMethod: string;
  key?: string;
}

export interface ISSHCreateData {
  _id?: string;
  _rev?: string;
  tags: string[];
  type: "ssh";
  name: string;
  address: string;
  port: number;
  keyID?: string;
  nodeLocation: string;
  authMethod: TSSHAuth;
  installed: boolean;
  joined: boolean;
}

export interface ISSH {
  _id: string;
  tags: string[];
  name: string;
  address: string;
  port: number;
  keyID?: string;
  nodeLocation: string;
  firstSeen?: Date;
  authMethod: TSSHAuth;
  installed: boolean;
  currentVersion?: string;
  versionHistory: IVersionHistory[];
  joined: boolean;
}

interface IVersionHistory {
  date: Date;
  version: string;
}

export interface ISSHEdit extends ISSH {
  newKey: string;
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

export interface ISSHLogin {
  username: string;
  password: string;
  cancelled: boolean;
}

export interface ISSHTags {
  _id: string;
  _rev?: string;
  type: "sshtags";
  tags: string[];
}

export interface ISSHTagsCreate {
  _id: string;
  type: "sshtags";
  tags: string[];
}

export interface ISSHTagsManage {
  removeTags: string[];
  addTags: string[];
}
