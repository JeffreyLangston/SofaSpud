import * as request from 'request';
import * as admin from 'firebase-admin';
import { Logger } from '../Logging/Logger';
import { Fund } from '../Model/Fund';
import { resolve, TIMEOUT } from 'dns';
import { SymbolSync } from '../Sync/SymbolSync';
// import { constants } from "os";
import * as Constants from '../app/Constants';
import { SoftSpudFirebase } from './firebase';

export class FundRepository {
  private database: admin.database.Database;

  public constructor() {
    this.database = SoftSpudFirebase.Instance.Database;
  }

  public getAllFundsFromDatabase(): admin.database.Reference {
    return this.database.ref(Fund.StoreName);
  }

  public updateFund(fund: Fund) {
    this.database.ref(Fund.StoreName + '/' + fund.Symbol).update({
      Symbol: fund.Symbol,
      Name: fund.Name,
    });
  }

  public async updateFundQuote(fundQuote: Fund): Promise<void> {
    const ref = this.database.ref(Fund.StoreName);
    return ref.update(
      {
        [fundQuote.Symbol]: fundQuote,
      },
      function (error) {
        if (error) {
          this.log.Error('Data could not be saved.' + error);
        } else {
          this.log.Success('Data saved successfully.');
        }
      },
    );
  }
}
