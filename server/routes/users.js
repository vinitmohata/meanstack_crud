var express = require('express'),
    router = express.Router(),
    User = require('../models/users'),
    messages = require('../config/messages'),
    log4js = require('log4js'),
    logger = log4js.getLogger(),
    async = require('async');



/**
     * @api {post} /users Create User
     * @apiGroup User 
     * @apiParam {String} name Required
     * @apiParam {String} email_id Required
     * @apiParam {String} password Required
     * @apiSuccess {string} Message Returns message indicating user is created.
     * @apiSuccessExample {object[]} Example Response
         {
           "message": "Created"
         }
     * @apiErrorExample {json} List error
     *    HTTP/1.1 500 Internal Server Error
     *    HTTP/1.1 400 {message: "Error"}
     *    HTTP/1.1 403 No token provided.
     */

    //http://localhost:3000/api/users
router.route('/users')
    .post(function (req, res) {
        logger.info(req.method + ', ' + req.url);
        logger.info(req.body);
        var user = new User();
        user.name = req.body.name;
        user.email_id = req.body.email_id;
        user.password = req.body.password;
        user.save(function (err) {
            if (err) {
                logger.error(err);
                res.status(400).send(err);
            }
            res.status(201).json({ message: messages.CREATED });
        });
    })

    /**
     * @api {Get} /users Get Users
     * @apiGroup Users
     * @apiParam {String} x-access-token Required token obtained by logging into system. Passed as a header.
     *    curl -X GET -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiI1ODQ4ZTg5ZTRjYzlkNTI0NDRlNGQxMzIiLCJpYXQiOjE0ODE2ODk5NjZ9.bqGwoy_ACZxgTGzHWVvofdcBAgZ5d2YiSzDBaAuchNQ" -H "Cache-Control: no-cache" -H "Postman-Token: c39a36cd-f4a6-88d2-2dd0-512d43bd1054" "http://localhost:8080/api/v1/group"
     * @apiSuccessExample {object[]} Example Response
     [
     {
       "_id": "5934f9df7ba9ca2a3c115f63",
       "password": "123",
       "email_id": "vinitmo@test.com",
       "name": "Vinit",
       "__v": 0
     },
     {
       "_id": "59353edc0a1fce1accfb18b5",
       "password": "123",
       "email_id": "yogeshj@test.com",
       "name": "Yogesh",
       "__v": 0
     },
     {
       "_id": "593545c60e1cc32cacead8b7",
       "password": "123",
       "email_id": "yogeshj@test.com",
       "name": "Yogesh",
       "__v": 0
     }
   ]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 500 Internal Server Error
     *    HTTP/1.1 403 No token provided.
     */

    .get(function (req, res) {
        logger.info(req.method + ', ' + req.url);
        User.find(function (err, users) {
            if (err) {
                logger.error(err);
                res.status(400).send(err);
            }
            res.status(200).json(users);
        });
    });

router.route('/users/:user_id')
    .get(function (req, res) {
        logger.info(req.method + ', ' + req.url);
        logger.info(req.params);
        User.findById(req.params.user_id, function (err, user) {
            if (err) {
                logger.error(err);
                res.status(400).send(err);
            }
            res.status(200).json(user);
        });
    })
    .put(function (req, res) {
        logger.info(req.method + ', ' + req.url);
        logger.info(req.body);
        User.findById(req.params.user_id, function (err, user) {
            if (err)
                res.status(400).send(err);
            user.name = req.body.name;
            user.save(function (err) {
                if (err) {
                    logger.error(err);
                    res.status(200).send(err);
                }
                res.json({ message: 'User updated!' });
            });

        });
    })
    .delete(function (req, res) {
        logger.info(req.method + ', ' + req.url);
        logger.info(req.body);
        User.remove({
            _id: req.params.user_id
        }, function (err, bear) {
            if (err) {
                logger.error(err);
                res.status(400).send(err);
            }
            res.status(200).json({ message: 'Successfully deleted' });
        });
    });

//Async function call
// http://localhost:3000/api/usersAsync
router.route('/usersAsync')

    .get(function (req, res) {
        var arr = [];
        logger.info(req.method + ', ' + req.url);
        User.find(function (err, users) {
            if (err) {
                logger.error(err);
                res.status(400).send(err);
            }
            if (users.length > 0) {
                async.eachSeries(users, function iteratee(item, callback) {
                    User.findOne({ '_id': item._id }, function (err, user) {
                        arr.push(user);
                        callback(null, user);
                    });
                }, function (err) {
                    res.status(200).json(arr);
                });
            }
            //res.status(200).json(users);
        });
    })

    .post(function (req, res) {
        var arr = [];
        async.waterfall(
            [
                function (callback) {
                    User.find(function (err, users) {
                        arr.push(users);
                        callback(null, users);
                    });
                },
                function (users, callback) {
                    User.find(function (err, users) {
                        arr.push(users);
                        callback(null, users);
                    });
                    //   callback(null, caption);
                },
                function (caption, callback) {
                    User.find(function (err, users) {
                        arr.push(users);
                        callback(null, users);
                    });
                }
            ],
            function (err, caption) {
                res.json(arr);
                // Node.js and JavaScript Rock!
            }
        );
    });
//End Async function call


module.exports = router;
