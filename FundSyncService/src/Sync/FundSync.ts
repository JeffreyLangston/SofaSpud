import * as request from 'request';
import { Logger } from '../Logging/Logger';
import { Fund } from '../Model/Fund';
import * as admin from 'firebase-admin';
import * as Constants from '../app/Constants';
import { FundRepository } from '..//Repository/FundRepository';
import { sleep } from '../Helper/Sleeper';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

export class FundSync {
  private log: Logger;
  private failedFundSyncs: string[];
  private syncStartTime: number;
  private fundRepo: FundRepository;

  constructor(log: Logger) {
    this.log = log;
    this.fundRepo = new FundRepository(this.log);
    this.syncStartTime = Date.now();
    this.log.Information((Date.now()) + Constants.Messages.Started);
    this.failedFundSyncs = [];
  }

  async synchronizeFunds() {
    const fundList = this.fundRepo.getAllFundsFromDatabase();
    fundList
      .once('value')
      .then((snapshot) => {
        this.processFundQuery(snapshot.child(Constants.Firebase.fundTableName))
        .then(() => {
          const timeToComplete = (Date.now() - this.syncStartTime);
          this.log.Success('Sync Time:' + timeToComplete + Constants.Miscellaneous.Milliseconds);
          this.processFailedSyncs();
        })
        .catch((error) => {
          this.log.Error(Constants.Errors.Sync + error);
        });
      })
      .catch((error) => {
        this.log.Error(Constants.Errors.Sync + error);
      });
  }

  async processFundRecord(fundRecord) {
    this.getFundData(fundRecord[Constants.Firebase.fundSymbolColumn])
      .then(
        (fundData) => {
          this.fundRepo.updateFundQuote(fundData)
            .then(
              (saveData) => {
                this.log.Success(Constants.Messages.FundUpdated);
              },
          )
            .catch((error) => {
              this.log.Error(
                Constants.Errors.SaveRecord
                + fundData[Constants.Firebase.fundSymbolColumn] + ' ' + error,
              );
            });
        })
      .catch((error) => {
        this.failedFundSyncs.push(fundRecord[Constants.Firebase.fundSymbolColumn]);
        this.log.Error(error);
      });
  }

  async processFundQuery(fundSnapshot: admin.database.DataSnapshot) {
    const childKey = fundSnapshot.key;
    const childData = fundSnapshot.val();
    const childDataKeys = Object.keys(childData);
    for (const fundKey of childDataKeys) {
      this.log.Information(Constants.Firebase.query + fundKey);
      const fundRecord = childData[fundKey];
      await this.processFundRecord(fundRecord)
        .then(() => {
          this.log.Success('ProcessFunQuery success for: ' + fundKey);
        })
        .catch(() => {
          this.log.Error('ProcessFundQuery Failed for: ' + fundKey);
        });
      this.log.System('waiting...');
      await sleep(Constants.FundQuery.QueryDelay).catch(() => {
        this.log.Error('error using sleep function');
      });
      this.log.System('done waiting...');
    }
  }

  processFailedSyncs() {
    this.log.Information('Failed sync count: ' + this.failedFundSyncs.length);
    this.log.Information('Processing Failed Queries...');
  }

  async getFundData(fundSymbol): Promise<Fund> {
    return new Promise<Fund>((resolve, reject) => {
      this.log.Information(Constants.FundQuery.GetFundURL(fundSymbol));
      request(Constants.FundQuery.GetFundURL(fundSymbol), { json: true }, (err, res, body) => {
        if (
          err ||
          body === undefined ||
          body[Constants.FundQuery.ErrorProperty] ||
          !body[Constants.FundQuery.TimeSeriesProperty]
        ) {
          if (err) {
            this.log.Error(err);
          }
          if (body) {
            this.log.Error(body);
          }
          if (res) {
            this.log.Error(res);
          }
          this.log.Error('Error Getting Symbol: ' + fundSymbol + ' ' + err);
          reject('Error: ' + err);
        } else {
          this.log.Success('Fund data received');
          this.log.Information(body);
          const fundData = body[Constants.FundQuery.TimeSeriesProperty];

          const firstEntryKey = Object.keys(body[Constants.FundQuery.TimeSeriesProperty]);
          const priceDate = firstEntryKey[0];
          const closePrice = fundData[firstEntryKey[0]][Constants.FundQuery.ClosingPriceProperty];

          const newFundQuote: Fund = new Fund(fundSymbol);
          newFundQuote.Price = closePrice;
          newFundQuote.QuoteDate = new Date(priceDate);

          console.log(newFundQuote);
          resolve(newFundQuote);
        }
      });
    });
  }
}
