import * as request from "request";
import * as admin from "firebase-admin";
import { Logger } from "./Logging/Logger";
import { Fund } from "./Model/Fund";
import { resolve, TIMEOUT } from "dns";
import { SymbolSync } from "./Sync/SymbolSync";
import { FundSync } from './Sync/FundSync';


const log = new Logger();
log.System("Fund Sync Service started!");

//FundSymbolSync.SyncTrackedFundSymbols();
//const FundUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=ZAG&interval=60min&outputsize=full&apikey=Q2I2J8MN4GGIRIZI";

const fundSync = new FundSync();
fundSync.SynchronizeFunds().then();
log.System("Fund Sync Service complete!");
