"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDbClient = void 0;
const mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
/**
 * The lib creator suggests this class should be singleton for the best performance
 */
class MongoDbClient {
    static db = null;
    static db_user = null;
    static count = 0;
    static con_dbs = [];
    /**
     * Perform connection
     */
    static connect(dbs, options, done) {
        if (MongoDbClient.db)
            return done(null);
        dbs.forEach(async (db) => {
            console.log(db.mongodb_url);
            await MongoClient.connect(db.mongodb_url, {
                maxPoolSize: 50,
                wtimeoutMS: 2500,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }, (err, db) => {
                if (err) {
                    console.error(err);
                    return done(err);
                }
                // this.count++
                // if (this.count == 1) {
                //     MongoDbClient.db = db.db(db_name);
                // }
                // if (this.count == 2) {
                //     MongoDbClient.db_user = db.db(db_name);
                // }
                console.log('[MongoDB Connector] connected successfully');
                done(null);
            });
        });
        // MongoClient.connect(
        //     url,
        //     <any>{
        //         maxPoolSize: 50,
        //         wtimeoutMS: 2500,
        //         useNewUrlParser: true,
        //         useUnifiedTopology: true,
        //     },
        //     (err, db) => {
        //         if (err) {
        //             console.error(err);
        //             return done(err);
        //         }
        //         this.count++
        //         if (this.count == 1) {
        //             MongoDbClient.db = db.db(db_name);
        //         }
        //         if (this.count == 2) {
        //             MongoDbClient.db_user = db.db(db_name);
        //         }
        //         console.log('[MongoDB Connector] connected successfully');
        //         done(null);
        //     });
    }
    /**
     * Get connector
     */
    static get() {
        return MongoDbClient.db;
    }
    static get_2() {
        return MongoDbClient.db_user;
    }
}
exports.MongoDbClient = MongoDbClient;
//# sourceMappingURL=mongo_con.js.map