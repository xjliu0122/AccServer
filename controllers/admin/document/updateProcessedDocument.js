var User = require('../../../models/user')
var GLRecord = require('../../../models/admin/glRecord')
var Document = require('../../../models/document')
var ExchangeRate = require('../../../models/admin/exchangeRate')
var uuid = require('node-uuid')

var f = function updateProcessedDocument(req, res, next) {
    let docToSave = req.body
    let uid = docToSave.clientUid
    let rate = 1
    let orgId = req.headers['OrgId'];
    if (!orgId || orgId === '') {
        return res
            .status(500)
            .send('No Organisation Assigned. Please contact us.')
    }
    User
        .findOne({uid: uid})
        .then(user => {
            if (user.organization === orgId) {

                //get exchange rate.
                ExchangeRate
                    .find({
                    date: {
                        $gte: docToSave.transactiondate
                    },
                    currency:docToSave.transactioncurr
                })
                    .sort({date: 1})
                    .limit(1)
                    
                    .then(rates => {
                        if (rates.length > 0)
                            rate = rates[0].rate
                        return Document.findOne({docId: docToSave.docId})
                    })
                    // update the document first
                    .then(doc => {
                        let toSave = doc

                        toSave.type = docToSave.type
                        toSave.processed = true
                        toSave.matched = (docToSave.linkedBankTransaction !== null)
                        toSave.comment = docToSave.comment
                        toSave.transactionTotalAmount = docToSave.transactionTotalAmount
                        toSave.transactioncurr = docToSave.transactioncurr
                        toSave.transactiondate = docToSave.transactiondate
                        toSave.transactionSupplier = docToSave.transactionSupplier
                        toSave.transactionIdentifier = docToSave.transactionIdentifier
                        toSave.transactionCategory = docToSave.transactionCategory
                        toSave.transactionTaxAmount = docToSave.transactionTaxAmount
                        if (!docToSave.transactionTotalUSD){
                            docToSave.transactionTotalUSD = parseFloat(docToSave.transactionTotalAmount / rate).toFixed(2)
                            toSave.transactionTotalUSD = docToSave.transactionTotalUSD
                        }
                            
                        if (!docToSave.transactionTaxUSD){
                            docToSave.transactionTaxUSD = parseFloat(docToSave.transactionTaxAmount / rate).toFixed(2)
                            toSave.transactionTaxUSD = docToSave.transactionTaxUSD
                        }
                            
                        toSave.linkedBankTransaction = docToSave.linkedBankTransaction
                        if (docToSave.linkedBank && docToSave.linkedBank !== '') 
                            toSave.linkedBank = docToSave.linkedBank
                        if (docToSave.transactionCategoryDesc && docToSave.transactionCategoryDesc !== '') 
                            toSave.transactionCategoryDesc = docToSave.transactionCategoryDesc
                        return toSave.save()

                    })
                    .then((result) => {
                        // post to GL Account
                        return GLRecord.find({docIdRef: docToSave.docId})

                    })
                    .then(records => {
                        return new Promise(function (resolve, reject) {
                            async
                                .each(records, (rec, callback) => {
                                    rec.remove(() => {
                                        callback()
                                    })
                                }, function (err) {
                                    if (err) {
                                        reject(err)
                                    } else {
                                        resolve()
                                    }
                                })

                        })
                    })
                    .then(() => {
                        // save to GLRecord table.
                        let newGLRecord = GLRecord({
                            recid: uuid.v1(),
                            uid: uid,                            
                            coaId: docToSave.transactionCategory,
                            date: docToSave.transactiondate,
                            docIdRef: docToSave.docId,
                            amount: docToSave.transactionTotalUSD,
                            identifier: docToSave.transactionIdentifier
                        })

                        return newGLRecord.save()
                    })
                    .then(() => {
                        res
                            .status(200)
                            .send("Document processed")
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).send()
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

}

module.exports = f;