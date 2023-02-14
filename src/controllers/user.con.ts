import { Request, Response } from 'express'
import axios from 'axios'
import * as jwt from 'jsonwebtoken'
import * as md5 from 'md5'
import * as bcrypt from 'bcrypt';
import HTTP = require('http-status-codes');


require('dotenv').config();

import { User as UserMo } from '../models/user'
import { MongoDbClient } from "../libs/mongo_con"
import { ApiControllerBase } from '../bases/controller'
import { ApiResponse } from '../bases/common.model'
import { Redis } from '../libs/redis_con';

export class User extends ApiControllerBase {
    constructor() {
        super();
    }

    signUp = async (req: Request, res: Response) => {
        try {
            const { firstName, lasstName, password, email } = req.body

            const collectionName = `users`;
            const ckecker_email = await MongoDbClient.get("shop_user").collection(collectionName).find({ email: email }).toArray()

            if (ckecker_email.length) return ApiResponse.sendUnauthorized(res, "this email is already registered")

            const MD5password = md5(password);
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(MD5password, salt);

            let user = new UserMo();

            const token = jwt.sign(
                { user_id: user._id },
                process.env.SECRET_KEY,
                { expiresIn: "1d" }
                // { expiresIn: 60 * 2 }
            );
            const refresh_token = jwt.sign(
                { user_id: user._id },
                process.env.SECRET_KEY,
                { expiresIn: "30d" }
            );

            user.salt = salt;
            user.email = email;
            user.password = hash;
            user.firstName = firstName;
            user.lastName = lasstName;
            user.auth_token = token;
            user.refresh_token = refresh_token;

            let insertOne: any = await MongoDbClient.get("shop_user").collection(collectionName).insertOne(user);

            let [data]: any = await MongoDbClient.get("shop_user").collection(collectionName).find({ _id: insertOne.insertedId }).toArray()

            data.token = token
            delete data.salt
            delete data.password
            delete data.auth_token


            return ApiResponse.Created(res, "success", data);
        } catch (error) {
            console.log(error);

            return ApiResponse.sendInternalError(res, "Error", error)
        }

    }

    singIn = async (req: Request, res: Response) => {
        try {
            let email = req.body.email ? req.body.email : null
            let password = req.body.password ? req.body.password : null

            if (!password || !email) return res.status(HTTP.BAD_REQUEST).json({ status: 0, message: "Please enter your email or password" })

            let data: any = {}
            if (password && email) {
                const collectionName = `users`;
                let user: UserMo | any = await MongoDbClient.get("shop_user").collection(collectionName).findOne({ email: email })
                if (!user) return res.status(HTTP.UNAUTHORIZED).json({ code: 0, message: 'User account not found please register' })

                const MD5password = md5(password);

                let checkUserPasswd = await bcrypt.compare(MD5password, user.password);
                if (checkUserPasswd) {
                    const token = jwt.sign(
                        { user_id: user._id },
                        process.env.SECRET_KEY,
                        { expiresIn: "1d" }
                        // { expiresIn: 60 * 2 }
                    );
                    data.id = user._id
                    data.email = user.email
                    data.firstName = user.firstName;
                    data.lastName = user.lastName;
                    data.token = token;
                    data.refresh_token = user.refresh_token;
                } else {
                    return res.status(HTTP.UNAUTHORIZED).json({ code: 0, message: 'InValid password' })
                }
            }

            return res.status(HTTP.OK).json({ code: 1, message: "success", data: data })

        } catch (error) {
            return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ code: 0, message: error })
        }
    }

    getUsers = async (req: Request, res: Response) => {
        try {
            // Redis.get().set('name', 'atit', { EX: 10 })
            // const value = await Redis.get().get('name');
            // console.log(value);

            const collectionName = `users`;
            const data = await MongoDbClient.get("shop_user").collection(collectionName).find().toArray();
            return res.status(200).send({
                code: 1,
                message: "OK",
                data: data
            })
        } catch (error) {
            return res.status(500).send({
                code: 0,
                message: "Err" + error
            })
        }
    }



}
