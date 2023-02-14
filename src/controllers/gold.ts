import { Request, Response } from 'express'
import axios from 'axios'
import * as Cheerio from 'cheerio';

class Gold {
    constructor() {
    }

    getGoldPrice = async (req: Request, res: Response) => {
        try {
            const data = await axios.get('https://www.goldtraders.or.th');

            if (data.status !== 200) return res.status(data.status).send({ message: "Invalid url" })

            const html = await data.data;
            const $ = Cheerio.load(html);

            const result = Array.from($('div#DetailPlace_uc_goldprices1_GoldPricesUpdatePanel'))
            let item = $(result).find('').text();


            console.log(result);

            return res.status(200).send({
                code: 1,
                message: "OK",
                data: []
            });


        } catch (error) {
            console.log(error);

        }

    }
}
export { Gold }