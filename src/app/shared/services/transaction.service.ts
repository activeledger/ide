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

import { Injectable } from "@angular/core";
import { DatabaseService } from "../../providers/database.service";
import {
  IHistoricalTransaction,
  ISavedTransaction
} from "../interfaces/transaction.interfaces";
import { DBTypes } from "../enums/db.enum";

@Injectable({
  providedIn: "root"
})
export class TransactionService {
  private logger = (window as any).logger;

  constructor(private dbService: DatabaseService) {}

  public getHistory(): Promise<IHistoricalTransaction[]> {
    return new Promise((resolve, reject) => {
      // Find all
      // Sort by timestamp
      this.dbService
        .findByType<IHistoricalTransaction>(DBTypes.TXHISTORY)
        .then((data: IHistoricalTransaction[]) => {
          data.sort((a, b) => {
            return b.timestamp - a.timestamp;
          });

          resolve(data);
        })
        .catch((err: unknown) => {
          reject(err);
        });
    });
  }

  public getSaved(): Promise<ISavedTransaction[]> {
    return this.dbService.findByType<ISavedTransaction>(DBTypes.TXSAVED);
  }

  public findById(id: string) {}

  public findByConnection(connection: string) {}

  public save(data: ISavedTransaction): Promise<ISavedTransaction> {
    data.type = DBTypes.TXSAVED;

    return this.dbService.add<ISavedTransaction>(data);
  }

  public addToHistory(
    data: IHistoricalTransaction
  ): Promise<IHistoricalTransaction> {
    data.type = DBTypes.TXHISTORY;

    return this.dbService.add<IHistoricalTransaction>(data);
  }

  public instanceOfIHistoricalTransaction(
    data: any
  ): data is IHistoricalTransaction {
    return "response" in data;
  }

  public clearHistory(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getHistory()
        .then((txs: IHistoricalTransaction[]) => {
          const promiseArray = Array<Promise<void>>();
          let i = txs.length;
          while (i--) {
            promiseArray.push(this.dbService.remove(txs[i]._id));
          }

          return Promise.all(promiseArray);
        })
        .then(() => {
          resolve();
        })
        .catch((err: unknown) => {
          reject(err);
        });
    });
  }
}
