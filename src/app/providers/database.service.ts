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
import { ElectronService } from "../shared/services/electron.service";
import { WorkspaceHolder } from "../shared/interfaces/workspace.interfaces";
import { GeneralSettingsData } from "../shared/structures/settings.structures";
import { IBaseDBDocument } from "../shared/interfaces/database.interface";
import { IGeneralSettingsData } from "../shared/interfaces/settings.interfaces";
import { DBTypes } from "../shared/enums/db.enum";

/**
 * Provides database functionality
 *
 * @export
 * @class DatabaseService
 */
@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  /**
   * Points to the workspace storage file
   *
   * @private
   * @memberof DatabaseService
   */
  private workspacePath: string;

  /**
   * Provides the pouchdb instance
   *
   * @private
   * @memberof DatabaseService
   */
  private db: PouchDB.Database;

  /**
   * Holds the available workspaces
   *
   * @type {WorkspaceHolder}
   * @memberof DatabaseService
   */
  public workspaces: WorkspaceHolder;

  /**
   * Creates an instance of DatabaseService.
   * @param {ElectronService} electron
   * @memberof DatabaseService
   */
  constructor(private electron: ElectronService) {
    this.workspacePath =
      this.electron.remote.app.getPath("userData") + "/workspaces.json";

    this.db = new this.electron.pouchdb("default");
  }

  // #region Internal DB Commands

  /**
   * Initialise the database
   * Should be run on app startup
   *
   * @returns {Promise<void>}
   * @memberof DatabaseService
   */
  public async initialise(workspace?: string): Promise<void> {
    if (workspace) {
      this.db = new this.electron.pouchdb(workspace);
    } else {
      this.db = new this.electron.pouchdb("default");
      this.checkForDefaultWorkspace();
    }

    try {
      await this.db.info();

      // !FIXME: Figure out why this is happening
      // !TODO: Test if it works in the built version
      // Indexing fails when running dev build restarts
      if (!this.electron.isDev) {
        await this.db.createIndex({
          index: { fields: ["_id", "type"] },
        });
      }

      // Initialise general data, ignore error if file exists
      await this.generalSettings();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get general settings
   *
   * @private
   * @returns {Promise<void>}
   * @memberof DatabaseService
   */
  private generalSettings(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.findById<IGeneralSettingsData>("general")
        .then((doc: IGeneralSettingsData) => {
          return this.handleGeneralSettingsCheck(doc);
        })
        .then(() => {
          resolve();
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }

  /**
   * Check if general settings exists, otherwise create
   *
   * @private
   * @param {IGeneralSettingsData} generalSettings
   * @returns {Promise<void>}
   * @memberof DatabaseService
   */
  private handleGeneralSettingsCheck(
    generalSettings: IGeneralSettingsData
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!generalSettings) {
        generalSettings = new GeneralSettingsData();
        this.add<IGeneralSettingsData>(generalSettings)
          .then(() => {
            resolve();
          })
          .catch((err: { status: number }) => {
            if (err.status === 404) {
              generalSettings = new GeneralSettingsData();
              this.add(generalSettings)
                .then(() => {
                  resolve();
                })
                .catch((err2: unknown) => {
                  reject(err2);
                });
            } else {
              reject(err);
            }
          });
      } else {
        resolve();
      }
    });
  }

  /**
   * Get all the documents in the database
   *
   * @returns {Promise<any>}
   * @memberof DatabaseService
   */
  public findAll(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.db
        .allDocs({ include_docs: true })
        .then((data: any) => {
          resolve(data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /**
   * Find a document using its ID
   *
   * @param {any} id
   * @returns {Promise<any>}
   * @memberof DatabaseService
   */
  public findById<T>(id): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.db
        .get(id)
        .then((data: unknown) => {
          resolve(data as T);
        })
        .catch((err: { status: number }) => {
          if (err.status === 404) {
            return resolve(undefined);
          }
          reject(err);
        });
    });
  }

  /**
   * Get all documents of a specific type
   *
   * @param {string} type
   * @returns {Promise<Array<any>>}
   * @memberof DatabaseService
   */
  public async findByType<T>(type: DBTypes): Promise<Array<T>> {
    try {
      // * Temporary fix for database not indexing on hot reload
      // ! indexing should be tested in a built version too
      if (this.electron.isDev) {
        const entries: any = await this.findAll();
        let filteredEntries: Array<T> = [];

        for (const entry of entries.rows) {
          if (entry.doc.type === type) {
            filteredEntries.push(entry.doc);
          }
        }

        return filteredEntries;
      }

      const response: any = await this.db.find({
        selector: {
          _id: { $gte: null },
          type: { $eq: type },
        },
      });

      return response.docs as Array<T>;
    } catch (error) {
      if (error.status === 404) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Add a document to the database
   *
   * @param {*} data
   * @returns {Promise<any>}
   * @memberof DatabaseService
   */
  public add<T>(data: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.db
        .post(data)
        .then((response: any) => {
          this.findById(response.id)
            .then((storedData: T) => {
              resolve(storedData);
            })
            .catch((err: any) => {
              reject(err);
            });
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /**
   * Update a document
   *
   * @param {*} data
   * @returns {Promise<void>}
   * @memberof DatabaseService
   */
  public update<T extends IBaseDBDocument>(data: T): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Can't update if we don't know the revision
      if (!data._id) {
        return reject("No ID");
      }

      // Assume no rev provided
      this.db
        .get(data._id)
        .then((document) => {
          data._rev = document._rev;

          this.db
            .put(data)
            .then(() => {
              resolve();
            })
            .catch((err: any) => {
              reject(err);
            });
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /**
   * Remove a document from the array
   *
   * @param {string} id
   * @returns {Promise<any>}
   * @memberof DatabaseService
   */
  public remove(id: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.findById(id)
        .then((document: any) => {
          this.db
            .remove(document)
            .then((resp) => {
              resolve(resp);
            })
            .catch((err: any) => {
              reject(err);
            });
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /**
   * Destroys the database
   *
   * @returns {Promise<void>}
   * @memberof DatabaseService
   */
  public clearDb(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db
        .destroy()
        .then(() => {
          return this.initialise();
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
   * Handles bulk adding of documents to the database
   *
   * @param {Array<any>} data
   * @returns {Promise<void>}
   * @memberof DatabaseService
   */
  public bulkAdd<T>(data: Array<T>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.preProcessBulk(data)
        .then((processedData: Array<T>) => {
          this.db.bulkDocs(processedData, { new_edits: true });
        })
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /**
   * Pre process data for bulk importing
   * Checks the format of the array elements, if nested doc is found that is made the parent.
   *
   * @private
   * @param {Array<any>} data
   * @returns {Promise<Array<any>>}
   * @memberof DatabaseService
   */
  private preProcessBulk(data: Array<any>): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      // Just check against the initial object, assume all data in the same format
      // Handle issues with non matching data at failure elsewhere

      const delegateKeys = Object.keys(data[0]);
      const holder = new Array<any>();

      // If the array items contain a doc key
      if (delegateKeys.indexOf("doc") !== -1) {
        let i = data.length;
        while (i--) {
          const temp = data[i].doc;

          // Don't need to restore this
          if (temp.type !== DBTypes.MENUSTATE) {
            delete temp._rev;
            holder.push(temp);
          }
        }

        // Reassign data to avoid uneccessary else
        data = holder;
      }

      resolve(data);
    });
  }

  // #endregion

  // #region Workspace

  /**
   * Initialise the workspaces
   *
   * @returns {Promise<void>}
   * @memberof DatabaseService
   */
  public initialiseWorkspaces(): Promise<void> {
    return new Promise((resolve, reject) => {
      const workspaceData: WorkspaceHolder = {
        workspaces: ["default"],
        last: "default",
      };

      try {
        // Check to see if the path exists
        const exists = this.electron.fs.existsSync(this.workspacePath);

        if (!exists) {
          // Path doesn't exist so create a new workspace file
          this.electron.fs.writeFileSync(
            this.workspacePath,
            JSON.stringify(workspaceData)
          );

          this.workspaces = workspaceData;
        } else {
          // Path exists so open the workspace file
          const data = this.electron.fs.readFileSync(
            this.workspacePath,
            "utf-8"
          );
          this.workspaces = JSON.parse(data) as WorkspaceHolder;
        }

        // Open whichever workspace was last open
        this.openWorkspace(this.workspaces.last);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Check if there the default workspace "default" exists
   *
   * @private
   * @memberof DatabaseService
   */
  private checkForDefaultWorkspace(): void {
    if (this.workspaces.workspaces.indexOf("default") < 0) {
      this.createWorkspace("default");
    }
  }

  /**
   * Create a new workspace
   *
   * @param {string} workspace
   * @returns {Promise<void>}
   * @memberof DatabaseService
   */
  public createWorkspace(workspace: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.openWorkspace(workspace, true)
        .then(() => {
          this.workspaces.workspaces.push(workspace);

          this.saveWorkspaceHolder();

          resolve();
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  /**
   * Save the workspace list to the filesystem
   * Workspaces are stored in a JSON file
   *
   * @private
   * @returns {Promise<void>}
   * @memberof DatabaseService
   */
  private saveWorkspaceHolder(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.electron.fs.writeFile(
        this.workspacePath,
        JSON.stringify(this.workspaces),
        (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        }
      );
    });
  }

  /**
   * Open a workspace
   *
   * @param {string} workspace
   * @param {boolean} [create]
   * @param {boolean} [dontUpdateLast]
   * @returns {Promise<void>}
   * @memberof DatabaseService
   */
  public openWorkspace(
    workspace: string,
    create?: boolean,
    dontUpdateLast?: boolean
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.workspaces.workspaces.indexOf(workspace) > -1 || create) {
        this.initialise(workspace)
          .then(() => {
            resolve();
          })
          .catch((err: any) => {
            reject(err);
          });

        if (!dontUpdateLast) {
          this.updateLastWorkspace(workspace);
        }
      } else {
        reject(new Error("Workspace not found and not creating a new one."));
      }
    });
  }

  /**
   * Record the last opened workspace
   *
   * @private
   * @param {string} workspace
   * @memberof DatabaseService
   */
  private updateLastWorkspace(workspace: string): void {
    this.workspaces.last = workspace;
    this.electron.fs.writeFile(
      this.workspacePath,
      JSON.stringify(this.workspaces),
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }

  /**
   * Get all workspaces
   *
   * @returns {Promise<WorkspaceHolder>}
   * @memberof DatabaseService
   */
  public getWorkspaces(): Promise<WorkspaceHolder> {
    return new Promise((resolve, reject) => {
      this.electron.fs.readFile(this.workspacePath, "utf-8", (err, data) => {
        if (err) {
          return reject(err);
        }

        const workspaceHolder = JSON.parse(data) as WorkspaceHolder;
        resolve(workspaceHolder);
      });
    });
  }

  /**
   * Duplicate a workspace
   *
   * @private
   * @param {string} name
   * @param {string} newName
   * @returns {Promise<void>}
   * @memberof DatabaseService
   */
  private replicate(name: string, newName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.createWorkspace(newName)
        .then(() => {
          return this.openWorkspace(name);
        })
        .then(() => {
          this.db.replicate
            .to(newName)
            .on("complete", () => {
              resolve();
            })
            .on("error", (err) => {
              reject(err);
            });
        })
        .catch((err: unknown) => {
          console.error(err);
        });
    });
  }

  /**
   * Rename a workspace
   *
   * @param {string} workspace
   * @param {string} newName
   * @returns {Promise<void>}
   * @memberof DatabaseService
   */
  public renameWorkspace(workspace: string, newName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.replicate(workspace, newName)
        .then(() => {
          return this.removeWorkspace(workspace);
        })
        .then(() => {
          resolve();
        })
        .catch((err: unknown) => {
          reject(err);
        });
    });
  }

  /**
   * Remove a specific workspace
   *
   * @param {string} workspace
   * @param {boolean} [justData]
   * @returns {Promise<void>}
   * @memberof DatabaseService
   */
  public removeWorkspace(workspace: string, justData?: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      this.openWorkspace(workspace, false, true)
        .then(() => {
          return this.db.destroy();
        })
        .then(() => {
          if (!justData) {
            let i = this.workspaces.workspaces.length;
            while (i--) {
              if (this.workspaces.workspaces[i] === workspace) {
                this.workspaces.workspaces.splice(i, 1);
                this.workspaces.last = "default";

                this.saveWorkspaceHolder();
                this.initialise()
                  .then(() => {
                    return resolve();
                  })
                  .catch((err: unknown) => {
                    reject(err);
                  });
              }
            }
          } else {
            this.initialise()
              .then(() => {
                return resolve();
              })
              .catch((err: unknown) => {
                reject(err);
              });
          }
        })
        .catch((err: unknown) => {
          reject(err);
        });
    });
  }

  // #endregion
}
