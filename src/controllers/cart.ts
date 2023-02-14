import { Request, Response } from 'express'
import { MongoDbClient } from "../libs/mongo_con"
import { ObjectId } from 'mongodb';
import HTTP = require('http-status-codes');
import { Cart as CartMo, CartData as CartDataMo } from '../models/cart'
 
export class Cart {
    constructor() { }

    postCart = async (req: Request, res: Response) => {
        try {
            const { user_id, products } = req.body            
            const collectionName = `cart`;
            const cart = new CartMo(user_id);
            let cart_data: any
            
            if (products.length === 0) {
                cart_data = await MongoDbClient.get('shop').collection(collectionName).findOneAndUpdate({ user_id: cart.user_id }, {
                    $set: {
                        products_in_cart: []
                    }
                })
            }

            let productAndCount = products.map(p => {
                const product = new CartDataMo(p._id);
                product.count = p.count
                return product
            });
            cart.products_in_cart = productAndCount
            const chack_cart = await MongoDbClient.get('shop').collection(collectionName).findOne({ user_id: cart.user_id });
            
            if (chack_cart) {
                cart_data = await MongoDbClient.get('shop').collection(collectionName).findOneAndUpdate({ user_id: cart.user_id }, {
                    $set: {
                        products_in_cart: productAndCount
                    }
                })
            } else {
                cart_data = await MongoDbClient.get('shop').collection(collectionName).insertOne(cart)
            }
            const data = await MongoDbClient.get('shop').collection(collectionName).findOne({ user_id: cart.user_id })
            return res.status(HTTP.OK).json({ code: 1, message: "success", data: data })

        } catch (error) {
            return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ code: 0, message: error })

        }
    }

    getCart = async (req: Request, res: Response) => {
        try {
            const user_id: any = req.query.user_id
            // new ObjectId(user_id);
            const collectionName = `cart`;
            const cart_data = await MongoDbClient.get('shop').collection(collectionName).findOne({ user_id: new ObjectId(user_id) })
            const products = await MongoDbClient.get('shop').collection("products").find({
                _id: {
                    $in: cart_data.products_in_cart.map(p => p.product_id)
                }
            }).toArray();            
            products.map(p => {
                let data = cart_data.products_in_cart.find((c: any) => c.product_id.toString() == p._id.toString())                
                p.count = data.count
                return p
            })

            return res.status(HTTP.OK).json({ code: 1, message: "success", data: products })
        } catch (error) {
            return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ code: 0, message: error })
        }

    }



}
