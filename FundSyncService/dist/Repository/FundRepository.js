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
const Fund_1 = require("../Model/Fund");
const firebase_1 = require("./firebase");
class FundRepository {
    constructor(log) {
        this.database = firebase_1.SoftSpudFirebase.Instance.Database;
        this.log = log;
    }
    getAllFundsFromDatabase() {
        return this.database.ref(Fund_1.Fund.StoreName);
    }
    updateFund(fund) {
        this.database.ref('System/Funds/' + fund.Symbol).update({
            Symbol: fund.Symbol,
            Name: fund.Name,
        }).catch((err) => {
            this.log.Error('Error updating fund in firebase. Symbol: ' + fund.Symbol + ' error: ' + err);
        });
    }
    incrementSyncError(fundSymbol) {
        return __awaiter(this, void 0, void 0, function* () {
            const ref = this.getFundRef(fundSymbol);
            ref.child('FailedCount').transaction((currentFailedCount) => {
                return currentFailedCount + 1;
            });
        });
    }
    getFundRef(fundSymbol) {
        const ref = this.database.ref('System/Funds/' + fundSymbol);
        return ref;
    }
    updateFundQuote(fundQuote) {
        return __awaiter(this, void 0, void 0, function* () {
            const ref = this.database.ref('System/Funds/' + fundQuote.Symbol);
            return ref.update({
                Quote: fundQuote.Quote,
                QuoteDate: fundQuote.QuoteDate,
            }, (error) => {
                if (error) {
                    this.log.Error('Data could not be saved.' + error);
                }
                else {
                    this.log.Success('Data saved successfully.');
                }
            }).catch((err) => {
                this.log.Error('Error updating fund quote in firebase. Symbol: '
                    + fundQuote.Symbol + ' error: ' + err);
            });
        });
    }
}
exports.FundRepository = FundRepository;
//# sourceMappingURL=FundRepository.js.map