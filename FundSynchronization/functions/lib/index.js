"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logging/Logger");
const functions = require("firebase-functions");
const FundQuoteSync_1 = require("./Sync/FundQuoteSync");
const Constants = require("./app/Constants");
const log = new Logger_1.Logger();
log.System(Constants.Messages.ApplicationWelcome);
// const FundUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=ZAG&interval=60min&outputsize=full&apikey=Q2I2J8MN4GGIRIZI";
const fundSync = new FundQuoteSync_1.FundQuoteSync(log);
exports.SynchronizeAllFunds = functions.https.onRequest((req, res) => {
    const original = req.query.text;
    fundSync.synchronizeFunds().then(() => {
        log.System(Constants.Messages.ExitApp);
    }).catch((err) => {
        log.Error('Index sync Funds Error:' + err);
    });
    return res.send('Sync Started...');
});
exports.SynchronizeFund = functions.https.onRequest((req, res) => {
    const original = req.query;
    return res.send('Synchronizing ' + original + ' Started...');
});
//# sourceMappingURL=index.js.map