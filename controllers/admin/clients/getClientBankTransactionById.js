var UserBankAccount = require('../../../models/userBankAccount')
var BankTransaction = require('../../../models/bankTransaction')
var User = require('../../../models/user')

var f = function getClientBankTransactionById(req, res, next) {
    let orgId = req.headers['OrgId'];
    if (!orgId || orgId === '') {
        return res
            .status(500)
            .send('No Organisation Assigned. Please contact us.')

    }
    //check if user belong to admin's org.
    let transactionId = req.params.transactionId
    let account = {}
    let transaction = {}   

    BankTransaction
        .findOne({transactionId: transactionId})
        .then(result => {
            if (result) {
                transaction = result._doc
                return UserBankAccount.findOne({plaidAccountId: transaction.plaidAccountId})
            } else {
                throw new Error('Transaction not found')
            }
        })
        .then(acc => {
            transaction.institution = acc.institution
            transaction.subtype = acc.subtype
            transaction.type = acc.type
            transaction.accountNo = acc.accountNo
            transaction.accountName = acc.accountName
            res.status(200).send(JSON.stringify(transaction))
        })
        .catch(err=>{
            res.status(500).send(err.message)
        })

}

module.exports = f;