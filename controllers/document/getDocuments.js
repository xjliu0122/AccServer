const Document = require('../../models/document');

let f = function (req, res, next) {

    let params = req.query;
    let docType = params.type;
    let skip = Number(params.skip);
    let resp = {};

    //get user from request body. 
    let uid = req.headers['x-uid'];
    let query = Document.find({
        uid: uid,
        type: docType
    }).sort({
        'created_at': -1
    }).skip(skip).limit(10);
    query.exec().then((result) => {
        resp.status = 'success';
        resp.result = result;
        res.status(200).send(JSON.stringify(resp));
    }).catch((err) => {
        resp.status = 'error';
        resp.message = err.message;
        res.status(500).send(JSON.stringify(resp)).end();
    })
};

module.exports = f;