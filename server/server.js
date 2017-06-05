// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var path = require("path");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
//Add logger In Application
var log4js = require('log4js');
var log = log4js.getLogger("app");
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
//End Add logger In Application

//Config
var config = require('./config/config');
//End Config
app.set('superSecret', config.secret);
//Database Connection
var mongoose = require('mongoose');
mongoose.connect(config.database);
//End Database Connection

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;        // set our port
app.use(express.static('public'))
// ROUTES FOR OUR API

var router = express.Router();

// Routers controllers
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');

app.use(function (req, res, next) {
    if (req.originalUrl != '/api/login' && (req.originalUrl == '/api/users' && req.method == "GET")) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function (err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    }
    else{
        next();
    }
});

router.use(function (req, res, next) {
    var x = 123;
    // do logging

    // check header or url parameters or post parameters for token

});

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../public/index.html'));
});

// all of our routes will be prefixed with /api
app.use('/api', usersRouter);
app.use('/api', loginRouter);

// START THE SERVER
// =============================================================================
app.listen(port);
log.trace('Server listening on port ' + port);