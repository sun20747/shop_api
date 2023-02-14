import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Configuration } from './config';
import { Routes } from './router'
require('dotenv').config();
import { MongoDbClient } from "./libs/mongo_con";
import { Redis } from './libs/redis_con'
import morgan from 'morgan'

Configuration.init();

async function initDatabases() {
    if (Configuration.redis_config.redis_url) {
        Redis.connect(Configuration.redis_config.redis_url, (err => {
            if (err) {
                console.error(err);
                process.exit(0);
            }
        }))
    }

    if (Configuration.dbs) {
        MongoDbClient.connect(Configuration.dbs, {}, (err) => {
            if (err) {
                console.error(err);
                process.exit(0);
            }
        });
    }
}

var app: express.Express;
async function initServer() {
    app = express();

    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
    app.use(bodyParser.json({ limit: '50mb' }));
    new Routes(app).mapRoutes();

    app.listen(Configuration.server.port, () => {
        console.log(`server is running on port : ${Configuration.server.port}`);
    });
}

initDatabases().then(initServer).catch(err => {
    console.log(err)
    process.exit(1);
})