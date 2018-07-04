import * as request from 'request';
import { Logger } from '../Logging/Logger';
import { Fund } from '../Model/Fund';
import * as admin from 'firebase-admin';
import * as Constants from '../app/Constants';
import { FundRepository } from '..//Repository/FundRepository';
import { sleep } from '../Helper/Sleeper';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';
import { SymbolSync } from './SymbolSync';
import { isNull } from 'util';
import * as moment from 'moment';

export class FundQuoteSync {
  private log: Logger;
  private failedFundSyncs: string[];
  private syncStartTime: moment.Moment;
  private fundRepo: FundRepository;

  constructor(log: Logger) {
    this.log = log;
    this.fundRepo = new FundRepository(this.log);
    this.syncStartTime = moment();
    this.log.Information((this.syncStartTime) + Constants.Messages.Started);
    this.failedFundSyncs = [];
  }

  async synchronizeFunds() {
    const fundList = this.fundRepo.getAllFundsFromDatabase();
    const snapshot = await fundList.once('value');

        // if snapshot is null populate database and sync fund symbols.
    if (snapshot &&
           snapshot.hasChild(Constants.Firebase.fundTableName)
          ) {
      this.processFundSnapshot(snapshot);
    }else {
          // we have no funds in the database.
      const symbolSync: SymbolSync = new SymbolSync(this.log);
      symbolSync.syncTrackedFundSymbols();
      this.processFundSnapshot(snapshot);
    }

      // .catch((error) => {
      //  this.log.Error('Error running Synchronize Funds: ' + error);
      // });
  }

  async processFundSnapshot(snapshot:any) {
    await this.processFundQuery(snapshot.child(Constants.Firebase.fundTableName))
    .then(() => {
      const now = moment();
      const timeToComplete = now.to(this.syncStartTime);
      // Write Completed sync time to database.
      this.log.Success('Sync Time:' + timeToComplete + Constants.Miscellaneous.Milliseconds);
      this.processFailedSyncs();
    })
    .catch((error) => {
      this.log.Error('Error running Synchronize Funds Process: ' + error);
    });
  }

  async processFundRecord(fundSymbol: string) {
    await this.getFundData(fundSymbol)
      .then(
       async (fundData) => {
         await this.fundRepo.updateFundQuote(fundData)
            .then(
              (saveData) => {
                this.log.Success(Constants.Messages.FundUpdated);
              },
          )
            .catch((error) => {
              this.log.Error(
                'Error Saving Record: '
                + fundData[Constants.Firebase.fundSymbolColumn] + ' ' + error,
              );
            });
       })
      .catch((error) => {
        this.fundRepo.incrementSyncError(fundSymbol);
        this.failedFundSyncs.push(fundSymbol);
        this.log.Error(error);
      });
  }

  async processFundQuery(fundSnapshot: admin.database.DataSnapshot) {
    const childKey = fundSnapshot.key;
    const childData = fundSnapshot.val();
    const childDataKeys = Object.keys(childData);
    for (const fundKey of childDataKeys) {
      this.log.Information(Constants.Firebase.query + fundKey);
      const fundRecord: Fund = childData[fundKey];
      await this.processFundRecord(fundRecord.Symbol)
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
    this.failedFundSyncs.forEach((fund) => {
      this.processFundRecord(fund);
    });
  }

  async; getFundData(fundSymbol) : Promise < Fund > {
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
            this.log.Error(JSON.stringify(body));
          }
          if (res) {
            this.log.Error(JSON.stringify(res));
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
          newFundQuote.Quote = closePrice;
          newFundQuote.QuoteDate = new Date(priceDate);

          console.log(newFundQuote);
          resolve(newFundQuote);
        }
      });
    });
  }
}
