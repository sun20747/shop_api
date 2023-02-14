
import { ObjectIdColumn, Column } from "typeorm"
import { ObjectId } from 'mongodb'

export class User {

    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    salt: string

    @Column()
    auth_token: string

    @Column()
    refresh_token: string

    constructor() {
        this._id = new ObjectId();
    }
}
