import { createClient } from 'redis'
import { Configuration } from '../config'
import { Client } from 'redis-om'



class Redis {
    public static redis_con: any = null;

    public static async connect(url: string, done: (err: any) => void) {
        if (Redis.redis_con) return done(null);

        const client = await new Client().open(url)
        if (client.isOpen) {
            console.log("[Redis Connector] connected successfully");
            Redis.redis_con = client;
        }
        done(null);
    }

    public static get() {
        return Redis.redis_con;
    }

}

export { Redis }