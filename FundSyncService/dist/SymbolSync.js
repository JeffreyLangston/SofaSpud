"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
class SymbolSync {
    constructor() { }
    SyncTrackedFundSymbols() {
        this.getFundList().then(function (fundList) {
            fundList.funds.forEach(fund => {
                console.log(fund.Name);
            });
        }).catch(function (error) {
            console.log(error);
        });
    }
    getFundList() {
        return new Promise((resolve, reject) => {
            console.log(path.resolve(__dirname, "./FundList.json"));
            fs.readFile(path.resolve(__dirname, "./FundList.json"), 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                }
                console.log("data: " + data);
                const funds = JSON.parse(data);
                resolve(funds);
            });
        });
    }
}
exports.SymbolSync = SymbolSync;
//# sourceMappingURL=SymbolSync.js.map