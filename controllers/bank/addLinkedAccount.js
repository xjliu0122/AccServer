const async = require("async");
const plaid = Promise.promisifyAll(require('plaid-legacy'));
const config = require('../../config/config');
const UserBankAccount = require('../../models/userBankAccount.js');
const plaidClient = new plaid.Client(config.PLAID_CLIENTID, config.PLAID_SECRET, plaid.environments.tartan); // dev 
const pullTransactions = require('./pullTransactions');

let f = function (req, res, next) {

    let data = req.body;
    let resp = {};
    //get user from request body. 
    let uid = req.headers['x-uid'];
    let publicToken = data.publicToken;
    let accessToken = "";

    // initial connect -- get transactions for last year. 
    plaidClient.exchangeTokenAsync(publicToken)
        .then((result) => {
            accessToken = result.access_token;
            return plaidClient.getConnectUserAsync(result.access_token, {
                gte: '365 days ago',
            })
        }).then(result => {

            return new Promise((resolve, reject) => {
                saveAccount(result.accounts, uid, accessToken, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            })

        }).then(result => {
            return new Promise((resolve, reject) => {
                pullTransactions(uid,result.transactions, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            })
        }).then(result => {

            res.status(200).send();
        }).catch((err) => {
            console.log(err);
            res.status(500).send(err.message);
        });
};

let saveAccount = function (accounts, uid, accessToken, func) {
    async.forEach(accounts, function (account, callback) {
        let userBankAccount = UserBankAccount({
            uid: uid,
            accountNo: account.meta.number,
            accountName: account.meta.name,
            accessToken: accessToken,
            plaidAccountId: account._id,
            plaidItemId: account._item,
            plaidUserId: account._user,
            currentBalance: account.balance.current,
            availableBalance: account.balance.available,
            institution: account.institution_type,
            subtype: account.subtype,
            type: account.type
        });
        UserBankAccount.findOne({
                plaidAccountId: account._id,
            }).then((account) => {
                if (account) {
                    Promise.resolve();
                } else {
                    // not  pulled before. save it. 
                    return userBankAccount.save()
                }
            }).then((result) => {
                callback();
            })
            .catch((err) => {
                if (err) throw err;
            })
    }, function (err) {
        func(err);
    });
}
module.exports = f;