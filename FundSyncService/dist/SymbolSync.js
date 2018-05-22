"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
class SymbolSync {
    constructor(db) {
        this.database = db;
    }
    SyncTrackedFundSymbols() {
        this.getFundList()
            .then(function (fundList) {
            fundList.forEach(fund => {
                this.database.ref("Funds/" + fund.Symbol).update({
                    Symbol: fund.Symbol,
                    Name: fund.Name
                });
                console.log("updated: " + fund.Symbol);
            });
        }.bind(this))
            .catch(function (error) {
            console.log(error);
        });
    }
    getFundList() {
        return new Promise((resolve, reject) => {
            console.log(path.resolve(__dirname, "./FundList.json"));
            fs.readFile(path.resolve(__dirname, "./FundList.json"), "utf8", (err, data) => {
                if (err) {
                    reject(err);
                }
                const funds = JSON.parse(data);
                resolve(funds["funds"]);
            });
        });
    }
}
exports.SymbolSync = SymbolSync;
//# sourceMappingURL=SymbolSync.js.map