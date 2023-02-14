"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gold = void 0;
const axios_1 = require("axios");
const Cheerio = require("cheerio");
class Gold {
    constructor() {
    }
    getGoldPrice = async (req, res) => {
        try {
            const data = await axios_1.default.get('https://www.goldtraders.or.th');
            if (data.status !== 200)
                return res.status(data.status).send({ message: "Invalid url" });
            const html = await data.data;
            const $ = Cheerio.load(html);
            const result = Array.from($('div#DetailPlace_uc_goldprices1_GoldPricesUpdatePanel'));
            let item = $(result).find('').text();
            console.log(result);
            return res.status(200).send({
                code: 1,
                message: "OK",
                data: []
            });
        }
        catch (error) {
            console.log(error);
        }
    };
}
exports.Gold = Gold;
//# sourceMappingURL=gold.js.map