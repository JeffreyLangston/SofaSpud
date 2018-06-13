export class FundQuery {

  public static FundUrlFunction: string = 'TIME_SERIES_INTRADAY';
  public static QueryFrequency: string = '60min';
  public static outputSize: string = 'full';
  public static ApiKey: string = 'Q2I2J8MN4GGIRIZI';
  public static QueryDelay: number = 1000;
  public static GetFundURL(fundSymbol): string {
    return `https://www.alphavantage.co/query?function=${this.FundUrlFunction}&symbol=${fundSymbol}&interval=${this.QueryFrequency}&outputsize=${this.outputSize}&apikey=${this.ApiKey}`;
  }
  public static ErrorProperty: string = 'Error Message';
  public static TimeSeriesProperty: string = 'Time Series (60min)';
  public static ClosingPriceProperty: string = '4. close';
}

export class Miscellaneous {
  public static Milliseconds: string = 'milliseconds ';
}

export class Firebase {
  public static query: string = 'query for ';
  public static firebaseURL: string = 'https://sofaspuddev.firebaseio.com';
  public static firebaseSDKAdminFile: string = 'c:/sofaspuddev-firebase-adminsdk-00jxe-e314820134.json';
  public static fundTableName: string = 'Funds';
  public static fundSymbolColumn: string = 'Symbol';
}

export class Messages {
  public static Started: string = 'Fund Sync Started...';
  public static ApplicationWelcome: string = 'Welcome to Sofa Spud Fund Sync Service!';
  public static ExitApp: string = 'Exiting Application. Thank you!';
  public static FundUpdated: string = 'Fund quote updated!';
}

export class Errors {
  public static Sync: string = 'Error running Synchronize Funds: ';
  public static SaveRecord: string = 'Error Saving Record: ';
}
