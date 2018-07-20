import * as admin from 'firebase-admin';
import * as Constants from '../app/Constants';

export class SoftSpudFirebase {
  private static instance: SoftSpudFirebase;
  private database: admin.database.Database;
  private serviceAccount = require(Constants.Firebase.firebaseSDKAdminFile);

  get Database() {
    return this.database;
  }

  private constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(this.serviceAccount),
      databaseURL: Constants.Firebase.firebaseURL,
    });

    this.database = admin.database();
  }

  public static get Instance() {
    return this.instance || (this.instance = new this());
  }

}
