import { IFund } from "../Interfaces/IFund";

export class Fund implements IFund {
  constructor(symbol: string) {
    this.Symbol = symbol;
  }

  public static StoreName: "Fund";

  public Symbol: string;
  public Name: string;
  public Price: number;
  public QuoteDate: Date;
}
