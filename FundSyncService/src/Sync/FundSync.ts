import * as request from "request";
import * as admin from "firebase-admin";
import { Logger } from "../Logging/Logger";
import { Fund } from "../Model/Fund";
import { resolve, TIMEOUT } from "dns";
import { SymbolSync } from "../Sync/SymbolSync";
//import { constants } from "os";
import * as Constants from "../app/Constants";


export class FundSync {

	private serviceAccount = require(Constants.firebase.firebaseSDKAdminFile);
	private log = new Logger();
	private FailedFundSyncs: Array<string>;
	private SyncStartTime: number;
	private db: admin.database.Database;

	constructor() {
		admin.initializeApp({
			credential: admin.credential.cert(this.serviceAccount),
			databaseURL: Constants.firebase.firebaseURL
		});

		this.db = admin.database();
		const FundSymbolSync = new SymbolSync(this.db);

		this.SyncStartTime = Date.now();
		this.log.Information(Date.now() + Constants.Messages.Started);
	}

	GetAllFundsFromDatabase(): admin.database.Reference {
		return this.db.ref(Fund.StoreName);
	}

	async ProcessFundRecord(fundRecord) {
		this.GetFundData(fundRecord["Symbol"])
			.then(
				function (fundData) {
					this.SaveFundData(fundData)
						.then(
							function (saveData) {
								this.log.Success("Fund quote updated!");
							}.bind(this)
						)
						.catch(function (error) {
							this.log.Error(
								"Error Saving Record: " + fundData["Symbol"] + " " + error
							);
						});
				}.bind(this)
			)
			.catch(function (error) {
				this.FailedFundSyncs.push(fundRecord["Symbol"]);
				this.log.Error(error);
			});
	}

	sleeper(ms) {
		return function (x) {
			return new Promise(resolve => setTimeout(() => resolve(x), ms));
		};
	}

	async ProcessFundQuery(FundSnapshot: admin.database.DataSnapshot) {
		var childKey = FundSnapshot.key;
		var childData = FundSnapshot.val();
		var childDataKeys = Object.keys(childData);
		for (const fundKey of childDataKeys) {
			this.log.Information("query for " + fundKey);
			const fundRecord = childData[fundKey];
			await this.ProcessFundRecord(fundRecord)
				.then(function () {
					this.log.Success("successful process!");
				})
				.catch(function () {
					this.log.Error("Error processing!");
				});
			await this.sleep(1000);
		}
	}


	async SynchronizeFunds() {
		var fundList = this.GetAllFundsFromDatabase();
		fundList
			.once("value")
			.then(snapshot => {
				this.ProcessFundQuery(snapshot.child("Funds"));
			})
			.then(() => {
				this.log.Success("Sync Time:" + (Date.now() - this.SyncStartTime) + " miliseconds");
				this.ProcessFailedSyncs();
			})
			.catch(function (error) {
				this.log.Error("Error running Syncronize Funds: " + error);
			});
	}

	ProcessFailedSyncs() {
		this.log.Information("Processing Failed Queries...");
	}

	async SaveFundData(FundQuote: Fund): Promise<void> {
		var ref = this.db.ref(Fund.StoreName);
		return ref.update(
			{
				[FundQuote.Symbol]: FundQuote
			},
			function (error) {
				if (error) {
					this.log.Error("Data could not be saved." + error);
				} else {
					this.log.Success("Data saved successfully.");
				}
			}
		);
	}

	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async GetFundData(FundSymbol): Promise<Fund> {
		return new Promise<Fund>((resolve, reject) => {
			this.log.Information(Constants.FundQuery.GetFundURL(FundSymbol));
			request(Constants.FundQuery.GetFundURL(FundSymbol), { json: true }, (err, res, body) => {
				if (
					err ||
					body === undefined ||
					body["Error Message"] ||
					body["Time Series (60min)"] === false
				) {
					if (err) {
						this.log.Error(err);
					}
					if (body) {
						this.log.Error(body);
					}
					this.log.Error("Error Getting Symbol: " + FundSymbol + " " + err);
					reject("Error: " + err);
				} else {
					this.log.Success("Fund data received");
					this.log.Information(body);
					const fundData = body["Time Series (60min)"];
					const firstEntryKey = Object.keys(body["Time Series (60min)"]);
					const priceDate = firstEntryKey[0];
					const closePrice = fundData[firstEntryKey[0]]["4. close"];

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