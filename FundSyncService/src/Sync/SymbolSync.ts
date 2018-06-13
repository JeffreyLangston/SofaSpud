import { Fund } from '../Model/Fund';
import * as fs from 'fs';
import * as path from 'path';
import { FundRepository } from '../Repository/FundRepository';
import { Logger } from '../Logging/Logger';

export class SymbolSync {
  private fundListDirectory: string = '../Data/FundList.json';
  private fundRepo: FundRepository;
  private log: Logger;

  constructor(log: Logger) {
    this.log = log;
    this.fundRepo = new FundRepository(log);
  }

  syncTrackedFundSymbols() {
    this.getFundList()
      .then(
        (fundList) => {
          fundList.forEach((fund) => {
            this.fundRepo.updateFund(fund);
          });
        })
      .catch((error) => {
        this.log.Error(error);
      });
  }

  getFundList(): Promise<Fund[]> {
    return new Promise<Fund[]>((resolve, reject) => {
      this.log.Information(path.resolve(__dirname, this.fundListDirectory));
      fs.readFile(
        path.resolve(__dirname, this.fundListDirectory),
        'utf8',
        (err, data) => {
          if (err) {
            reject(err);
          }
          const funds: Fund[] = JSON.parse(data);
          resolve(funds['Funds']);
        },
      );
    });
  }
}
