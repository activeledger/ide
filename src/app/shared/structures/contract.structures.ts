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

import {
  IContractLabels,
  IContractOnboardStreams,
  IContractOnboardVersions
} from "../interfaces/contract.interfaces";
import {
  IContract,
  IContractOnboardDictionary,
  IContractOnboardVersion
} from "../interfaces/contract.interfaces";
import { DBTypes } from "../enums/db.enum";

export class ContractOnboardDictionary {
  [identityName: string]: ContractOnboardStreams;
}

export class ContractLabels implements IContractLabels {
  [streamName: string]: string[];
}

export class ContractData implements IContract {
  _id: string;
  _rev: string;
  name: string;
  created: Date = new Date();
  updated: Date = new Date();
  uploaded?: Date;
  versions: object = {};
  versionIO: object = {};
  onboardData: IContractOnboardDictionary = new ContractOnboardDictionary();
  labels: IContractLabels = new ContractLabels();
  type = DBTypes.CONTRACT;
}

export class ContractOnboardStreams implements IContractOnboardStreams {
  [streamName: string]: ContractOnboardVersions;
}

export class ContractOnboardVersions implements IContractOnboardVersions {
  [version: string]: ContractOnboardVersion;
}

export class ContractOnboardVersion implements IContractOnboardVersion {
  streamId = "";
  streamName = "";
  version = "";
  identity = "";
  namespace = "";
  connection = "";
  uploaded: Date = new Date();
  updated: Date = new Date();
}
