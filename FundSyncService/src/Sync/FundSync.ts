import * as request from 'request';

import { Logger } from '../Logging/Logger';
import { Fund } from '../Model/Fund';
import { resolve, TIMEOUT } from 'dns';
import { SymbolSync } from '../Sync/SymbolSync';
// import { constants } from "os";
import * as Constants from '../app/Constants';
import { FundRepository } from '..//Repository/FundRepository';
import { sleep } from '../Helper/Sleeper';

export class FundSync {
  private log = new Logger();
  private FailedFundSyncs: string[];
  private SyncStartTime: number;
  private fundRepo: FundRepository;

  constructor() {
  this.fundRepo = new FundRepository();
  this.SyncStartTime = Date.now();
  this.log.Information(Date.now() + Constants.Messages.Started);
}

  async synchronizeFunds() {
    const fundList = this.fundRepo.getAllFundsFromDatabase();
    fundList
			.once('value')
			.then(snapshot => {
  this.ProcessFundQuery(snapshot.child(Constants.Firebase.fundTableName));
})
			.then(() => {
  this.log.Success('Sync Time:' + (Date.now() - this.SyncStartTime) + Constants.Miscellaneous.Milliseconds);
  this.ProcessFailedSyncs();
})
			.catch(function (error) {
  this.log.Error(Constants.Errors.Sync + error);
});
  }

  async ProcessFundRecord(fundRecord) {
    this.GetFundData(fundRecord[Constants.Firebase.fundSymbolColumn])
			.then(
				function (fundData) {
  this.SaveFundData(fundData)
						.then(
							function (saveData) {
  this.log.Success(Constants.Messages.FundUpdated);
}.bind(this),
					)
						.catch(function (error) {
  this.log.Error(
								Constants.Errors.SaveRecord + fundData[Constants.Firebase.fundSymbolColumn] + ' ' + error,
							);
});
}.bind(this),
		)
			.catch(function (error) {
  this.FailedFundSyncs.push(fundRecord[Constants.Firebase.fundSymbolColumn]);
  this.log.Error(error);
});
  }

  sleeper(ms) {
    return function (x) {
      return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
  }

  async ProcessFundQuery(FundSnapshot: admin.database.DataSnapshot) {
    const childKey = FundSnapshot.key;
    const childData = FundSnapshot.val();
    const childDataKeys = Object.keys(childData);
    for (const fundKey of childDataKeys) {
      this.log.Information(Constants.Firebase.query + fundKey);
      const fundRecord = childData[fundKey];
      await this.ProcessFundRecord(fundRecord)
				.then(function () {
  this.log.Success('ProcessFunQuery success for: ' + fundKey);
})
				.catch(function () {
  this.log.Error('ProcessFundQuery Failed for: ' + fundKey);
});
      await sleep(Constants.FundQuery.QueryDelay);
    }
  }

  ProcessFailedSyncs() {
    this.log.Information('Processing Failed Queries...');
  }

  async GetFundData(FundSymbol): Promise<Fund> {
    return new Promise<Fund>((resolve, reject) => {
      this.log.Information(Constants.FundQuery.GetFundURL(FundSymbol));
      request(Constants.FundQuery.GetFundURL(FundSymbol), { json: true }, (err, res, body) => {
        if (
					err ||
					body === undefined ||
					body[Constants.FundQuery.ErrorProperty] ||
					body[Constants.FundQuery.TimeSeriesProperty] === false
				) {
          if (err) {
            this.log.Error(err);
          }
          if (body) {
            this.log.Error(body);
          }
          this.log.Error('Error Getting Symbol: ' + FundSymbol + ' ' + err);
          reject('Error: ' + err);
        } else {
          this.log.Success('Fund data received');
          this.log.Information(body);
          const fundData = body[Constants.FundQuery.TimeSeriesProperty];
          const firstEntryKey = Object.keys(body[Constants.FundQuery.TimeSeriesProperty]);
          const priceDate = firstEntryKey[0];
          const closePrice = fundData[firstEntryKey[0]][Constants.FundQuery.ClosingPriceProperty];

          const newFundQuote: Fund = new Fund(FundSymbol);
          newFundQuote.Price = closePrice;
          newFundQuote.QuoteDate = new Date(priceDate);

          console.log(newFundQuote);
          resolve(newFundQuote);
        }
      });
    });
  }
}
