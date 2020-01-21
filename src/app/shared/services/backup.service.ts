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
import { ElectronService } from "./electron.service";
import { GeneralService } from "./general.service";
import * as crypto from "crypto";
import { DialogService } from "./dialog.service";
import { DBTypes } from "../enums/db.enum";

@Injectable({
  providedIn: "root"
})
export class BackupService {
  // #region Internal Data
  /**
   * The location the backup will be exported to
   *
   * @private
   * @type {string}
   * @memberof BackupService
   */
  private exportLocation: string;

  /**
   * The location that a backup will be imported from
   *
   * @private
   * @type {string}
   * @memberof BackupService
   */
  private importLocation: string;
  // #endregion

  /**
   * Creates an instance of BackupService.
   * @param {DatabaseService} dbService
   * @param {ElectronService} electron
   * @param {GeneralService} generalService
   * @param {DialogService} dialogService
   * @memberof BackupService
   */
  constructor(
    private dbService: DatabaseService,
    private electron: ElectronService,
    private generalService: GeneralService,
    private dialogService: DialogService
  ) {}

  // #region Import

  // #region Import Public
  /**
   * Import a backup file
   * If the file is encrypted an error "encrypted" will be returned
   *
   * @param {string} file
   * @param {string} [password]
   * @returns {Promise<void>}
   * @memberof BackupService
   */
  public import(file: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.importLocation = file;
      this.readFile()
        .then(data => {
          // Check if data encrypted
          if (data.indexOf("enc:") === 0) {
            // Return so we can ask for password
            return reject("encrypted");
          }

          return this.checkHash(data);
        })
        .then(strippedData => {
          const isb64 = this.generalService.isb64(strippedData);

          if (isb64) {
            strippedData = atob(strippedData);
          }

          strippedData = JSON.parse(`[${strippedData}]`);

          return this.postImportProcess(strippedData);
        })
        .then(processedData => {
          return this.dbService.bulkAdd(processedData);
        })
        .then(() => {
          resolve();
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /**
   * Import an encrypted file
   *
   * @param {string} file
   * @param {*} password
   * @returns {Promise<void>}
   * @memberof BackupService
   */
  public importSecure(file: string, password): Promise<void> {
    return new Promise((resolve, reject) => {
      this.importLocation = file;
      this.readFile()
        .then(data => {
          // Strip enc: from the front
          data = data.toString().replace("enc:", "");
          // Decrypt the data
          return this.decrypt(data, password);
        })
        .then(decryptedData => {
          // Check the hash matches the original
          return this.checkHash(decryptedData, true);
        })
        .then(decryptedData => {
          // Convert the data to JSON
          return this.convertToJson(decryptedData);
        })
        .then(convertedData => {
          // Add the data to the database
          return this.dbService.bulkAdd(convertedData);
        })
        .then(() => {
          resolve();
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /**
   * Import a snapshot, this will overwrite any existing data rather than merge with new data as restoring does
   *
   * @param {string} file
   * @param {string} [password]
   * @returns {Promise<any>}
   * @memberof BackupService
   */
  public importSnapshot(file: string, password?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dialogService
        .confirm("Importing this as a snapshot will clear all exisiting data!")
        .then((carryOn: boolean) => {
          if (carryOn) {
            return this.dbService.clearDb();
          } else {
            return resolve({ cancelled: true });
          }
        })
        .then(() => {
          return this.dbService.initialise();
        })
        .then(() => {
          if (password) {
            return this.importSecure(file, password);
          } else {
            return this.import(file);
          }
        })
        .then(() => {
          resolve();
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  // #endregion

  // #region Import private

  /**
   * Process the data after import
   *
   * @private
   * @param {Array<any>} data
   * @returns {Array<any>}
   * @memberof BackupService
   */
  private postImportProcess(data: Array<any>): Array<any> {
    let i = data.length;
    while (i--) {
      if (data[i].doc) {
        data[i] = data[i].doc;
      }

      delete data[i]._rev;
    }

    return data;
  }

  /**
   * Read the file from the specified location
   *
   * @private
   * @returns {Promise<any>}
   * @memberof BackupService
   */
  private readFile(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.electron.fs.readFile(this.importLocation, "utf-8", (err, data) => {
        if (err) {
          return reject(err);
        }

        data = JSON.parse(data);

        resolve(data);
      });
    });
  }
  // #endregion

  // #endregion

  // #region Export

  // #region Export public
  /**
   * Export all or selected data
   *
   * @param {string} file
   * @param {boolean} encrypt
   * @param {string} password
   * @param {boolean} encode
   * @param {Array<string>} [selected]
   * @returns {Promise<void>}
   * @memberof BackupService
   */
  public export(
    file: string,
    encrypt: boolean,
    password: string,
    selected?: Array<string>
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((encrypt && !password) || (encrypt && password.length < 8)) {
        return reject("Password must be at least 8 characters.");
      }

      this.exportLocation = file;
      this.generateFile(selected)
        .then(data => {
          // Process the data for storage
          return this.postProcess(data, encrypt, password);
        })
        .then(postProcessResp => {
          // Save the file
          return this.saveFile(postProcessResp);
        })
        .then(() => {
          resolve();
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  // #endregion

  // #region Export private
  /**
   * Post process the data for exporting
   * Encrypt it, encode it or do nothing to it (This allows for future processing if needed)
   *
   * @private
   * @param {*} data
   * @param {boolean} encrypt
   * @param {string} password
   * @param {boolean} encode
   * @returns {Promise<any>}
   * @memberof BackupService
   */
  private postProcess(
    data: any,
    encrypt: boolean,
    password: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      // Check if it is base64, if not convert it
      // Convert all json to string
      const isb64 = this.generalService.isb64(data);
      if (!isb64) {
        const stringHolder = [];

        let i = data.length;
        while (i--) {
          stringHolder.push(JSON.stringify(data[i]));
        }

        data = btoa(stringHolder.toString());
      }

      if (encrypt) {
        this.encrypt(data, password)
          .then(encryptedData => {
            resolve(encryptedData);
          })
          .catch((err: any) => {
            reject(err);
          });
      } else {
        resolve(this.hashData(data));
      }
    });
  }

  /**
   * Get the data from the database for export
   *
   * @private
   * @param {Array<string>} [selected]
   * @returns {Promise<any>}
   * @memberof BackupService
   */
  private generateFile(selected?: Array<string>): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (selected) {
        let dataHolder = new Array<any>();
        let i = selected.length;
        while (i--) {
          const data = await this.getSelectedData(selected[i]);
          dataHolder = dataHolder.concat(data);
        }
        resolve(dataHolder);
      } else {
        this.dbService
          .findAll()
          .then((docs: any) => {
            resolve(docs.rows);
          })
          .catch((err: any) => {
            reject(err);
          });
      }
    });
  }

  /**
   * Get select data from the database for export
   *
   * @private
   * @param {*} item
   * @returns {Promise<any>}
   * @memberof BackupService
   */
  private getSelectedData(item): Promise<any> {
    return new Promise((resolve, reject) => {
      const types = {
        keys: DBTypes.KEY,
        identities: DBTypes.IDENTITY,
        namespaces: DBTypes.NAMESPACE,
        contracts: DBTypes.CONTRACT,
        connections: DBTypes.CONNECTION,
        workflows: DBTypes.WORKFLOW,
        savedTransactions: DBTypes.TXSAVED,
        historicalTransactions: DBTypes.TXHISTORY
      };

      if (!types[item]) {
        reject("Item not specified or not found");
      }

      this.dbService
        .findByType(types[item])
        .then((data: any) => {
          resolve(data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /**
   * Save the file to the specified location
   *
   * @private
   * @param {*} data
   * @returns {Promise<void>}
   * @memberof BackupService
   */
  private saveFile(data): Promise<void> {
    return new Promise((resolve, reject) => {
      this.electron.fs.writeFile(
        this.exportLocation,
        JSON.stringify(data),
        err => {
          if (err) {
            reject(err);
          }

          resolve();
        }
      );
    });
  }
  // #endregion
  // #endregion

  // #region Shared

  /**
   * Compare the hash stored with the data against the new one after import
   *
   * @private
   * @param {*} data
   * @param {boolean} [wasEncrpyted]
   * @returns {Promise<any>}
   * @memberof BackupService
   */
  private checkHash(data, wasEncrpyted?: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      // Pull the hash and strip excess
      const originalHash = data
        .toString()
        .substring(
          data.indexOf("---STARTHASH---"),
          data.indexOf("---ENDHASH---")
        )
        .replace("---STARTHASH---", "")
        .replace("---ENDHASH---", "");

      // Strip original hash from the data
      let strippedData = data
        .substring(data.indexOf("---ENDHASH---", data.length))
        .replace(originalHash, "")
        .replace("---STARTHASH---", "")
        .replace("---ENDHASH---", "");

      // Check if data is b64 and decode it if it isn't convert it
      const isb64 = this.generalService.isb64(strippedData);
      if (!isb64) {
        strippedData = btoa(strippedData);
      }

      // Generate new hash
      const hash = crypto.createHash("sha256");
      hash.update(strippedData);
      const newHash = hash.digest("base64");

      // Compare the hashes
      if (originalHash === newHash) {
        resolve(strippedData);
      } else {
        let message = "Hashes don't match!";
        if (wasEncrpyted) {
          message += "Was the correct password provided?";
        }
        reject(message);
      }
    });
  }

  /**
   * Encrypt the provided data using the password to generate a key
   *
   * @private
   * @param {*} data
   * @param {string} password
   * @returns {Promise<any>}
   * @memberof BackupService
   */
  private encrypt(data: any, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const iv = crypto.randomBytes(16);
      const key = crypto.createHmac("sha256", password);
      const cipher = crypto.createCipheriv("aes-256-cbc", key.digest(), iv);

      // Create hash
      const hash = crypto.createHash("sha256");
      hash.update(data);
      const hashString = hash.digest("base64");

      // Get string of IV
      const ivString = iv.toString("base64");

      // Encrypt and get string
      let encrypted = cipher.update(data, "utf8", "base64");
      encrypted += cipher.final("base64");

      const encryptedString = `enc:---STARTHASH---${hashString}---ENDHASH------STARTIV---${ivString}---ENDIV---${encrypted.toString()}`;

      resolve(encryptedString);
    });
  }

  /**
   * Decrypt the provided data using the password as a key
   *
   * @private
   * @param {*} data
   * @param {string} password
   * @returns {Promise<any>}
   * @memberof BackupService
   */
  private decrypt(data: any, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // Get IV
      const ivString = data
        .substring(
          data.indexOf("---STARTIV---"),
          data.indexOf("---ENDIV---") + 11
        )
        .replace("---STARTIV---", "")
        .replace("---ENDIV---", "");

      data = data
        .replace(ivString, "")
        .replace("---STARTIV---", "")
        .replace("---ENDIV---", "");

      const iv = new Buffer(ivString, "base64");
      const key = crypto.createHmac("sha256", password);

      const decipher = crypto.createDecipheriv("aes-256-cbc", key.digest(), iv);

      // Strip the Hash to readd later
      const hash = data.substring(
        data.indexOf("---STARTHASH---"),
        data.indexOf("---ENDHASH---") + 13
      );

      // Remove excess data
      data = data.replace(hash, "");

      try {
        let decrypted = decipher.update(data, "base64", "utf8");
        decrypted += decipher.final();
        const decryptedString = hash + atob(decrypted.toString());
        resolve(decryptedString);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }

  /**
   * Convert the data to JSON
   *
   * @private
   * @param {*} data
   * @returns {Promise<any>}
   * @memberof BackupService
   */
  private convertToJson(data): Promise<any> {
    return new Promise((resolve, reject) => {
      const isb64 = this.generalService.isb64(data);
      if (isb64) {
        data = atob(data);
      }

      try {
        // Expect to be an Array
        if (data.indexOf("[") === 0) {
          data = JSON.parse(data);
        } else {
          data = JSON.parse(`[${data}]`);
        }
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Generate a hash of the data
   *
   * @private
   * @param {*} data
   * @returns {Promise<any>}
   * @memberof BackupService
   */
  private hashData(data) {
    const isb64 = this.generalService.isb64(data);
    if (!isb64) {
      data = btoa(data);
    }

    const hash = crypto.createHash("sha256");
    hash.update(data);
    return `---STARTHASH---${hash.digest("base64")}---ENDHASH---${data}`;
  }
  // #endregion
}
