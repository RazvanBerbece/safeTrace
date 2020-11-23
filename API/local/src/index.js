/** ------------------- REQUIRES ------------------- */
require('dotenv').config();

const express = require('express');

const app = express();
const port = 5001;

const bodyParser = require('body-parser');
const cors = require('cors');

const https = require('https');

const fs = require('fs');

const AuthImport = require('./FirebaseLogic/Auth/auth');
const LocationHandlerImport = require('./FirebaseLogic/Location/locationHandler');

/** ------------------- APP INIT & PARSERS ------------------- */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/** ------------------- CONSTS & OTHERS ------------------- */
/**
 * Status Codes :
 * 200 = success response
 * 500 = server err response
 * 400 = client err response
 * 100 = info response
 */
const StatusCodes = {
    SUCCESS: 200,
    SERVER_ERR: 500,
    CLIENT_ERR: 400,
    INFO: 100
};

const Transactions = { // represents the various actions that a user can do
    CHECK_AVAILABILITY: 0,
    SIGN_UP: 1,
    SIGN_IN: 2,
    DELETE_ACC: 3,
    UPLOAD_LOC: 4, // change in location for a user
    UPLOAD_BUSINESS_AREA: 5 // business owner crowd sources a business location
};

/** ------------------- FIREBASE GLOBAL INIT ------------------- */
const firebase = require('firebase');
const { resolve } = require('path');
const { send } = require('process');
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "safetrace-65eb5.firebaseapp.com",
    databaseURL: "https://safetrace-65eb5.firebaseio.com",
    projectId: "safetrace-65eb5",
    storageBucket: "safetrace-65eb5.appspot.com",
    messagingSenderId: "1056305402171",
    appId: "1:1056305402171:web:dbac87e8493282ea74671e",
    measurementId: "G-6TBNVBR1D8"
  };
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

/** ------------------- CRUD ------------------- */

app.get('/', (req, res) => { // Handles the serve availability check
    res.status(StatusCodes.INFO).json({
        "transactionID": Transactions.CHECK_AVAILABILITY,
        "data": {
            "activity": `true`
        }
    });
});

app.post('/signin', (req, res) => { // Handles a sign in POST call
    
    const email = req.body.email;
    const pass = req.body.pass;

    const Authenticator = new AuthImport(firebase);
    const signIn = (email, pass) => {
        return new Promise((resolve, reject) => {
            Authenticator.signIn([email, pass], (user, err) => {
                if (err) { // no user returned means that signUp failed
                    return reject(err);
                }
                // success
                resolve(user);
            });
        })
    }

    signIn(email, pass)
    .then((user) => {
        res.status(StatusCodes.SUCCESS).json({
            "transactionID": Transactions.SIGN_IN,
            "data": {
                "uid": `${user[0]}`,
                "email": `${user[1]}`,
                "location": user[2]
            }
        });
    })
    .catch((err) => {
        // console.log(err);
        res.status(StatusCodes.SERVER_ERR).json({
            "transactionID": Transactions.SIGN_IN,
            "data": {
                "err": `${{"errCode": err[0], "errMsg": err[1]}}`
            }
        });
    })

});

app.post('/signup', (req, res) => { // Handles a sign up POST call

    const email = req.body.email;
    const pass = req.body.pass;

    const Authenticator = new AuthImport(firebase);
    const signUp = (email, pass) => {
        return new Promise((resolve, reject) => {
            Authenticator.signUp([email, pass], (user, err) => {
                if (err) { // no user returned means that signUp failed
                    return reject(err);
                }
                // success
                resolve(user);
            });
        })
    }

    signUp(email, pass)
    .then((user) => {
        res.status(StatusCodes.SUCCESS).json({
            "transcationID": Transactions.SIGN_UP,
            "data": {
                "uid": `${user[0]}`,
                "email": `${user[1]}`,
                "location": user[2]
            }
        });
    })
    .catch((err) => {
        // console.log(err);
        res.status(StatusCodes.SERVER_ERR).json({
            "transcationID": Transactions.SIGN_UP,
            "data": {
                "err": `${{"errCode": err[0], "errMsg": err[1]}}`
            }
        });
    })

});

app.post('/savelocation', (req, res) => { // Handles a location POST call

    const longitude = req.body.longitude;
    const latitude = req.body.latitude;
    const uid = req.body.uid;

    const locationHandler = new LocationHandlerImport([longitude, latitude], firebase, uid); // last param should be the user
    const uploadLocationMetrics = () => {
        return new Promise((resolve, reject) => {
            locationHandler.uploadLocationMetrics((counter, sendAlert, failed) => {
                if (failed) { // no user returned means that signUp failed
                    return reject(failed);
                }
                // success
                resolve(counter, sendAlert);
            });
        })
    }

    uploadLocationMetrics()
    .then((counter, sendAlert) => {
        console.log(`Main thread : ${sendAlert}`)
        // send info response
        res.status(StatusCodes.SUCCESS).json({
            "transcationID": Transactions.UPLOAD_LOC,
            "data": {
                "counter": `${counter}`,
                "alert": sendAlert ? 1 : 0
            }
        });        
    }) 
    .catch((failed) => {
        // send err response
        res.status(StatusCodes.SERVER_ERR).json({
            "transcationID": Transactions.UPLOAD_LOC,
            "data": {
                "err": '-1'
            }
        });        
    })

});

/** ------------------- HTTPS SERVER INIT ------------------- */
/*
const options = {
    key: fs.readFileSync('./Certificates/selfsigned.key'),
    cert: fs.readFileSync('./Certificates/selfsigned.crt')
};
var server = https.createServer(options, app);
*/

/** ------------------- LISTENER ------------------- */
/*
server.listen(port, () => {
    console.log(`Server listening on ${port} ...`);
});
*/
app.listen(port, () => {
    console.log(`Server listening on ${port} ...`);
});