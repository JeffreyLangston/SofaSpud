import * as request from 'request';
import * as admin from 'firebase-admin';
import { Logger } from './Logging/Logger';
import { Fund } from './Model/Fund';
import { resolve, TIMEOUT } from 'dns';
import { SymbolSync } from './Sync/SymbolSync';
import { FundSync } from './Sync/FundSync';
import * as Constants from './app/Constants';

const log = new Logger();
log.System(Constants.Messages.ApplicationWelcome);

// FundSymbolSync.SyncTrackedFundSymbols();
// const FundUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=ZAG&interval=60min&outputsize=full&apikey=Q2I2J8MN4GGIRIZI";

const fundSync = new FundSync(log);
fundSync.synchronizeFunds().then(
  () => {
    log.System(Constants.Messages.ExitApp);
  },
).catch((err) => {
  log.Error('Index sync Funds Error:' + err);
});
