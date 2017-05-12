const uuid = require('node-uuid');
const Document = require('../../models/document');


// Initialize with the string 

let f = function (req, res, next) {
   
    // get original pic from google. 
    let resp = {};
    let fileName = req.params['fileName'];
    //get user from request body. 
    let uid = req.headers['x-uid'];
    fs.mkdirpSync("/" + uid);

    let file = myBucket.file(uid + '/' + fileName);
    file.createReadStream()
        .on('error', function(err) {
            throw err;
        }).on('response', function(response) {

            // Server connected and responded with the specified status and headers.
        }).on('end', function() {
            var readStream = fs.createReadStream("/" + uid + '/'  + fileName);
            readStream.pipe(res);            
        }).pipe(fs.createWriteStream("/" + uid + '/'  + fileName));

}
module.exports = f;