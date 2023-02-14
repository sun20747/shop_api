import { Request, Response } from 'express'
import { ProductsService } from '../services/products'
import axios from 'axios'
import { MongoDbClient } from "../libs/mongo_con"
import { ObjectId } from 'mongodb';

export class Product {
    productSer: ProductsService;
    constructor() {
        this.productSer = new ProductsService();
    }

    getProduct = async (req: Request, res: Response) => {
        try {
            const collectionName = `products`;
            const data = await MongoDbClient.get("shop").collection(collectionName).find().toArray();
            // throw createError
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
    getProductById = async (req: Request, res: Response) => {
        try {
            let product_id = req.body.product_id;
            const collectionName = `products`;
            const data = await MongoDbClient.get("shop").collection(collectionName).findOne({ _id: new ObjectId(product_id) });

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
