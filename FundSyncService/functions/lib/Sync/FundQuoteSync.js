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
const request = require("request");
const Fund_1 = require("../Model/Fund");
const Constants = require("../app/Constants");
const FundRepository_1 = require("..//Repository/FundRepository");
const Sleeper_1 = require("../Helper/Sleeper");
const SymbolSync_1 = require("./SymbolSync");
const moment = require("moment");
class FundQuoteSync {
    constructor(log) {
        this.log = log;
        this.fundRepo = new FundRepository_1.FundRepository(this.log);
        this.syncStartTime = moment();
        this.log.Information((this.syncStartTime) + Constants.Messages.Started);
        this.failedFundSyncs = [];
    }
    synchronizeFunds() {
        return __awaiter(this, void 0, void 0, function* () {
            const fundList = this.fundRepo.getAllFundsFromDatabase();
            const snapshot = yield fundList.once('value');
            // if snapshot is null populate database and sync fund symbols.
            if (snapshot &&
                snapshot.hasChild(Constants.Firebase.fundTableName)) {
                this.processFundSnapshot(snapshot);
            }
            else {
                // we have no funds in the database.
                const symbolSync = new SymbolSync_1.SymbolSync(this.log);
                symbolSync.syncTrackedFundSymbols();
                this.processFundSnapshot(snapshot);
            }
            // .catch((error) => {
            //  this.log.Error('Error running Synchronize Funds: ' + error);
            // });
        });
    }
    processFundSnapshot(snapshot) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.processFundQuery(snapshot.child(Constants.Firebase.fundTableName))
                .then(() => {
                const now = moment();
                const timeToComplete = now.to(this.syncStartTime);
                // Write Completed sync time to database.
                this.log.Success('Sync Time:' + timeToComplete + Constants.Miscellaneous.Milliseconds);
                this.processFailedSyncs();
            })
                .catch((error) => {
                this.log.Error('Error running Synchronize Funds Process: ' + error);
            });
        });
    }
    processFundRecord(fundSymbol) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getFundData(fundSymbol)
                .then((fundData) => __awaiter(this, void 0, void 0, function* () {
                yield this.fundRepo.updateFundQuote(fundData)
                    .then((saveData) => {
                    this.log.Success(Constants.Messages.FundUpdated);
                })
                    .catch((error) => {
                    this.log.Error('Error Saving Record: '
                        + fundData[Constants.Firebase.fundSymbolColumn] + ' ' + error);
                });
            }))
                .catch((error) => {
                this.fundRepo.incrementSyncError(fundSymbol);
                this.failedFundSyncs.push(fundSymbol);
                this.log.Error(error);
            });
        });
    }
    processFundQuery(fundSnapshot) {
        return __awaiter(this, void 0, void 0, function* () {
            const childKey = fundSnapshot.key;
            const childData = fundSnapshot.val();
            const childDataKeys = Object.keys(childData);
            for (const fundKey of childDataKeys) {
                this.log.Information(Constants.Firebase.query + fundKey);
                const fundRecord = childData[fundKey];
                yield this.processFundRecord(fundRecord.Symbol)
                    .then(() => {
                    this.log.Success('ProcessFunQuery success for: ' + fundKey);
                })
                    .catch(() => {
                    this.log.Error('ProcessFundQuery Failed for: ' + fundKey);
                });
                this.log.System('waiting...');
                yield Sleeper_1.sleep(Constants.FundQuery.QueryDelay).catch(() => {
                    this.log.Error('error using sleep function');
                });
                this.log.System('done waiting...');
            }
        });
    }
    processFailedSyncs() {
        this.log.Information('Failed sync count: ' + this.failedFundSyncs.length);
        this.log.Information('Processing Failed Queries...');
        while (this.failedFundSyncs.length > 0) {
            const failedFunds = this.failedFundSyncs;
            this.failedFundSyncs = [];
            failedFunds.forEach((fund) => {
                this.processFundRecord(fund);
            });
        }
    }
    getFundData(fundSymbol) {
        return new Promise((resolve, reject) => {
            this.log.Information(Constants.FundQuery.GetFundURL(fundSymbol));
            request(Constants.FundQuery.GetFundURL(fundSymbol), { json: true }, (err, res, body) => {
                if (err ||
                    body === undefined ||
                    body[Constants.FundQuery.ErrorProperty] ||
                    !body[Constants.FundQuery.TimeSeriesProperty]) {
                    if (err) {
                        this.log.Error(err);
                    }
                    if (body) {
                        this.log.Error(JSON.stringify(body));
                    }
                    if (res) {
                        this.log.Error(JSON.stringify(res));
                    }
                    this.log.Error('Error Getting Symbol: ' + fundSymbol + ' ' + err);
                    reject('Error: ' + err);
                }
                else {
                    this.log.Success('Fund data received');
                    this.log.Information(body);
                    const fundData = body[Constants.FundQuery.TimeSeriesProperty];
                    const firstEntryKey = Object.keys(body[Constants.FundQuery.TimeSeriesProperty]);
                    const priceDate = firstEntryKey[0];
                    const closePrice = fundData[firstEntryKey[0]][Constants.FundQuery.ClosingPriceProperty];
                    const newFundQuote = new Fund_1.Fund(fundSymbol);
                    newFundQuote.Quote = closePrice;
                    newFundQuote.QuoteDate = new Date(priceDate);
                    console.log(newFundQuote);
                    resolve(newFundQuote);
                }
            });
        });
    }
}
exports.FundQuoteSync = FundQuoteSync;
//# sourceMappingURL=FundQuoteSync.js.map