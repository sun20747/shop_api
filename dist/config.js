"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = exports.ServerConfig = void 0;
const process = require("process");
const path = require("path");
class ServerConfig {
    port;
    constructor(conf) {
        this.port = parseInt(conf.port);
    }
}
exports.ServerConfig = ServerConfig;
class Configuration {
    // static mongodb_url: string;
    // static mongodb_db: string;
    static server;
    static mongodb_db_user;
    static dbs = [];
    static init() {
        if (!process.env.APP_ENV) {
            require('dotenv').config({ path: path.join(process.cwd(), '.env') });
            process.env.TZ = 'UTC';
        }
        // +++++++++++++++++++++++++[DONT CHANGE]+++++++++++++++++++++++++
        let appEnv = process.env.APP_ENV;
        if (!appEnv) {
            throw Error('No environment specified');
        }
        if ((appEnv != 'production') && (appEnv != 'staging') && (appEnv != 'development')) {
            throw Error('Invalid environment specified');
        }
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        console.log(`Environment: ${appEnv}`);
        Configuration.server = {
            port: parseInt(process.env.APP_PORT)
        };
        Configuration.dbs = [
            {
                mongodb_url: process.env.MONGO_URL,
                mongodb_db: process.env.MONGO_DB,
            },
            {
                mongodb_url: process.env.MONGO_URL_USER,
                mongodb_db: process.env.MONGO_DB_USER
            }
        ];
    }
}
exports.Configuration = Configuration;
//# sourceMappingURL=config.js.map