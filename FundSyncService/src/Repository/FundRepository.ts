import * as admin from 'firebase-admin';
import { Fund } from '../Model/Fund';
import { SoftSpudFirebase } from './firebase';
import { Logger } from '../Logging/Logger';

export class FundRepository {
  private database: admin.database.Database;
  private log: Logger;

  public constructor(log: Logger) {
    this.database = SoftSpudFirebase.Instance.Database;
    this.log = log;
  }

  public getAllFundsFromDatabase(): admin.database.Reference {
    return this.database.ref(Fund.StoreName);
  }

  public updateFund(fund: Fund) {
    this.database.ref('System/Funds/' + fund.Symbol).update({
      Symbol: fund.Symbol,
      Name: fund.Name,
    }).catch((err) => {
      this.log.Error('Error updating fund in firebase. Symbol: ' + fund.Symbol + ' error: ' + err);
    });
  }

  public async incrementSyncError(fundSymbol: string) {
    const ref = this.getFundRef(fundSymbol);
    ref.child('FailedCount').transaction((currentFailedCount) => {
      return currentFailedCount + 1;
    });
  }

  public getFundRef(fundSymbol: string):admin.database.Reference {
    const ref = this.database.ref('System/Funds/' + fundSymbol);
    return ref;
  }

  public async updateFundQuote(fundQuote: Fund): Promise<void> {
    const ref = this.database.ref('System/Funds/' + fundQuote.Symbol);
    return ref.update(
      {
        FailedCount: 0,
        Quote: fundQuote.Quote,
        QuoteDate: fundQuote.QuoteDate,
      },
      (error) => {
        if (error) {
          this.log.Error('Data could not be saved.' + error);
        } else {
          this.log.Success('Data saved successfully.');
        }
      },
    ).catch((err) => {
      this.log.Error(
      'Error updating fund quote in firebase. Symbol: '
      + fundQuote.Symbol + ' error: ' + err,
      );
    });
  }
}
