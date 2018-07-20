import { Logger } from './Logging/Logger';
import  * as functions  from 'firebase-functions';

import { FundQuoteSync } from './Sync/FundQuoteSync';
import * as Constants from './app/Constants';


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


/* import * as functions from 'firebase-functions';
import { FundQuoteSync } from './Sync/FundQuoteSync';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const fundSync = new FundQuoteSync();

export const helloWorld = functions.https.onRequest((request, response) => {
  const message = fundSync.fundSyncMessage();
 response.send(message);

}); */