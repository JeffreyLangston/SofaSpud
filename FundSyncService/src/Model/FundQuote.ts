export class FundQuote {
	constructor(symbol: string, price: number, date: Date) {
		this.Symbol = symbol;
		this.Price = price;
		this.Date = date;
	}

	public StoreName: "FundQuote";
	public Symbol: string;
	public Price: number;
	public Date: Date;
}