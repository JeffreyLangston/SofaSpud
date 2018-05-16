"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const admin = require("firebase-admin");
const logger_1 = require("./logger");
const FundQuote_1 = require("./Model/FundQuote");
const SymbolSync_1 = require("./SymbolSync");
var log = new logger_1.logger();
var serviceAccount = require('E:/GoogleDrive/sofaspuddev-firebase-adminsdk-00jxe-e314820134.json');
log.System("Fund Sync Service started!");
const FundSymbolSync = new SymbolSync_1.SymbolSync();
FundSymbolSync.SyncTrackedFundSymbols();
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://sofaspuddev.firebaseio.com'
});
var db = admin.database();
//const FundUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=ZAG&interval=60min&outputsize=full&apikey=Q2I2J8MN4GGIRIZI";
const FundUrlFunction = "TIME_SERIES_INTRADAY";
const QueryFrequency = "60min";
const outputSize = "full";
const ApiKey = "Q2I2J8MN4GGIRIZI";
const SymbolSample = "ITOT";
class FundSyncService {
    constructor() { }
    GetFundURL(fundSymbol) {
        return `https://www.alphavantage.co/query?function=${FundUrlFunction}&symbol=${fundSymbol}&interval=${QueryFrequency}&outputsize=${outputSize}&apikey=${ApiKey}`;
    }
    GetFunds() {
        this.GetFundData(SymbolSample).then(function (fundData) {
            this.SaveFundData(fundData).then(function (saveData) {
                log.Success('Fund quote updated!');
            }.bind(this)).catch(function (error) {
                log.Error(error);
            });
        }.bind(this)).catch(function (error) {
            log.Error(error);
        });
    }
    SaveFundData(FundQuote) {
        var ref = db.ref(FundQuote.StoreName);
        return ref.update({
            [SymbolSample]: FundQuote
        }, function (error) {
            if (error) {
                log.Error("Data could not be saved." + error);
            }
            else {
                log.Success("Data saved successfully.");
            }
        });
    }
    GetFundData(FundSymbol) {
        return new Promise((resolve, reject) => {
            log.Information(this.GetFundURL(FundSymbol));
            request(this.GetFundURL(FundSymbol), { json: true }, (err, res, body) => {
                if (err || body === undefined || body["Error Message"] != undefined) {
                    log.Error("Error:" + err);
                    reject("Error: " + err);
                }
                log.Success("Fund data received");
                const fundData = body["Time Series (60min)"];
                const firstEntryKey = Object.keys(body["Time Series (60min)"]);
                const priceDate = firstEntryKey[0];
                const closePrice = fundData[firstEntryKey[0]]["4. close"];
                const newFundQuote = new FundQuote_1.FundQuote(FundSymbol, closePrice, new Date(priceDate));
                console.log(newFundQuote);
                resolve(newFundQuote);
            });
        });
    }
}
const fundSync = new FundSyncService();
fundSync.GetFunds();
//# sourceMappingURL=index.js.map