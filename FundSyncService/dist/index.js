"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
console.log("Fund Sync Service started!");
const FundUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=ZAG&interval=60min&outputsize=full&apikey=Q2I2J8MN4GGIRIZI";
const FundUrlFunction = "TIME_SERIES_INTRADAY";
const QueryFrequency = "60min";
const outputSize = "full";
const ApiKey = "Q2I2J8MN4GGIRIZI";
const SymbolSample = "ZAG";
class FundSyncService {
    constructor() { }
    GetFundURL(fundSymbol) {
        return "https://www.alphavantage.co/query?function={FundUrlFunction}&symbol={fundSymbol}&interval={QueryFrequency}&outputsize={outputSize}&apikey={ApiKey}";
    }
    GetFunds() {
        request(this.GetFundURL("ZAG"), { json: true }, (err, res, body) => {
            if (err) {
                return console.log("Error" + err);
            }
            let fundData = body;
            console.log(fundData["Time Series (60min)"]);
            console.log("Fund data received");
        });
    }
}
const fundSync = new FundSyncService();
fundSync.GetFunds();
//# sourceMappingURL=index.js.map