"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const FundRepository_1 = require("../Repository/FundRepository");
class SymbolSync {
    constructor(log) {
        this.fundListDirectory = '../Data/FundList.json';
        this.log = log;
        this.fundRepo = new FundRepository_1.FundRepository(log);
    }
    syncTrackedFundSymbols() {
        return __awaiter(this, void 0, void 0, function* () {
            this.getFundList()
                .then((fundList) => {
                fundList.forEach((fund) => {
                    this.fundRepo.updateFund(fund);
                });
            })
                .catch((error) => {
                this.log.Error(error);
            });
        });
    }
    getFundList() {
        return new Promise((resolve, reject) => {
            this.log.Information(path.resolve(__dirname, this.fundListDirectory));
            fs.readFile(path.resolve(__dirname, this.fundListDirectory), 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                }
                const funds = JSON.parse(data);
                resolve(funds['Funds']);
            });
        });
    }
}
exports.SymbolSync = SymbolSync;
//# sourceMappingURL=SymbolSync.js.map