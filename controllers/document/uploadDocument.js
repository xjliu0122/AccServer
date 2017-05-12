var uuid = require('node-uuid');
var Document = require('../../models/document');

var f = function (req, res, next) {
    // The name for the  bucket

    var doc = req.body;
    var docType = doc.type;
    var docData = doc.data;
    var thumb = doc.thumbnail;
    var comment = doc.comment;
    var location = doc.location;
    var resp = {};

    //get user from request body. 
    var uid = req.headers['x-uid'];
    var fileName = uuid.v1();
    var file = myBucket.file(uid + '/' + fileName);
    file.save(docData, function (err) {
        if (!err) {
            file.makePrivate({
                strict: true
            });
            // Update DB
            var toCreate = Document({
                docId: fileName,
                uid: uid,
                type: docType,
                thumbnail: thumb,
                comment:comment,
                location:location              
            });
            toCreate.save().then((result, err) => {
                if (err) {
                    resp.status = 'error';
                    resp.message = err.message;
                    res.status(500).send(JSON.stringify(resp)).end();
                } else {
                    resp.status = 'success';
                    resp.message = 'document uploaded successfully';
                    res.status(200).send(JSON.stringify(resp));
                }
            });
        }
    })

};

module.exports = f;