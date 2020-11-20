/**
 *  This submodule of safeTrace handles the auth functionality of the app
 */
require('firebase/auth');

class Authenticator {

    /**
     * Configures the Firebase config dictionary so the server can use those functionalities
     * @param {*} key -> Firebase API key
     */
    constructor(key) {
        this.firebase = require('firebase');
        this.firebaseConfig = {
            apiKey: key,
            authDomain: "safetrace-65eb5.firebaseapp.com",
            databaseURL: "https://safetrace-65eb5.firebaseio.com",
            projectId: "safetrace-65eb5",
            storageBucket: "safetrace-65eb5.appspot.com",
            messagingSenderId: "1056305402171",
            appId: "1:1056305402171:web:dbac87e8493282ea74671e",
            measurementId: "G-6TBNVBR1D8"
          };
        /** Init Firebase App */
        if (!this.firebase.apps.length) {
            this.firebase.initializeApp(this.firebaseConfig);
         }
    }

    /**
     * Handles signing up on the Firebase Auth platform
     * @param {*} data -> array with two elements : data[0] = email, data[1] = pass
     * @param {*} callback -> ?
     */
    signUp(data, callback) {
        this.firebase.auth().createUserWithEmailAndPassword(data[0], data[1]) // if the user is successfully created, signIn() happens
        .then((user) => {
            // Account created successfully
            console.log(user);
            callback(user, null);
        })
        .catch((err) => {
            var errCode = err.code;
            var errMsg = err.message;
            const errors = [errCode, errMsg];
            callback(null, errors);
        })
    }

}

module.exports = Authenticator;