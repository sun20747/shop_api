"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const HTTP = require("http-status-codes");
require('dotenv').config();
const user_1 = require("../models/user");
const mongo_con_1 = require("../libs/mongo_con");
class User {
    // productSer: ProductsService;
    constructor() {
        // this.productSer = new ProductsService();
    }
    signUp = async (req, res) => {
        try {
            const { firstName, lasstName, password, email } = req.body;
            const collectionName = `users`;
            const ckecker_email = await mongo_con_1.MongoDbClient.get_2().collection(collectionName).find({ email: email }).toArray();
            if (ckecker_email.length)
                return res.status(400).json({ status: 0, message: "this email is already registered" });
            const MD5password = md5(password);
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(MD5password, salt);
            let user = new user_1.User();
            user.salt = salt;
            user.email = email;
            user.password = hash;
            user.firstName = firstName;
            user.lastName = lasstName;
            let insertOne = await mongo_con_1.MongoDbClient.get_2().collection(collectionName).insertOne(user);
            let [data] = await mongo_con_1.MongoDbClient.get_2().collection(collectionName).find({ _id: insertOne.insertedId }).toArray();
            console.log(data);
            const token = jwt.sign({ user_id: data.salt }, process.env.SECRET_KEY, { expiresIn: 60 });
            console.log(token, typeof token);
            data.token = token;
            delete data.salt;
            delete data.password;
            return res.status(200).json({ status: 1, message: "success", data: data });
        }
        catch (error) {
            return res.status(500).json({ status: 0, message: error });
        }
    };
    singIn = async (req, res) => {
        try {
            let email = req.body.email ? req.body.email : null;
            let password = req.body.password ? req.body.password : null;
            if (!password || !email)
                return res.status(HTTP.BAD_REQUEST).json({ status: 0, message: "Please enter your email or password" });
            let data = {};
            if (password && email) {
                const collectionName = `users`;
                let user = await mongo_con_1.MongoDbClient.get_2().collection(collectionName).findOne({ email: email });
                console.log(user);
                const MD5password = md5(password);
                let checkUserPasswd = await bcrypt.compare(MD5password, user.password);
                // console.log(checkUserPasswd);
                if (checkUserPasswd) {
                    const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY, { expiresIn: 60 });
                    data.id = user.id;
                    data.email = user.email;
                    data.firstName = user.firstName;
                    data.lastName = user.lastName;
                    data.token = token;
                    // console.log(token, user, data);
                }
                else {
                    return res.status(HTTP.UNAUTHORIZED).json({ status: 0, message: 'InValid password' });
                }
            }
            return res.status(HTTP.OK).json({ status: 1, message: "success", data: data });
        }
        catch (error) {
            return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ status: 0, message: error });
        }
    };
    getUsers = async (req, res) => {
        try {
            const collectionName = `users`;
            const data = await mongo_con_1.MongoDbClient.get_2().collection(collectionName).find().toArray();
            console.log(data);
            return res.status(200).send({
                code: 1,
                message: "OK",
                data: data
            });
        }
        catch (error) {
            return res.status(500).send({
                code: 0,
                message: "Err" + error
            });
        }
    };
}
exports.User = User;
//# sourceMappingURL=user.con.js.map