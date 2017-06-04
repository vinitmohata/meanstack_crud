var express = require('express');
var router = express.Router();
var User = require('../models/users');
var log4js = require('log4js');
var logger = log4js.getLogger();

router.route('/users')
    .post(function (req, res) {
         logger.info(req.method+', '+req.url);
         logger.info(req.body);
        var user = new User();
        user.name = req.body.name;
        user.save(function (err) {
            if (err) {
                logger.error(err);
                res.send(err);
            }
            res.json({ message: 'User created!' });
        });
    })

    .get(function (req, res) {
         logger.info(req.method+', '+req.url);
        User.find(function (err, bears) {
            if (err) {
                logger.error(err);
                res.send(err);
            }
            res.json(bears);
        });
    });

router.route('/users/:user_id')
    .get(function (req, res) {
         logger.info(req.method+', '+req.url);
        logger.info(req.params);
        User.findById(req.params.user_id, function (err, bear) {
            if (err) {
                logger.error(err);
                res.send(err);
            }
            res.json(bear);
        });
    })
    .put(function (req, res) {
         logger.info(req.method+', '+req.url);
        logger.info(req.body);
        User.findById(req.params.user_id, function (err, user) {
            if (err)
                res.send(err);
            user.name = req.body.name;
            user.save(function (err) {
                if (err) {
                    logger.error(err);
                    res.send(err);
                }
                res.json({ message: 'User updated!' });
            });

        });
    })
    .delete(function (req, res) {
         logger.info(req.method+', '+req.url);
         logger.info(req.body);
        User.remove({
            _id: req.params.user_id
        }, function (err, bear) {
            if (err) {
                logger.error(err);
                res.send(err);
            }
            res.json({ message: 'Successfully deleted' });
        });
    });

module.exports = router;