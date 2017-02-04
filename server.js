// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var path    = require("path");

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/users');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var User     = require('./app/models/users');
var port = process.env.PORT || 3000;        // set our port

// ROUTES FOR OUR API

var router = express.Router(); 

router.use(function(req, res, next) {
    // do logging
    console.log('New Request');
    next(); 
});

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/app/views/index.html'));
});

router.route('/users')
    .post(function(req, res) {
        var user = new User();     
        user.name = req.body.name;
        user.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'User created!' });
        });
    })

    .get(function(req, res) {
        User.find(function(err, bears) {
            if (err)
                res.send(err);
            res.json(bears);
        });
    });

    router.route('/users/:user_id')
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    })
    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            user.name = req.body.name;
            user.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'User updated!' });
            });

        });
    })
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, bear) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });

// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server listening on port ' + port);