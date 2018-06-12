import { Fund } from '../Model/Fund';
import * as fs from 'fs';
import * as path from 'path';
import { FundRepository } from '../Repository/FundRepository';

export class SymbolSync {
  private fundListDirectory: string = '../Data/FundList.json';
  private fundRepo: FundRepository;
  constructor() {
    this.fundRepo = new FundRepository();
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
        console.log(error);
      });
  }

  getFundList(): Promise<Fund[]> {
    return new Promise<Fund[]>((resolve, reject) => {
      console.log(path.resolve(__dirname, this.fundListDirectory));
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
