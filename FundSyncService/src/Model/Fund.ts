export class Fund {
	constructor(symbol: string, name: string) {
		this.Symbol = symbol;
		this.Name = name;
	}

	public StoreName: "Fund";
	public Symbol: string;
	public Name: string;
}