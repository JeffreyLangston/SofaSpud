import * as request from 'request';
import * as admin from 'firebase-admin';
import { Logger } from './Logging/Logger';
import { Fund } from './Model/Fund';
import { resolve, TIMEOUT } from 'dns';
import  * as functions  from 'firebase-functions';

import { FundQuoteSync } from './Sync/FundQuoteSync';
import * as Constants from './app/Constants';
import * as googleFinance from 'google-finance/index';

const log = new Logger();
log.System(Constants.Messages.ApplicationWelcome);

// const FundUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=ZAG&interval=60min&outputsize=full&apikey=Q2I2J8MN4GGIRIZI";
const fundSync = new FundQuoteSync(log);
export const addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  fundSync.synchronizeFunds().then(
    () => {
      log.System(Constants.Messages.ExitApp);
    },
  ).catch((err) => {
    log.Error('Index sync Funds Error:' + err);
  });

  // Push the new message into the Realtime Database using the Firebase Admin SDK.
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  return res.send('Sync Started...');
});
