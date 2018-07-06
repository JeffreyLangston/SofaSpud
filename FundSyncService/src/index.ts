import * as request from 'request';
import * as admin from 'firebase-admin';
import { Logger } from './Logging/Logger';
import { Fund } from './Model/Fund';
import { resolve, TIMEOUT } from 'dns';

import { FundQuoteSync } from './Sync/FundQuoteSync';
import * as Constants from './app/Constants';
import * as googleFinance from 'google-finance/index';

const log = new Logger();
log.System(Constants.Messages.ApplicationWelcome);

// const FundUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=ZAG&interval=60min&outputsize=full&apikey=Q2I2J8MN4GGIRIZI";

const fundSync = new FundQuoteSync(log);
fundSync.synchronizeFunds().then(
  () => {
    log.System(Constants.Messages.ExitApp);
  },
).catch((err) => {
  log.Error('Index sync Funds Error:' + err);
});
