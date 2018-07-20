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
exports.addMessage = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    fundSync.synchronizeFunds().then(() => {
        log.System(Constants.Messages.ExitApp);
    }).catch((err) => {
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
//# sourceMappingURL=index.js.map