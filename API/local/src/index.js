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
    SIGN_UP: 1,
    SIGN_IN: 2,
    DELETE_ACC: 3,
    UPLOAD_LOC: 4, // change in location for a user
    UPLOAD_BUSINESS_AREA: 5 // business owner crowd sources a business location
};

/** ------------------- CRUD ------------------- */

app.get('/', (req, res) => { // Handles the serve availability check
    res.status(StatusCodes.SUCCESS).json({"value": "listening"});
});

app.post('/signin', (req, res) => { // Handles a sign in POST call
    
    const email = req.body.email;
    const pass = req.body.pass;

    const Authenticator = new AuthImport(process.env.FIREBASE_API_KEY);
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
                "email": `${user.email}`
            }
        });
    })
    .catch((err) => {
        // console.log(err);
        res.status(StatusCodes.SERVER_ERR).json({
            "transactionID": Transactions.SIGN_IN,
            "data": {
                "errCode": `${err[0]}`,
                "errMsg": `${err[1]}`
            }
        });
    })

});

app.post('/signup', (req, res) => { // Handles a sign up POST call

    const email = req.body.email;
    const pass = req.body.pass;

    const Authenticator = new AuthImport(process.env.FIREBASE_API_KEY);
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
                "email": `${user.email}`
            }
        });
    })
    .catch((err) => {
        // console.log(err);
        res.status(StatusCodes.SERVER_ERR).json({
            "transcationID": Transactions.SIGN_UP,
            "data": {
                "errCode": `${err[0]}`,
                "errMsg": `${err[1]}`
            }
        });
    })

});

/** ------------------- HTTPS SERVER INIT ------------------- */
const options = {
    key: fs.readFileSync('./Certificates/selfsigned.key'),
    cert: fs.readFileSync('./Certificates/selfsigned.crt')
};
var server = https.createServer(options, app);

/** ------------------- LISTENER ------------------- */
server.listen(port, () => {
    console.log(`Server listening on ${port} ...`);
});