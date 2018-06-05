import * as request from "request";
import * as admin from "firebase-admin";
import { logger } from "./logger";
import { Fund } from "./Model/Fund";
import { resolve, TIMEOUT } from "dns";
import { SymbolSync } from "./SymbolSync";

var log = new logger();
var serviceAccount = require("c:/sofaspuddev-firebase-adminsdk-00jxe-e314820134.json");
log.System("Fund Sync Service started!");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sofaspuddev.firebaseio.com"
});

var db = admin.database();
const FundSymbolSync = new SymbolSync(db);

//FundSymbolSync.SyncTrackedFundSymbols();

//const FundUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=ZAG&interval=60min&outputsize=full&apikey=Q2I2J8MN4GGIRIZI";
const FundUrlFunction = "TIME_SERIES_INTRADAY";
const QueryFrequency = "60min";
const outputSize = "full";

const ApiKey = "Q2I2J8MN4GGIRIZI";
const FailedFundSyncs = [];

class FundSyncService {
  constructor() {}

  GetFundURL(fundSymbol) {
    return `https://www.alphavantage.co/query?function=${FundUrlFunction}&symbol=${fundSymbol}&interval=${QueryFrequency}&outputsize=${outputSize}&apikey=${ApiKey}`;
  }

  GetAllFundsFromDatabase(): admin.database.Reference {
    return db.ref(Fund.StoreName);
  }

  async ProcessFundRecord(fundRecord) {
    this.GetFundData(fundRecord["Symbol"])
      .then(
        function(fundData) {
          this.SaveFundData(fundData)
            .then(
              function(saveData) {
                log.Success("Fund quote updated!");
              }.bind(this)
            )
            .catch(function(error) {
              log.Error(
                "Error Saving Record: " + fundData["Symbol"] + " " + error
              );
            });
        }.bind(this)
      )
      .catch(function(error) {
        FailedFundSyncs.push(fundRecord["Symbol"]);
        log.Error(error);
      });
  }

  sleeper(ms) {
    return function(x) {
      return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
  }

  async ProcessFundQuery(FundSnapshot: admin.database.DataSnapshot) {
    var childKey = FundSnapshot.key;
    var childData = FundSnapshot.val();
    var childDataKeys = Object.keys(childData);
    for (const fundKey of childDataKeys) {
      log.Information("query for " + fundKey);
      const fundRecord = childData[fundKey];
      await this.ProcessFundRecord(fundRecord)
        .then(function() {
          log.Success("successful process!");
        })
        .catch(function() {
          log.Error("Error processing!");
        });
      await this.sleep(3000);
    }
  }

  async SynchronizeFunds() {
    var fundList = this.GetAllFundsFromDatabase();
    fundList
      .once("value")
      .then(snapshot => {
        this.ProcessFundQuery(snapshot.child("Funds"));
      })
      .then(() => {
        this.ProcessFailedSyncs();
      })
      .catch(function(error) {
        log.Error("Error running Syncronize Funds: " + error);
      });
  }

  ProcessFailedSyncs() {
    log.Information("Processing Failed Queries...");
  }

  async SaveFundData(FundQuote: Fund): Promise<void> {
    var ref = db.ref(Fund.StoreName);
    return ref.update(
      {
        [FundQuote.Symbol]: FundQuote
      },
      function(error) {
        if (error) {
          log.Error("Data could not be saved." + error);
        } else {
          log.Success("Data saved successfully.");
        }
      }
    );
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async GetFundData(FundSymbol): Promise<Fund> {
    return new Promise<Fund>((resolve, reject) => {
      log.Information(this.GetFundURL(FundSymbol));
      request(this.GetFundURL(FundSymbol), { json: true }, (err, res, body) => {
        if (
          err ||
          body === undefined ||
          body["Error Message"] ||
          body["Time Series (60min)"] === false
        ) {
          if (err) {
            log.Error(err);
          }
          if (body) {
            log.Error(body);
          }
          log.Error("Error Getting Symbol: " + FundSymbol + " " + err);
          reject("Error: " + err);
        } else {
          log.Success("Fund data received");
          log.Information(body);
          const fundData = body["Time Series (60min)"];
          const firstEntryKey = Object.keys(body["Time Series (60min)"]);
          const priceDate = firstEntryKey[0];
          const closePrice = fundData[firstEntryKey[0]]["4. close"];

          const newFundQuote: Fund = new Fund(FundSymbol);
          newFundQuote.Price = closePrice;
          newFundQuote.QuoteDate = new Date(priceDate);

          console.log(newFundQuote);
          resolve(newFundQuote);
        }
      });
    });
  }
}

const fundSync = new FundSyncService();
fundSync.SynchronizeFunds().then();
console.log("exiting application");
