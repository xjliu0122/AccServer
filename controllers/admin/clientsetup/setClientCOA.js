var User = require('../../../models/user');
var uuid = require('node-uuid');
var f = function setClientCOA(req, res, next) {
    var uid = req.body.clientUid

    User
        .find({uid: uid})
        .then((user) => {

            if (user && user.length > 0) {
                let oldCoa = user[0].chartOfAccounts
                    ? user[0].chartOfAccounts
                    : []

                user[0].chartOfAccounts = req.body.data
                    ? req.body.data
                    : []
                user[0]
                    .chartOfAccounts
                    .forEach(function (acc) {
                        let oldItem = oldCoa.filter(obj => {
                            return obj.Account === acc.Account
                        })
                        if (oldItem.length > 0) {
                            acc.guid = oldItem[0].guid
                        } else {
                            acc.guid = uuid.v1()
                        }
                    }, this);
                return user[0].save()
            } else {
                res
                    .status(500)
                    .send("User with uid " + uid + " does not exist")
            }
        })
        .then((result) => {
            res
                .status(200)
                .send();
        })
        .catch((err) => {
            res
                .status(500)
                .send();
        })

};

module.exports = f;