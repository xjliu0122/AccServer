var AdminUser = require('../../../models/admin/adminUser');

var f = function getOrgId(uid, callback) {
    //get user from request body. check if user exists.
    AdminUser
        .findOne({
            uid: uid
        }, function (err, user) {
            if (user) {
                callback(user.organization)
            } else {
                callback(null)

            }
        });

};

module.exports = f;