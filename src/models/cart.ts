
import { ObjectIdColumn, Column } from "typeorm"
import { ObjectId } from 'mongodb'

export class Cart {

    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    user_id: ObjectId;

    @Column()
    products_in_cart: []

    constructor(user_id: string) {
        this._id = new ObjectId();
        this.user_id = new ObjectId(user_id);
    }
}

export class CartData {
    constructor(product_id: string) {
        this.product_id = new ObjectId(product_id);
    }
    product_id: ObjectId;
    count: number;
}