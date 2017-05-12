var GLRecord = require('../../../models/admin/glRecord');

var f = function getGLRecords(req, res, next) {
    let orgId = req.headers['OrgId']
    let accountid = req.body.accountid
    let fromDate = req.body.fromDate
    let toDate = req.body.toDate
    if (!orgId || orgId === '') 
        return res.status(500).send('No Organisation Assigned. Please contact us.')

    let glRecs = []
    //check if user exists.
    GLRecord
        .find({coaId: accountid,
        date:{
            "$gte": fromDate,
            "$lte": toDate
        }})
        .then(recs => {
            recs.forEach(function(rec) {
                let glRec = {}
                glRec.recid = rec.recid
                glRec.coaId = rec.coaId
                glRec.date = rec.date
                glRec.docIdRef = rec.docIdRef
                glRec.amount = rec.amount
                glRec.identifier = rec.identifier
                glRecs.push(glRec)
            }, this); 
            res.status(200).send(JSON.stringify(glRecs))
           
        })
        .catch(err => {
            if (err) 
                res.status(500).send()
        })

};

module.exports = f;