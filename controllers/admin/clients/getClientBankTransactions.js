var UserBankAccount = require('../../../models/userBankAccount')
var BankTransaction = require('../../../models/bankTransaction')
var User = require('../../../models/user')

var f = function getClientBankTransactions(req, res, next) {
    let orgId = req.headers['OrgId'];
    if (!orgId || orgId === '') {
        return res
            .status(500)
            .send('No Organisation Assigned. Please contact us.')

    }
    //check if user belong to admin's org.
    let clientUid = req.body.uid
    if (!clientUid || clientUid === '') {
        return res
            .status(500)
            .send('No client requested.')

    }
    let keyDate = req.body.keyDate
        ? req.body.keyDate
        : new Date()
    let accounts = []
    let transactions = []
    let period = (req.body.period && req.body.period !== '')
        ? req.body.period
        : 30
    let resp = []
    User
        .findOne({uid: clientUid})
        .then(user => {
            if (user._doc.organization === orgId) {
                //get client's bank accounts
                UserBankAccount
                    .find({uid: clientUid})
                    .then(results => {
                        accounts = results
                        //prepare searching criteria

                        let fromDate = new Date()
                        fromDate = fromDate.minusDays(period)
                        if (fromDate > keyDate) 
                            fromDate = keyDate

                        return BankTransaction.find({
                            uid: clientUid,
                            transactionDate: {
                                "$gte": fromDate
                            }
                        })
                    })
                    .then(results => {
                        transactions = results
                        //organize response data
                        transactions.forEach(function (transaction) {
                            let acc = accounts.filter((obj => {
                                return obj.plaidAccountId === transaction.plaidAccountId
                            }))[0]
                            let toResp = transaction._doc

                            toResp.institution = acc.institution
                            toResp.subtype = acc.subtype
                            toResp.type = acc.type
                            toResp.accountNo = acc.accountNo
                            toResp.accountName = acc.accountName
                            resp.push(toResp)
                        }, this);
                        res
                            .status(200)
                            .send(JSON.stringify(resp))
                    })
                    .catch(err => {
                        throw err
                    })

            } else {
                res
                    .status(500)
                    .send('No authorization on the requested client')
            }
        })
        .catch(err => {
            throw err
        })

};

module.exports = f;