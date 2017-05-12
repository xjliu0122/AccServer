// Library
Promise = require('bluebird')
async  = require('async')
cluster = require('cluster');
const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./config/firebaseKey.js");
const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const verifyToken = require('./controllers/verifyToken');
const config = require('./config/config');
const resp = require('./controllers/apiResponseTemplate');
const Storage = require('@google-cloud/storage');
const stor = require("./controllers/document/getStorageClient.js")();
const storageClient = stor.storageClient;
const bucketName = stor.projectId + '.appspot.com';
const index = require('./routes/index');
const api = require('./routes/api');
const MemoryFileSystem = require("memory-fs");
const adminApi = require('./routes/adminApi');
const getOrgId = require("./controllers/admin/user/getOrgId.js")
const db = mongoose.connect(config.DBADDRESS);

// global function definition 
Date.prototype.minusDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() - days);
    return dat;
}

//clustring
if (1 == 2){ // (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os')
        .cpus()
        .length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
} else {

    // global handlers.
    fs = new MemoryFileSystem();
    myBucket = storageClient.bucket(bucketName);

    firebaseAdmin.initializeApp({
        credential: firebaseAdmin
            .credential
            .cert(serviceAccount),
        databaseURL: "https://" + serviceAccount.project_id + ".firebaseio.com/"
    });
    //Main
    app = express();
    var port = config.PORT;

    app.set("views", path.join(__dirname, "www"));
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);

    //set static folder
    app.use(express.static(path.join(__dirname, 'www')));

    //bodyparser MW

    app.use(bodyParser.json({limit: '1mb'}));
    app.use(bodyParser.urlencoded({extended: false}));

    // global exception handler. process.on("unCaughtExceptions" ) Set HTTP Header
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', "*");
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token, x-uid');
        next();
    });

    //API protector.

    app.all('*', (req, res, next) => {
        if (req.originalUrl.startsWith('/admin/') && req.method != "OPTIONS") {

            var uid = req.headers['x-uid']
            getOrgId(uid, (orgId) => {
                req.headers.OrgId = orgId
                //for admin dev.
                next()
                return
            })
        } else if (req.method != "OPTIONS") {
            verifyToken(firebaseAdmin, req, res, next);
        } else {
            return res
                .status(200)
                .send();
        }
    });

    //Routes
    app.use('/api', api);
    app.use('/admin', adminApi);

    app.use(function (req, res, next) {
        return res
            .status(404)
            .send("API Not Found");

    })

    app.listen(port, function () {
        console.log('Started server:' + port);

    })

    process.on('uncaughtException', function (err) {
      console.log(err);
    })
}