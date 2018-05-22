"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const admin = require("firebase-admin");
const logger_1 = require("./logger");
const Fund_1 = require("./Model/Fund");
const SymbolSync_1 = require("./SymbolSync");
var log = new logger_1.logger();
var serviceAccount = require("c:/sofaspuddev-firebase-adminsdk-00jxe-e314820134.json");
log.System("Fund Sync Service started!");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sofaspuddev.firebaseio.com"
});
var db = admin.database();
const FundSymbolSync = new SymbolSync_1.SymbolSync(db);
FundSymbolSync.SyncTrackedFundSymbols();
//const FundUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=ZAG&interval=60min&outputsize=full&apikey=Q2I2J8MN4GGIRIZI";
const FundUrlFunction = "TIME_SERIES_INTRADAY";
const QueryFrequency = "60min";
const outputSize = "full";
const ApiKey = "Q2I2J8MN4GGIRIZI";
const FailedFundSyncs = [];
class FundSyncService {
    constructor() { }
    GetFundURL(fundSymbol) {
        return `https://www.alphavantage.co/query?function=${FundUrlFunction}&symbol=${fundSymbol}&interval=${QueryFrequency}&outputsize=${outputSize}&apikey=${ApiKey}`;
    }
    GetAllFundsFromDatabase() {
        return db.ref(Fund_1.Fund.StoreName);
    }
    ProcessFundRecord(fundRecord) {
        return new Promise(() => this.GetFundData(fundRecord["Symbol"])
            .then(function (fundData) {
            this.SaveFundData(fundData)
                .then(function (saveData) {
                log.Success("Fund quote updated!");
            }.bind(this))
                .catch(function (error) {
                log.Error("Error Saving Record: " + fundData["Symbol"] + " " + error);
            });
        }.bind(this))
            .catch(function (error) {
            FailedFundSyncs.push(fundRecord["Symbol"]);
            log.Error(error);
        }));
    }
    sleeper(ms) {
        return function (x) {
            return new Promise(resolve => setTimeout(() => resolve(x), ms));
        };
    }
    ProcessFundQuery(FundSnapshot) {
        var childKey = FundSnapshot.key;
        var childData = FundSnapshot.val();
        var childDataKeys = Object.keys(childData);
        childDataKeys.forEach(function (fundKey) {
            log.Information("query");
            const fundRecord = childData[fundKey];
            this.ProcessFundRecord(fundRecord).then(this.sleeper(1000));
        }.bind(this));
    }
    SynchronizeFunds() {
        var fundList = this.GetAllFundsFromDatabase();
        fundList
            .once("value")
            .then(snapshot => {
            this.ProcessFundQuery(snapshot.child("Funds"));
        })
            .then(() => {
            this.ProcessFailedSyncs();
        })
            .catch(function (error) {
            log.Error("Error running Syncronize Funds: " + error);
        });
    }
    ProcessFailedSyncs() {
        log.Information("Processing Failed Queries...");
    }
    SaveFundData(FundQuote) {
        var ref = db.ref(Fund_1.Fund.StoreName);
        return ref.update({
            [FundQuote.Symbol]: FundQuote
        }, function (error) {
            if (error) {
                log.Error("Data could not be saved." + error);
            }
            else {
                log.Success("Data saved successfully.");
            }
        });
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    GetFundData(FundSymbol) {
        return new Promise((resolve, reject) => {
            log.Information(this.GetFundURL(FundSymbol));
            request(this.GetFundURL(FundSymbol), { json: true }, (err, res, body) => {
                if (err || body === undefined || body["Error Message"]) {
                    log.Error("Error Getting Symbol: " + FundSymbol + " " + err);
                    reject("Error: " + err);
                }
                else {
                    log.Success("Fund data received");
                    log.Information(body);
                    const fundData = body["Time Series (60min)"];
                    const firstEntryKey = Object.keys(body["Time Series (60min)"]);
                    const priceDate = firstEntryKey[0];
                    const closePrice = fundData[firstEntryKey[0]]["4. close"];
                    const newFundQuote = new Fund_1.Fund(FundSymbol);
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
fundSync.SynchronizeFunds();
//# sourceMappingURL=index.js.map