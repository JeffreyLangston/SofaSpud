"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logging/Logger");
const FundSync_1 = require("./Sync/FundSync");
const Constants = require("./app/Constants");
const log = new Logger_1.Logger();
log.System(Constants.Messages.ApplicationWelcome);
// FundSymbolSync.SyncTrackedFundSymbols();
// const FundUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=ZAG&interval=60min&outputsize=full&apikey=Q2I2J8MN4GGIRIZI";
const fundSync = new FundSync_1.FundSync(log);
fundSync.synchronizeFunds().then(() => {
    log.System(Constants.Messages.ExitApp);
}).catch((err) => {
    log.Error('Index sync Funds Error:' + err);
});
//# sourceMappingURL=index.js.map