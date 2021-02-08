import express from 'express';
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
    console.log('coin in db=', coinInDb);

    if (!coinInDb) {
        const response = await axios.get('https://api.binance.com/api/v3/exchangeInfo')
        const symbols = response.data.symbols
        const found = symbols.find((sym) => sym.symbol === symbol)
        console.log('found=', found);
        if (found) {
            await notifyUsers()
            await addSymbolToDb(found.symbol, found.baseAsset, found.quoteAsset)
        }
    }

    res.send("Review here!");
})


const options = (serverKey?: string) => {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': serverKey
        }
    }
};

const notifyUsers = async () => {
    const tokens = await findUserTokens()
    console.log('notifyusers=', tokens);

    const googleResponse = await axios.post('https://fcm.googleapis.com/fcm/send', {
        data: { title: "New token has been listed!" },
        registration_ids: tokens,
        priority: 'high'
    }, options(process.env.SERVER_KEY));
    console.log('response = ', googleResponse);
}

const addSymbolToDb = async (sym: string, baseAsset: string, quoteAsset: string) => {
    return await Symbol.query().insert({ symbol: sym, baseAsset, quoteAsset })
}

const findSymbolInDb = async (sym: string) => {
    const values = await Symbol.query().findById(sym)
    return values
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