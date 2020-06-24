export interface ISSHCreate {
  name: string;
  address: string;
  port: number;
  username: string;
  password: string;
}

export interface ISSH {
  name: string;
  address: string;
  port: string;
  keyID: string;
}
