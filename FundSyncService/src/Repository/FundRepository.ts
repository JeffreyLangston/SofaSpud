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
    this.database.ref(Fund.StoreName + '/' + fund.Symbol).update({
      Symbol: fund.Symbol,
      Name: fund.Name,
    }).catch((err) => {
      this.log.Error('Error updating fund in firebase. Symbol: ' + fund.Symbol + ' error: ' + err);
    });
  }

  public async updateFundQuote(fundQuote: Fund): Promise<void> {
    const ref = this.database.ref(Fund.StoreName);
    return ref.update(
      {
        [fundQuote.Symbol]: fundQuote,
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
