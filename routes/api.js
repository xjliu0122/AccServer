const express = require('express');
const router = express.Router();
const createUser = require("../controllers/user/createUser.js")
const getUser = require("../controllers/user/getUser.js")
const uploadDocument = require("../controllers/document/uploadDocument.js")
const addLinkedAccount = require("../controllers/bank/addLinkedAccount.js")
const getLinkedAccount = require("../controllers/bank/getLinkedAccount.js")
const getOriginalPic = require("../controllers/document/getOriginalPic.js")
const getDocuments = require("../controllers/document/getDocuments.js")

router.get('/', function (req, res, next) {
    res.send('API');
});

router.post('/user', function (req, res, next) {
    createUser(req, res, next);
});

// will support query for other used in future if take admin-clerk mode into consideration. 
router.get('/user', function (req, res, next) {
    getUser(req, res, next);
});

// will support query for other used in future if take admin-clerk mode into consideration. 
router.put('/document', function (req, res, next) {
    uploadDocument(req, res, next);
});

router.get('/document/:fileName', function (req, res, next) {
    getOriginalPic(req, res, next);
});
router.get('/document', function (req, res, next) {
    getDocuments(req, res, next);
});


router.post('/LinkedAccount', function (req, res, next) {
    addLinkedAccount(req, res, next);
});

router.get('/LinkedAccount', function (req, res, next) {
    getLinkedAccount(req, res, next);
});

router.all('/:pageCalled', function (req, res, next) {
    res.status(404).send('API Not Availale: ' + req.param("pageCalled"));
});

module.exports = router;