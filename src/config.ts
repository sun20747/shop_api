import * as process from "process";
import * as path from "path";

export class ServerConfig {
    port: number;

    constructor(conf: any) {
        this.port = parseInt(conf.port);
    }
}

export class Configuration {
    static server: ServerConfig;
    static mongodb_db_user: string;
    static dbs: {}[] = []
    static redis_config: any

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
        ]

        Configuration.redis_config = {
            redis_url: process.env.REDIS_URL,
        }

    }
}