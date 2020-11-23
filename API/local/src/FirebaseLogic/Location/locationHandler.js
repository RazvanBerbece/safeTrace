/**
 * This module handles the location tracking component
 *  - saving to database
 *  - checking nearby locations
 *  - connects to the server response
 */

const LocationAnalysis = require('./locationAnalysis');

 require('./locationAnalysis');

 class LocationHandler {

    /**
     * Configures the Firebase config dictionary so the server can use those functionalities
     * @param {[double, double]} location -> current location which has to be posted (longitude, latitude)
     * @param {Obj} fbRef -> Firebase Ref
     * @param {string} uid -> Current user uid
     */
    constructor(location, fbRef, uid) {
        this.location = location;
        this.uid = uid;
        this.firebase = fbRef;
        this.sendAlert = false;
    }

    /**
     * Saves current user to a 
     * given location reference in the database
     */
    uploadLocationMetrics(callback) {

        var failed = false;

        const refCoordinateLink = this.location;
        refCoordinateLink[0] = refCoordinateLink[0].toString().replace('.', '');
        refCoordinateLink[1] = refCoordinateLink[1].toString().replace('.', '');

        var database = this.firebase.database();
        var locationsUsersRef = database.ref('locations/' + `${refCoordinateLink[0]}` + `${refCoordinateLink[1]}` + '/users');
        locationsUsersRef.push({
            uid: this.uid,
            risk: false
        });
        var locationsAlertRef = database.ref('locations/' + `${refCoordinateLink[0]}` + `${refCoordinateLink[1]}` + '/alert');
        locationsAlertRef.set({
            alert: false
        });

        const getLocationMetrics = () => {
            return new Promise((resolve, reject) => {
                this.getLocationMetrics((data) => {
                    if (!data) { // no user returned means that signUp failed
                        return reject(failed);
                    }
                    // success
                    resolve(data);
                });
            })
        }
        const countUsers = (data) => {
            return new Promise((resolve, reject) => {
                const analyser = new LocationAnalysis(data);
                analyser.countUsers((result) => {
                    if (!result) { // no user returned means that signUp failed
                        return reject(result);
                    }
                    // success
                    resolve(result);
                });
            })
        }

        getLocationMetrics()
        .then((data) => {
            countUsers(data)
            .then((result) => {
                callback(result[0], result[1], false); 
            })
            .catch((result) => {
                failed = true;
                callback(-1, false, true); 
            })
        })
        .catch(() => {
            failed = true;
            callback(-1, false, true); 
        })

    }

    /**
     * Gets user sent location from Firebase Realtime Database
     * returns the data (index has to check it for errs)
     */
    getLocationMetrics(callback) {
        var database = this.firebase.database();
        var locationRef = database.ref('locations/' + `${this.location[0]}` + `${this.location[1]}`);
        locationRef.on('value', (snapshot) => {
            const data = snapshot.val();
            callback(data);
        })
    }

 }

 module.exports = LocationHandler;