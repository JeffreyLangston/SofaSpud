"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const Constants = require("../app/Constants");
class SoftSpudFirebase {
    constructor() {
        this.serviceAccount = require(Constants.Firebase.firebaseSDKAdminFile);
        admin.initializeApp({
            credential: admin.credential.cert(this.serviceAccount),
            databaseURL: Constants.Firebase.firebaseURL,
        });
        this.database = admin.database();
    }
    get Database() {
        return this.database;
    }
    static get Instance() {
        return this.instance || (this.instance = new this());
    }
}
exports.SoftSpudFirebase = SoftSpudFirebase;
//# sourceMappingURL=firebase.js.map