import { IFund } from '../Interfaces/IFund';

export class Fund implements IFund {
  constructor(symbol: string) {
    this.Symbol = symbol;
  }

  public static StoreName: 'System/Fund';

  public Symbol: string;
  public Name: string;
  public Quote: number;
  public QuoteDate: Date;
  public FailedCount: number;
  public FailedReasons: Array<string>;
}
