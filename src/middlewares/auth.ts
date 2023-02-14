require('dotenv').config();
import { NextFunction, Request, Response } from 'express';
import HTTP from 'http-status-codes'
import { MongoDbClient } from '../libs/mongo_con'
import { ObjectId } from 'mongodb'

import * as jwt from 'jsonwebtoken'

export class AuthMiddleware {
    constructor() { }

    public async validateToken(req: Request, res: Response, next: NextFunction) {
        try {
            let { authorization }: any = req.headers;

            if (!authorization) return res.status(HTTP.UNAUTHORIZED).json({ status: 0, message: "missing authentication in header" })

            if (authorization) {
                const token = authorization.split(' ')[1]

                jwt.verify(token, process.env.SECRET_KEY);


                next();
            }

        }
        catch (error) {
            return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ status: 0, message: error.message })
        }
    }

    public async refresh_token(req: Request, res: Response, next: NextFunction) {
        try {
            let { authorization }: any = req.headers;

            if (!authorization) return res.status(HTTP.UNAUTHORIZED).json({ status: 0, message: "missing authentication in header" })

            if (authorization) {
                const token = authorization.split(' ')[1]

                let check_refresh_token = jwt.verify(token, process.env.SECRET_KEY);

                const collectionName = `users`;
                let user = await MongoDbClient.get("shop_user").collection(collectionName).findOne({ _id: new ObjectId(check_refresh_token.user_id) })

                const gen_token = jwt.sign(
                    { user_id: user._id },
                    process.env.SECRET_KEY,
                    { expiresIn: "1d"}
                )


                let update = await MongoDbClient.get("shop_user").collection(collectionName).updateOne(
                    { _id: new ObjectId(check_refresh_token.user_id) },
                    { $set: { "auth_token": gen_token } }
                )

                let data: any = {};

                if (update.acknowledged) {
                    data.id = user._id
                    data.email = user.email
                    data.firstName = user.firstName;
                    data.lastName = user.lastName;
                    data.token = user.auth_token;
                    data.refresh_token = user.refresh_token;

                    return res.status(HTTP.OK).json({ status: 1, message: 'OK', data: data })
                } else {
                    throw new Error("ERROR Gen new token");
                }

            }

        } catch (error) {
            return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ status: 0, message: error.message })
        }
    }

}