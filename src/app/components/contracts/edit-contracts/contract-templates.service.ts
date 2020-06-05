import { Injectable } from "@angular/core";

/**
 * Provides smart contract templates
 *
 * @export
 * @class ContractTemplatesService
 */
@Injectable({
  providedIn: "root",
})
export class ContractTemplatesService {
  constructor() {}

  get default(): string {
    return `import { Activity, Standard } from "@activeledger/activecontracts";

    /**
     * New Activeledger Smart Contract
     *
     * @export
     * @class MyContract
     * @extends {Standard}
     */
    export default class MyContract extends Standard {
      /**
       * Quick Transaction Check - Verify Input Properties (Known & Relevant Transaction?)
       * Signatureless - Verify if this contract is happy to run with selfsigned transactions
       *
       * @param {boolean} selfsigned
       * @returns {Promise<boolean>}
       * @memberof MyContract
       */
      public verify(selfsigned: boolean): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
          if (!selfsigned) {
            resolve(true);
          } else {
            reject("Identity Signatures Needed");
          }
        });
      }
    
      /**
       * Voting Round, Is the transaction request valid?
       *
       * @returns {Promise<boolean>}
       * @memberof MyContract
       */
      public vote(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
          // Get Stream id
          let stream: string = Object.keys(this.transactions.$i)[0];
    
          // Get Stream Activity
          let activity: Activity = this.getActivityStreams(stream);
    
          // Run Checks on input stream data object
          let data = activity.getState();
    
          this.ActiveLogger.debug("Voting Round - Automatic True");
          resolve(true);
        });
      }
    
      /**
       * Prepares the new streams state to be comitted to the ledger
       *
       * @returns {Promise<any>}
       * @memberof MyContract
       */
      public commit(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
          // Update Activity Streams
          // Create New Activity Streams
          resolve(true);
        });
      }
    }
    
    /*
    #io
    
      {
        "$entry": "contract entry point",
        "$i": {"streamId": {} },
        "$o": {},
        "$r": {}
      }
    #endio
    */
    `;
  }
}
