/**
 * This module handles the location tracking component
 *  - saving to database
 *  - checking nearby locations
 *  - connects to the server response
 */

 class LocationHandler {

    /**
     * Configures the Firebase config dictionary so the server can use those functionalities
     * @param {[string, string]} location -> current location which has to be posted (longitude, latitude)
     * @param {Obj} fbRef -> Firebase Ref
     * @param {string} uid -> Current user uid
     */
    constructor(location, fbRef, uid) {
        this.location = location;
        this.uid = uid;
        this.firebase = fbRef;
    }

    /**
     * Saves user sent location to Firebase Realtime Database
     * returns saved location
     */
    saveLocation(callback) {
        var database = this.firebase.database();
        database.ref('users/' + this.uid).set({
            location: {
                longitude: this.location[0],
                latitude: this.location[1]
            }
        });
        callback(); 
    }

    /**
     * Gets user sent location from Firebase Realtime Database
     * returns the data (index has to check it for errs)
     */
    getLocation(callback) {
        var database = this.firebase.database();
        var locationRef = database.ref('users/' + this.uid + '/location');
        locationRef.on('value', (snapshot) => {
            const data = snapshot.val();
            console.log(data);
            callback(data);
        })
    }

 }

 module.exports = LocationHandler;