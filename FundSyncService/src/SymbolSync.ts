import { Fund } from "./Model/Fund";
import * as fs from "fs";
import * as path from "path";
import { resolve } from "url";
import * as admin from "firebase-admin";

export class SymbolSync {
  constructor(db: admin.database.Database) {
    this.database = db;
  }
  private database: admin.database.Database;

  SyncTrackedFundSymbols() {
    this.getFundList()
      .then(
        function(fundList) {
          fundList.forEach(fund => {
            this.database.ref("Funds/" + fund.Symbol).update({
              Symbol: fund.Symbol,
              Name: fund.Name
            });
            //console.log("updated: " + fund.Symbol);
          });
        }.bind(this)
      )
      .catch(function(error) {
        console.log(error);
      });
  }

  getFundList(): Promise<Array<Fund>> {
    return new Promise<Array<Fund>>((resolve, reject) => {
      console.log(path.resolve(__dirname, "./FundList.json"));
      fs.readFile(
        path.resolve(__dirname, "./FundList.json"),
        "utf8",
        (err, data) => {
          if (err) {
            reject(err);
          }
          const funds: Array<Fund> = JSON.parse(data);
          resolve(funds["funds"]);
        }
      );
    });
  }
}
