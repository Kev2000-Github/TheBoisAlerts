"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = require("../database/User");
const Symbol_1 = require("../database/Symbol");
const axios_1 = __importDefault(require("axios"));
const bot_1 = require("./bot");
const router = express_1.default.Router();
exports.routes = router;
function findToken(fireBaseToken) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield User_1.User.query().findById(fireBaseToken);
    });
}
//PARA SABER QUE FUNCIONA EN HEROKU
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("HOME");
}));
// const symbol = 'SFP'
router.get('/review', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const symbol = req.query.symbol;
    console.log("reviewing at", new Date(), symbol);
    if (!symbol || symbol === "")
        return;
    //@ts-ignore
    const coinInDb = yield findSymbolInDb(symbol);
    console.log('coin in db=', coinInDb);
    if (!coinInDb) {
        const response = yield axios_1.default.get('https://api.binance.com/api/v3/exchangeInfo');
        const symbols = response.data.symbols;
        const found = symbols.find((sym) => sym.symbol === symbol);
        console.log('found=', found);
        if (found) {
            yield notifyUsers();
            yield addSymbolToDb(found.symbol, found.baseAsset, found.quoteAsset);
        }
    }
    res.send("Review here!");
}));
const options = (serverKey) => {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': serverKey
        }
    };
};
const notifyUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = yield findUserTokens();
    console.log('notifyusers=', tokens);
    bot_1.bot.sendMessage(bot_1.chatId, "New token has been listed!\n");
    const googleResponse = yield axios_1.default.post('https://fcm.googleapis.com/fcm/send', {
        data: { title: "New token has been listed!" },
        registration_ids: tokens,
        priority: 'high'
    }, options(process.env.SERVER_KEY));
    console.log('response = ', googleResponse);
});
const addSymbolToDb = (sym, baseAsset, quoteAsset) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Symbol_1.Symbol.query().insert({ symbol: sym, baseAsset, quoteAsset });
});
const findSymbolInDb = (sym) => __awaiter(void 0, void 0, void 0, function* () {
    const values = yield Symbol_1.Symbol.query().findById(sym);
    return values;
});
const findUserTokens = () => __awaiter(void 0, void 0, void 0, function* () {
    return (yield User_1.User.query().from('User')).map((user) => user.fireBaseToken);
});
router.post('/user/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const user = yield findToken(token);
    if (!user) {
        yield User_1.User.query().insert({ fireBaseToken: token });
    }
    res.send(true);
}));
