export class FundQuery {

	public static FundUrlFunction: string = "TIME_SERIES_INTRADAY";
	public static QueryFrequency: string = "60min";
	public static outputSize: string = "full";
	public static ApiKey: string = "Q2I2J8MN4GGIRIZI";

	public static GetFundURL(fundSymbol): string {
		return `https://www.alphavantage.co/query?function=${this.FundUrlFunction}&symbol=${fundSymbol}&interval=${this.QueryFrequency}&outputsize=${this.outputSize}&apikey=${this.ApiKey}`;
	}

}

export class firebase {
	public static firebaseURL: string = "https://sofaspuddev.firebaseio.com";
	public static firebaseSDKAdminFile: string = "c:/sofaspuddev-firebase-adminsdk-00jxe-e314820134.json";
}

export class Messages {
	public static Started = "Fund Sync Started...";

}

