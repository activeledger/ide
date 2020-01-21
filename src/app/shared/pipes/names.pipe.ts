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

import { Pipe, PipeTransform } from "@angular/core";
import { LedgerService } from "../services/ledger.service";
import { IdentityService } from "../services/identity.service";
import { IIdentityData } from "../interfaces/identity.interfaces";
import { IConnectionData } from "../interfaces/connection.interfaces";

@Pipe({ name: "identityConnectionName" })
export class IdentityConnectionNamePipe implements PipeTransform {
  constructor(
    private identityService: IdentityService,
    private ledger: LedgerService
  ) {}

  transform(id: string) {
    return this.identityService
      .findById(id)
      .then((identity: IIdentityData) => {
        return this.ledger.findById(identity.connection);
      })
      .then((connection: IConnectionData) => {
        return connection.name;
      })
      .catch((err: unknown) => {
        if (!id) {
          return "No connection";
        } else {
          console.error(err);
          return "Error";
        }
      });
  }
}

@Pipe({ name: "identityName" })
export class IdentityNamePipe implements PipeTransform {
  constructor(private identityService: IdentityService) {}

  transform(id: string) {
    return this.identityService
      .findById(id)
      .then((identity: IIdentityData) => {
        return identity.name;
      })
      .catch((err: any) => {
        if (!id) {
          return "No Identity";
        } else {
          console.error(err);
        }
      });
  }
}
