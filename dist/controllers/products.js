"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const products_1 = require("../services/products");
const mongo_con_1 = require("../libs/mongo_con");
class Product {
    productSer;
    constructor() {
        this.productSer = new products_1.ProductsService();
    }
    getProduct = async (req, res) => {
        try {
            const collectionName = `products`;
            const data = await mongo_con_1.MongoDbClient.get().collection(collectionName).find().toArray();
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
exports.Product = Product;
//# sourceMappingURL=products.js.map