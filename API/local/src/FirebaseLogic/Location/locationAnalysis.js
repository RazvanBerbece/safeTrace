/**
 * This module does a local analysis of the given coordinates
 *  - checks neighbouring coordinates
 *  - counts users within limits
 *  - connects to the server response
 */

 class LocationAnalysis {

    constructor(data) {
        this.data = data;
        this.counter = 0;
    }

    countUsers(callback) {
        var _self = this;
        Object.keys(this.data.users).forEach(function(key) {
            _self.counter = _self.counter + 1;
        });
        callback([_self.counter, _self.checkCrowdedLevel]);
    }

    get checkCrowdedLevel() {
        return this.counter > 10 ? 1 : 0
    }

    /**
     * TODO : CHECK FOR ALL USERS IN LOCATIONS IF A RISK FACTOR IS NEARBY
     */

 }

 module.exports = LocationAnalysis;