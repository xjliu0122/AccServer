const uuid = require('node-uuid');
const Document = require('../../../models/document');

// Initialize with the string

let f = function (req, res, next) {
    var uid = req.params.uid;
    var docId = req.params.docId;
    let file = myBucket.file(uid + '/' + docId);

    file
        .download()
        .then(function (data) {
            let contents = data[0]
            res
                .status(200)
                .send(contents)
        })
        .catch(err=>{
            throw err
        })
}
module.exports = f;