// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var path    = require("path");

var log4js = require('log4js');
var log = log4js.getLogger("app");
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));


var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/users');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var User     = require('./models/users');
var port = process.env.PORT || 3000;        // set our port
app.use(express.static('public'))
// ROUTES FOR OUR API

var router = express.Router(); 

// Routers controllers
var usersRouter = require('./routes/users');

router.use(function(req, res, next) {
    // do logging
    log.error("Something went wrong:", err);
    console.log(req.body);
    next(); 
});

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/../public/index.html'));
});


// all of our routes will be prefixed with /api
app.use('/api', usersRouter);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server listening on port ' + port);