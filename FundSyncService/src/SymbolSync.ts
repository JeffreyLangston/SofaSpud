import { fundData, fundList } from './Model/FundList'
import * as fs from 'fs';
import * as path from 'path';
import { resolve } from 'url';
import { Observable } from 'rxjs'


export class SymbolSync {
	constructor() { }

	SyncTrackedFundSymbols() {
		this.getFundList().then(function (fundList) {
			fundList.funds.forEach(fund => {

			});
		}).catch(function (error) {
			console.log(error);
		});
	}

	getFundList(): Promise<fundList> {

		return new Promise<fundList>((resolve, reject) => {
			console.log(path.resolve(__dirname, "./FundList.json"));
			fs.readFile(path.resolve(__dirname, "./FundList.json"), 'utf8', (err, data) => {
				if (err) {
					reject(err);
				}
				console.log("data: " + data);
				const funds: fundList = JSON.parse(data)
				resolve(funds);
			}
			);
		});

	}

}