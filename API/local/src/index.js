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

/** ------------------- CRUD ------------------- */

app.get('/', (req, res) => { // Handles the serve availability check
    res.status(StatusCodes.SUCCESS).json({"value": "listening"});
});

app.post('/signin', (req, res) => { // Handles a sign in POST call
    // TODO
});

app.post('/signup', (req, res) => { // Handles a sign in POST call

    const email = req.body.email;
    const pass = req.body.pass;

    const Authenticator = new AuthImport(process.env.FIREBASE_API_KEY);

    Authenticator.signUp([email, pass], (user, err) => {
        if (!user) { // no user returned means that signUp failed
            console.log(err);
            res.status(StatusCodes.SERVER_ERR).json({
                "errCode": `${err[0]}`,
                "errMsg": `${err[1]}`
            });
        }
        else {
            console.log(user.email);
            res.status(StatusCodes.SUCCESS).json({
                "email": `${user.email}`
            });
        }
    });

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