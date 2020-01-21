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
import * as activeledgerSdk from "@activeledger/sdk";

import { DatabaseService } from "../../providers/database.service";

import { IKeyData } from "../interfaces/key.interfaces";
import { DBTypes } from "../enums/db.enum";
/**
 * Class to generate keys and find key data
 *
 * @export
 * @class KeyService
 */
@Injectable()
export class KeyService {
  /**
   * Creates an instance of KeyService.
   * @param {DatabaseService} dbService
   * @memberof KeyService
   */
  constructor(private dbService: DatabaseService) {}

  // #region Generator
  /**
   * Generate a new key
   *
   * @param {string} type Encryption type for key generation
   * @returns {Promise<any>}
   * @memberof KeyService
   */
  public generate(type: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const keyHandler = new activeledgerSdk.KeyHandler();
      const keyTypes = activeledgerSdk.KeyType;
      let keyType;

      switch (type) {
        case "secp256k1":
          keyType = keyTypes.EllipticCurve;
          break;
        case "rsa":
        default:
          keyType = keyTypes.RSA;
          break;
      }

      keyHandler
        .generateKey("", keyType)
        .then((key: activeledgerSdk.IKey) => {
          resolve(key.key);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  // #endregion

  // #region Getters
  /**
   * Get stored the array of keys
   *
   * @returns {Promise<Array<KeyData>>}
   * @memberof KeyService
   */
  public getKeys(): Promise<Array<IKeyData>> {
    return this.dbService.findByType(DBTypes.KEY);
  }

  /**
   * Find and return the key with the specified ID
   *
   * @param {string} keyId
   * @returns {Promise<KeyData>}
   * @memberof KeyService
   */
  public findById(keyId: string): Promise<IKeyData> {
    return this.dbService.findById(keyId);
  }

  // #endregion

  // #region Setters

  /**
   * Update a specific key
   *
   * @param {KeyData} key
   * @returns {Promise<void>}
   * @memberof KeyService
   */
  public updateKey(updatedKey: IKeyData): Promise<void> {
    return this.dbService.update(updatedKey);
  }

  /**
   * Save a new key
   *
   * @param {KeyData} key
   * @returns {Promise<KeyData>}
   * @memberof KeyService
   */
  public saveKey(key: IKeyData): Promise<IKeyData> {
    return new Promise<IKeyData>((resolve, reject) => {
      this.dbService
        .add(key)
        .then((storedKey: IKeyData) => {
          resolve(storedKey);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  // #endregion
}
