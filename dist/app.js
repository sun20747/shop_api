"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config_1 = require("./config");
const router_1 = require("./router");
require('dotenv').config();
const mongo_con_1 = require("./libs/mongo_con");
config_1.Configuration.init();
async function initDatabases() {
    // let mongo_con = await MongoDbClient.connect(Configuration.mongodb_url, {})
    // if(!mongo_con) process.exit(1);
    // MongoDbClient.connect(Configuration.mongodb_url, Configuration.mongodb_db, {}, (err) => {
    //     if (err) {
    //         console.error(err);
    //         process.exit(0);
    //     }
    // });
    if (config_1.Configuration.dbs) {
        mongo_con_1.MongoDbClient.connect(config_1.Configuration.dbs, {}, (err) => {
            if (err) {
                console.error(err);
                process.exit(0);
            }
        });
        // MongoDbClient.connect(Configuration.mongodb_url, Configuration.mongodb_db_user, {}, (err) => {
        //     if (err) {
        //         console.error(err);
        //         process.exit(0);
        //     }
        // });
    }
}
var app;
async function initServer() {
    app = express();
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
    app.use(bodyParser.json({ limit: '50mb' }));
    new router_1.Routes(app).mapRoutes();
    app.listen(config_1.Configuration.server.port, () => {
        // MongoDbClient.connect(Configuration.mongodb_url, {})
        console.log(`server is running on port : ${config_1.Configuration.server.port}`);
    });
}
initDatabases().then(initServer).catch(err => {
    console.log(err);
    process.exit(1);
});
//# sourceMappingURL=app.js.map