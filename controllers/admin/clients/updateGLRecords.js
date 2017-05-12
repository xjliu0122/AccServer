var GLRecord = require('../../../models/admin/glRecord');
var uuid = require('node-uuid')
var async = require('async')

var f = function updateGLRecords(req, res, next) {
    let orgId = req.headers['OrgId']

    if (!orgId || orgId === '') 
        return res.status(500).send('No Organisation Assigned. Please contact us.')

    let glRecsToAdd = req.body.toadd
    let glRecsToAddModelCollection = []
    let glRecsToDelete = req.body.todelete
    let glRecsToDeleteIdCollection = []
    let uid = req.body.uid
    let coaId = req.body.coaId
    glRecsToAdd.forEach(function (rec) {
        let newGLRecord = {
            recid: uuid.v1(),
            uid: uid,
            coaId: coaId,
            date: rec.date,
            amount: rec.amount,
            identifier: rec.identifier
        }
        glRecsToAddModelCollection.push(newGLRecord)
    }, this)

    glRecsToDelete.forEach(function (recid) {
        glRecsToDeleteIdCollection.push(recid)
    }, this)

    new Promise(function (resolve, reject) {
        if (glRecsToAddModelCollection.length > 0) {
            GLRecord
                .collection
                .insert(glRecsToAddModelCollection)
                .then(()=>{
                    resolve()
                })
        } else {
            resolve()
        }
    })
    .then(() => {
        // delete.
        return new Promise(function (resolve, reject) {
            if(glRecsToDeleteIdCollection.length > 0)
                async.each(glRecsToDeleteIdCollection, (recid, callback) => {
                    GLRecord
                        .remove({recid: recid})
                        .then(doc => {
                            callback()
                        })
                }, err => {
                    reject(err)
                })
            resolve()
        })
    }).then(() => {
        res
            .status(200)
            .send(JSON.stringify())
    }).catch(err => {
        throw err
    })
}

module.exports = f;