import Rebase from "re-base";
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDtJRrmqm7CdeDd8FNV8PJ5YNSJYY8LpHU",
    authDomain: "sofaspuddev.firebaseapp.com",
    databaseURL: "https://sofaspuddev.firebaseio.com",
    projectId: "sofaspuddev",
    storageBucket: "sofaspuddev.appspot.com",
    messagingSenderId: "403314461317"
});

const base = Rebase.createClass(firebaseApp.database());

// This is a named export
export { firebaseApp };

// this is a default export
export {base};
