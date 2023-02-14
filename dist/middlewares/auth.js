"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const dotenv_1 = require("dotenv");
dotenv_1.default.config();
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthMiddleware {
    constructor() { }
    async validateToken(req, res, next) {
        try {
            let { authorization } = req.headers;
            if (!authorization)
                return res.status(http_status_codes_1.default.UNAUTHORIZED).json({ status: 0, message: "missing authentication in header" });
            if (authorization) {
                const token = authorization.split(' ')[1];
                jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
                next();
            }
        }
        catch (error) {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ status: 0, message: error.message });
        }
    }
}
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.js.map