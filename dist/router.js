"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const CTL = require("./controllers");
class Routes {
    app;
    gold;
    product;
    user;
    constructor(app) {
        this.app = app;
        this.gold = new CTL.Gold();
        this.product = new CTL.Product();
        this.user = new CTL.User();
    }
    mapRoutes = () => {
        this.app.get('/', (req, res) => { res.send("Hello"); });
        // Users
        this.app.post('/signup', this.user.signUp);
        this.app.post('/signin', this.user.singIn);
        this.app.get('/users', this.user.getUsers);
        // Gold
        this.app.get('/get-gold', this.gold.getGoldPrice);
        // products
        this.app.get('/products', this.product.getProduct);
    };
}
exports.Routes = Routes;
//# sourceMappingURL=router.js.map