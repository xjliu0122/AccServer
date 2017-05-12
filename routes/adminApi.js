const express = require('express')
const router = express.Router()
const getAPI = require("../controllers/admin/dashboard/getKpi.js")
const getAvailableTemplates = require("../controllers/admin/setting/getAvailableTemplates.js")
const createTemplate = require("../controllers/admin/setting/createTemplate.js")
const updateTemplate = require("../controllers/admin/setting/updateTemplate.js")
const deleteTemplate = require("../controllers/admin/setting/deleteTemplate.js")
const getAdminUser = require("../controllers/admin/user/getAdminUser.js")
const createAdminUser = require("../controllers/admin/user/getAdminUser.js")
const setClientCOA = require("../controllers/admin/clientsetup/setClientCOA.js")
const getClientDocuments = require("../controllers/admin/document/getClientDocuments.js")
const getOriginalPicAdmin = require("../controllers/admin/document/getOriginalPicAdmin.js")
const getClients = require("../controllers/admin/clients/getClients.js")
const getClientBankTransactions = require("../controllers/admin/clients/getClientBankTransactions.js")
const getExchangeRate = require("../controllers/admin/document/getExchangeRate.js")
const getClientBankTransactionById = require("../controllers/admin/clients/getClientBankTransactionById.js")
const updateProcessedDocument = require("../controllers/admin/document/updateProcessedDocument.js")
const getClientCOA = require("../controllers/admin/clients/getClientCOA.js")
const getGLRecords = require("../controllers/admin/clients/getGLRecords.js")
const updateGLRecords = require("../controllers/admin/clients/updateGLRecords.js")

router.get('/KPI', function (req, res, next) {
    getAPI(req, res, next)
})

router.get('/availabletemplates', function (req, res, next) {
    getAvailableTemplates(req, res, next)
})

router.post('/templates', function (req, res, next) {
    updateTemplate(req, res, next)
})
router.post('/processeddocument', function (req, res, next) {
    updateProcessedDocument(req, res, next)
})
router.put('/templates', function (req, res, next) {
    createTemplate(req, res, next)
})
router.delete('/templates/:name', function (req, res, next) {
    deleteTemplate(req, res, next)
})
router.get('/adminUser', function (req, res, next) {
    getAdminUser(req, res, next)
})
router.get('/clientdocuments/:type/:uid', function (req, res, next) {
    getClientDocuments(req, res, next)
})
router.get('/clients', function (req, res, next) {
    getClients(req, res, next)
})
router.get('/exchangerate/:date/:curr', function (req, res, next) {
    getExchangeRate(req, res, next)
})
router.post('/clientbanktransactions', function (req, res, next) {
    getClientBankTransactions(req, res, next)
})
router.get('/clientbanktransactionbyid/:transactionId', function (req, res, next) {
    getClientBankTransactionById(req, res, next)
})
router.get('/getoriginalpic/:uid/:docId', function (req, res, next) {
    getOriginalPicAdmin(req, res, next)
})
router.put('/adminUser', function (req, res, next) {
    createAdminUser(req, res, next)
})
router.post('/clientcoa', function (req, res, next) {
    setClientCOA(req, res, next)
})
router.get('/clientcoa/:uid', function (req, res, next) {
    getClientCOA(req, res, next)
})
router.post('/glrecords', function (req, res, next) {
    getGLRecords(req, res, next)
})
router.put('/glrecords', function (req, res, next) {
    updateGLRecords(req, res, next)
})

router.all('/:pageCalled', function (req, res, next) {
    res
        .status(404)
        .send('API Not Availale: ' + req.params.pageCalled)
})

module.exports = router