/**
 *  This submodule of safeTrace handles the auth functionality of the app
 */
require('firebase/auth');

class Authenticator {

    /**
     * Configures the Firebase config dictionary so the server can use those functionalities
     * @param {Obj} fbRef -> Firebase Ref
     */
    constructor(fbRef) {
        this.firebase = fbRef;
    }

    /**
     * Handles signing up on the Firebase Auth platform
     * @param {[string]} data -> array with two elements : data[0] = email, data[1] = pass
     * @param {callback} callback -> user data or err
     */
    signUp(data, callback) {
        this.firebase.auth().createUserWithEmailAndPassword(data[0], data[1]) // if the user is successfully created, signIn() happens
        .then((user) => {
            // Account created successfully
            callback([user.user.uid, user.user.email, []], null); // user.user holds the UserRecord returned from Firebase
        })
        .catch((err) => {
            var errCode = err.code;
            var errMsg = err.message;
            const errors = [errCode, errMsg];
            callback(null, errors);
        })
    }

        /**
     * Handles signing in on the Firebase Auth platform
     * @param {[string]} data -> array with two elements : data[0] = email, data[1] = pass
     * @param {callback} callback -> user data or err
     */
    signIn(data, callback) {
        this.firebase.auth().signInWithEmailAndPassword(data[0], data[1]) // if the user is successfully created, signIn() happens
        .then((user) => {
            // Sign in successful
            // this should return the current location on sign in (TODO)
            callback([user.user.uid, user.user.email, []], null); // user.user holds the UserRecord returned from Firebase
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