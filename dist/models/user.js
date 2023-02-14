"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const mongodb_1 = require("mongodb");
let User = class User {
    _id;
    email;
    password;
    firstName;
    lastName;
    salt;
    constructor() {
        this._id = new mongodb_1.ObjectId();
        // this.firstName = firstName;
        // this.lastName = lastName;
        // this.email = email;
        // this.password = password;
    }
};
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", mongodb_1.ObjectId)
], User.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "salt", void 0);
User = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [])
], User);
exports.User = User;
// import {} from "mongodb";
// const collection = "Users"
// const User = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     f_name: {
//         type: String,
//         required: trueW
//     },
//     l_name: {
//         type: String,
//         required: true
//     }
// }, {
//     timestamps: true,
//     versionKey: false,
//     collection
// });
// module.exports = mongoose.model(collection, User);
//# sourceMappingURL=user.js.map