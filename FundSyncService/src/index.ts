import * as request from "request";
import * as admin from 'firebase-admin';

var serviceAccount = require('E:/GoogleDrive/sofaspuddev-firebase-adminsdk-00jxe-e314820134.json');
console.log("Fund Sync Service started!");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://sofaspuddev.firebaseio.com'
});

var db = admin.database();


const FundUrl =
  "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=ZAG&interval=60min&outputsize=full&apikey=Q2I2J8MN4GGIRIZI";
const FundUrlFunction = "TIME_SERIES_INTRADAY";
const QueryFrequency = "60min";
const outputSize = "full";

const ApiKey = "Q2I2J8MN4GGIRIZI";
const SymbolSample = "ZAG";

class FundSyncService {
  constructor() { }

  GetFundURL(fundSymbol) {
    return `https://www.alphavantage.co/query?function=${FundUrlFunction}&symbol=${fundSymbol}&interval=${QueryFrequency}&outputsize=${outputSize}&apikey=${ApiKey}`;
  }

  GetFunds() {
    console.log(this.GetFundURL("ZAG"));
    request(this.GetFundURL("ZAG"), { json: true }, (err, res, body) => {
      if (err || body["Error Message"] != undefined) {
        return console.log("Error" + err);
      }
      console.log(body);
      let fundData = body["Time Series (60min)"];
      let firstEntryKey = Object.keys(body["Time Series (60min)"]);
      let priceData = fundData[firstEntryKey[0]];
      let closePrice = priceData["4. close"];
      var ref = db.ref("/Funds").set({
        symbol: "ZAG",
        price: closePrice
      });
      console.log("Fund data received");
    });
  }
}

const fundSync = new FundSyncService();
fundSync.GetFunds();
