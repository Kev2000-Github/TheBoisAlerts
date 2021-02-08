import express from 'express';
import { httpCodes } from '../utils/httpResponseCodes';
import { User } from '../database/User';
import { Symbol } from '../database/Symbol';
import axios from 'axios';

const router = express.Router();

async function findToken(fireBaseToken) {
    return await User.query().findById(fireBaseToken);
}

//PARA SABER QUE FUNCIONA EN HEROKU
router.get('/', async (req, res) => {
    res.send("HOME");
})

// const symbol = 'SFP'

router.get('/review', async (req, res) => {
    const symbol = req.query.symbol
    console.log("reviewing at", new Date(), symbol);
    if (!symbol || symbol === "") return

    //@ts-ignore
    const coinInDb = await findSymbolInDb(symbol)
    if (!coinInDb) {
        const response = await axios.get('https://api.binance.com/api/v3/exchangeInfo')
        const symbols = response.data.symbols
        const found = symbols.find((sym) => sym.baseAsset === symbol)
        console.log('found=', found);
        if (found) {
            await notifyUsers()
            await addSymbolToDb(found.symbol, found.baseAsset, found.quoteAsset)
        }
    }

    res.send("Review here!");
})


const options = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.SERVER_KEY
    }
};

const notifyUsers = async () => {
    const tokens = await findUserTokens()
    console.log('notifyusers=', tokens);

    const googleResponse = await axios.post('https://fcm.googleapis.com/fcm/send', {
        data: { title: "New token has been listed!" },
        registration_ids: tokens,
        priority: 'high'
    }, options);
    console.log('response = ', googleResponse);
}

const addSymbolToDb = async (sym: string, baseAsset: string, quoteAsset: string) => {
    return await Symbol.query().insert({ symbol: sym, baseAsset, quoteAsset })
}

const findSymbolInDb = async (sym: string) => {
    return await User.query().findById(sym)?.[0]
}

const findUserTokens = async () => {
    return (await User.query().from('User')).map((user) => user.fireBaseToken)
}

router.post('/user/:token', async (req, res) => {
    const token = req.params.token;
    const user = await findToken(token);
    if (!user) {
        await User.query().insert({ fireBaseToken: token });
    }
    res.send(true);
})

export { router as routes }