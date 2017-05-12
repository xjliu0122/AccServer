var Storage = require('@google-cloud/storage');
var storageClient = Storage({
    projectId: projectId,
    keyFilename: './config/srvAccountKey.json'
});
var projectId = "agileacc-1488095635682";

var f = function () {

    return {
        storageClient: storageClient,
        projectId: projectId
    };
}
module.exports = f