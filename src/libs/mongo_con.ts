import * as mongodb from "mongodb";
import { TypeDB } from './db.enum'

var MongoClient = mongodb.MongoClient;

/**
 * The lib creator suggests this class should be singleton for the best performance
 */
class MongoDbClient {

    public static db: mongodb.Db = null;
    public static con_dbs: mongodb.Db[] = [];

    /**
     * Perform connection
     */

    public static connect(dbs: {}[], options: mongodb.MongoClientOptions, done: (err: any) => void) {
        if (MongoDbClient.db) return done(null);

        dbs.forEach((db_config: TypeDB) => {
            MongoClient.connect(
                db_config.mongodb_url,
                <any>{
                    maxPoolSize: 50,
                    wtimeoutMS: 2500,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                },
                (err, db) => {
                    if (err) {
                        console.error(err);
                        return done(err);
                    }
                    MongoDbClient.db = db.db(db_config.mongodb_db);
                    this.con_dbs.push(MongoDbClient.db)
                    console.log('[MongoDB Connector] connected successfully : ' + db_config.mongodb_db);
                    done(null);
                }
            )
        });
    }

    /**
     * Get connector
     */
    public static get(db_name: string): mongodb.Db {
        const db: mongodb.Db = MongoDbClient.con_dbs.find(db => db.databaseName === db_name)        
        return db;
    }
}

export { MongoDbClient };
