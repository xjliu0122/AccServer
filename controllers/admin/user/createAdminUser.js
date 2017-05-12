var config = require('../../../config/config');
var AdminUser = require('../../../models/admin/adminUser');
var uuid = require('node-uuid');

var f = function createAdminUser(req, res, next) {
    //get user from request body.
    var resp = {};
    var newUser = req.body;
    var result = {};
    var toCreate = AdminUser({
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName,
        emailVerified: newUser.emailVerified,
        photoURL: newUser.photoURL,
        admin: newUser.admin,
        organization: uuid.v1(),
        serviceUrl: config.NEWUSERHOSTADDRESS
    });

    //check if user exists.
    AdminUser.findOne({
        uid: newUser.uid
    }, function (err, user) {
        if (err) {
            resp.status = 'error';
            resp.message = err.message;
            res
                .status(500)
                .send(JSON.stringify(resp))
                .end();
        }
        if (user) {
            resp.status = 'error';
            resp.message = 'User already exists. Please contact us for help.';
            res
                .status(500)
                .send(JSON.stringify(resp));
        } else {
            // save the user
            toCreate
                .save()
                .then((result) => {
                    resp.status = 'success';
                    resp.message = 'user created successfully';
                    resp.result = {
                        serviceUrl: toCreate.serviceUrl
                    };
                    res
                        .status(200)
                        .send(JSON.stringify(resp));

                })
                .catch(err => {
                    resp.status = 'error';
                    resp.message = err.message;
                    res
                        .status(500)
                        .send(JSON.stringify(resp))
                        .end();
                })

        }
    });

};

module.exports = f;