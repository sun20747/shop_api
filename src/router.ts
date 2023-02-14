import * as express from 'express';
import * as CTL from './controllers';
import * as MDW from './middlewares'


export class Routes {
    AuthMiddleware: MDW.AuthMiddleware;

    gold: CTL.Gold;
    product: CTL.Product;
    user: CTL.User;
    cart: CTL.Cart;
    order: CTL.Order

    constructor(private app: express.Express) {
        this.AuthMiddleware = new MDW.AuthMiddleware();

        this.gold = new CTL.Gold();
        this.product = new CTL.Product();
        this.user = new CTL.User();
        this.cart = new CTL.Cart();
        this.order = new CTL.Order();
    }

    mapRoutes = () => {
        this.app.get('/', (req: express.Request, res: express.Response) => { res.send("Hello") })
        // TOken
        this.app.post('/refresh_token', this.AuthMiddleware.refresh_token);

        // Users
        this.app.post('/signup', this.user.signUp)
        this.app.post('/signin', this.user.singIn)
        this.app.get('/users', this.AuthMiddleware.validateToken, this.user.getUsers)

        // Gold
        this.app.get('/get-gold', this.gold.getGoldPrice);

        // products
        this.app.get('/products', this.AuthMiddleware.validateToken, this.product.getProduct);
        this.app.post('/product', this.AuthMiddleware.validateToken, this.product.getProductById)
        this.app.post('/cart', this.AuthMiddleware.validateToken, this.cart.postCart);
        this.app.get('/cart', this.AuthMiddleware.validateToken, this.cart.getCart);

        // order
        this.app.post('/order', this.AuthMiddleware.validateToken, this.order.portOrder)
        this.app.get('/order', this.AuthMiddleware.validateToken, this.order.getOrder)

    }
}