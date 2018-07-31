import { Logger } from './Logging/Logger';
import  * as functions  from 'firebase-functions';
import { FundQuoteSync } from './Sync/FundQuoteSync';
import * as Constants from './app/Constants';


const log = new Logger();
log.System(Constants.Messages.ApplicationWelcome);

// const FundUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=ZAG&interval=60min&outputsize=full&apikey=Q2I2J8MN4GGIRIZI";
const fundSync = new FundQuoteSync(log);
export const SynchronizeAllFunds = functions.https.onRequest((req, res) => {

  const original = req.query.text;
  fundSync.synchronizeFunds().then(
    () => {
      log.System(Constants.Messages.ExitApp);
    },
  ).catch((err) => {
    log.Error('Index sync Funds Error:' + err);
  });

  return res.send('Sync Started...');
});

export const SynchronizeFund = functions.https.onRequest((req, res) => {

  const original = req.query;
 
  return res.send('Synchronizing ' + original + ' Started...');
});
