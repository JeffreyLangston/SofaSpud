"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FundQuery {
    static GetFundURL(fundSymbol) {
        return `https://www.alphavantage.co/query?function=${this.FundUrlFunction}&symbol=${fundSymbol}&interval=${this.QueryFrequency}&outputsize=${this.outputSize}&apikey=${this.ApiKey}`;
    }
}
FundQuery.FundUrlFunction = 'TIME_SERIES_INTRADAY';
FundQuery.QueryFrequency = '60min';
FundQuery.outputSize = 'full';
FundQuery.ApiKey = 'Q2I2J8MN4GGIRIZI';
FundQuery.QueryDelay = 3500;
FundQuery.ErrorProperty = 'Error Message';
FundQuery.TimeSeriesProperty = 'Time Series (60min)';
FundQuery.ClosingPriceProperty = '4. close';
exports.FundQuery = FundQuery;
class Miscellaneous {
}
Miscellaneous.Milliseconds = 'milliseconds ';
exports.Miscellaneous = Miscellaneous;
class Firebase {
}
Firebase.query = 'query for ';
Firebase.firebaseURL = 'https://sofaspuddev.firebaseio.com';
Firebase.firebaseSDKAdminFile = '../API/sofaspuddev-firebase-adminsdk-00jxe-e314820134.json';
Firebase.fundTableName = 'System/Funds/';
Firebase.fundSymbolColumn = 'Symbol';
exports.Firebase = Firebase;
class Messages {
}
Messages.Started = 'Fund Sync Started...';
Messages.ApplicationWelcome = 'Welcome to Sofa Spud Fund Sync Service!';
Messages.ExitApp = 'Exiting Application. Thank you!';
Messages.FundUpdated = 'Fund quote updated!';
exports.Messages = Messages;
class Errors {
}
Errors.SaveRecord = 'Error Saving Record: ';
exports.Errors = Errors;
//# sourceMappingURL=Constants.js.map