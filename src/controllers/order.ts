import { Request, Response } from 'express'
import { MongoDbClient } from "../libs/mongo_con"
import { ObjectId } from 'mongodb';
import HTTP = require('http-status-codes');
import { Cart as CartMo, CartData as CartDataMo } from '../models/cart'
import * as _ from 'lodash'

export class Order {
    constructor() { }

    portOrder = async (req: Request, res: Response) => {
        try {
            const { user_id, products } = req.body
            const collectionName_cart = `cart`;
            const collectionName_order = `order`;
            const collectionName_products = `products`;

            const cart = new CartMo(user_id);
            let cart_data: any
            let new_date_order = new Date()

            if (products.length === 0) {
                return res.status(HTTP.OK).json({ code: 1, message: "no product in cart", data: [] })
            }
            await MongoDbClient.get('shop').collection(collectionName_cart).findOneAndUpdate({ user_id: cart.user_id }, {
                $set: {
                    products_in_cart: []
                }
            })
            cart.products_in_cart = products
            let order = _.clone(cart)
            order.data_order = new_date_order
            order.status = 2
            let data = await MongoDbClient.get('shop').collection(collectionName_order).insertOne(order);

            if (data.acknowledged) {
                products.forEach(async (element) => {
                    let product = await MongoDbClient.get('shop').collection(collectionName_products).findOne({ _id: new ObjectId(element._id) })
                    cart_data = MongoDbClient.get('shop').collection(collectionName_products).findOneAndUpdate({ _id: new ObjectId(element._id) }, {
                        $set: {
                            "rating.count": product.rating.count - element.count
                        }
                    })
                });
            }
            return res.status(HTTP.OK).json({ code: 1, message: "success", data: [] })
        } catch (error) {
            return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ code: 0, message: error })
        }
    }

    getOrder = async (req: Request, res: Response) => {
        try {
            const { user_id } = req.query
            const collectionName_order = `order`;
            let orders = await MongoDbClient.get('shop').collection(collectionName_order).find({ user_id: new ObjectId(user_id.toString()) }).sort({ data_order: -1 }).toArray()
            return res.status(HTTP.OK).json({ code: 1, message: "success", data: orders })
        } catch (error) {
            return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ code: 0, message: error })

        }
    }
}
