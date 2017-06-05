var express = require('express');     // call express 
var router = express.Router();
var User = require('../models/users');
var log4js = require('log4js');
var logger = log4js.getLogger();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./../config/config');


/**
     * @api {post} /login Login
     * @apiGroup Login
     * @apiParam {String} password Required
     * @apiParam {String} email_id Required
     * @apiSuccess {string} Message Returns message indicating User Login Successfully!.
     * curl -X PUT -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiI1ODQ4ZTg5ZTRjYzlkNTI0NDRlNGQxMzIiLCJpYXQiOjE0ODE2ODk5NjZ9.bqGwoy_ACZxgTGzHWVvofdcBAgZ5d2YiSzDBaAuchNQ" -H "Cache-Control: no-cache" -H "Postman-Token: 1daae673-7c67-0c70-c8ac-a9389ca3fdd8" -H "Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW" -F "GroupId=5850ea9a7efb6d41dc4b52e0" -F "Name=New Group222" -F "InvitedUserIds[0]=5848e89e4cc9d52444e4d131" -F "InvitedUserIds[1]=1843e89e4cc9d52443e4d121" -F "InvitedUserIds[2]=1348e89e4cc9d49744e4d131" -F "NonEntongoUserPhoneNumber[0]=1234569842" -F "NonEntongoUserPhoneNumber[1]=9517531548" -F "NonEntongoUserPhoneNumber[2]=1987456197" -F "GroupImage=@2013-01-10 18.27.59.jpg" -F "NonEntongoUserPhoneNumber[3]=1234569841" -F "InvitedUserIds[3]=1843e89e4cc9d52443e4d122" "http://localhost:8080/api/v1/group"
     * @apiSuccessExample {object[]} Example Response
         {
            "message": "User Login Successfully!",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiX192IjoiaW5pdCIsIm5hbWUiOiJpbml0IiwiZW1haWxfaWQiOiJpbml0IiwicGFzc3dvcmQiOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiX192Ijp0cnVlLCJuYW1lIjp0cnVlLCJlbWFpbF9pZCI6dHJ1ZSwicGFzc3dvcmQiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6e30sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfX0sImlzTmV3IjpmYWxzZSwiX2RvYyI6eyJfX3YiOjAsIm5hbWUiOiJWaW5pdCIsImVtYWlsX2lkIjoidmluaXRtb0BzdmVsdG96LmNvbSIsInBhc3N3b3JkIjoiMTIzIiwiX2lkIjoiNTkzNGY5ZGY3YmE5Y2EyYTNjMTE1ZjYzIn0sIiRpbml0Ijp0cnVlLCJpYXQiOjE0OTY2NjM4MzIsImV4cCI6MTQ5NjY2NTI3Mn0.bWIil10wesGZZFDCLT8Npa_3zOMWeyXcbmIYG81hUOg"
        }
     * @apiErrorExample {json} List error
     *    HTTP/1.1 500 Internal Server Error
     *    HTTP/1.1 400 {message: "Error"}
     *    HTTP/1.1 403 No token provided.
     *    HTTP/1.1 201 User Created.
     */
router.route('/login')
    .post(function (req, res) {
        logger.info(req.method + ', ' + req.url);
        logger.info(req.body);
        var user = new User();
        var email_id = req.body.email_id;
        var password = req.body.password;
        User.findOne({ email_id: email_id, password: password }, function (err, user) {
            if (err) {
                logger.error(err);
                res.status(400).send(err);
            }
            var token = jwt.sign(user, config.secret, {
                expiresIn: 1440 // expires in 24 hours
            });
            res.status(200).json({ message: 'User Login Successfully!', token: token });
        });
    })

module.exports = router;