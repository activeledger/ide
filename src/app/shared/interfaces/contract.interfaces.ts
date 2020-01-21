/*
 * MIT License (MIT)
 * Copyright (c) 2018 Activeledger
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { IConnectionData } from "./connection.interfaces";
import { IIdentityData } from "./identity.interfaces";
import { DBTypes } from "../enums/db.enum";
export interface IContract {
  _id: string;
  _rev: string;
  name: string;
  created: Date;
  updated: Date;
  uploaded?: Date;
  versions: object;
  versionIO: object;
  onboardData: IContractOnboardDictionary;
  labels: IContractLabels;
  type: DBTypes;
}

export interface IContractOnboardDictionary {
  [identityName: string]: IContractOnboardStreams;
}

export interface IContractOnboardStreams {
  [streamName: string]: IContractOnboardVersions;
}

export interface IContractOnboardVersions {
  [version: string]: IContractOnboardVersion;
}

export interface IContractOnboardVersion {
  streamId: string;
  streamName: string;
  version: string;
  identity: string;
  namespace: string;
  connection: string;
  uploaded: Date;
  updated: Date;
}

export interface IContractLabels {
  [streamName: string]: string[];
}

export interface IRemoteData {
  identity: IIdentityData;
  namespace: string;
  connection: IConnectionData;
}

export interface ILedgerData {
  name: string;
  id: string;
}

export interface IPassedData {
  id: string;
  // version: string;
}

export interface ISaveData {
  version: string;
  overwrite: boolean;
  close: boolean;
  contract: IContract;
}

export interface IContractInfo {
  identity: string;
  identityName?: string;
  connection: string;
  connectionName?: string;
  namespace: string;
  namespaceName?: string;
  streamId: string;
  uploaded: Date;
  latestVersion: string;
  versionCount: number;
  labels: string[];
}
