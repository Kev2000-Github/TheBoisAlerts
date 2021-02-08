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
const symbol = 'SFP';
router.get('/review', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("reviewing at", new Date());
    const coinInDb = yield findSymbolInDb(symbol);
    if (!coinInDb) {
        const response = yield axios_1.default.get('https://api.binance.com/api/v3/exchangeInfo');
        const symbols = response.data.symbols;
        const found = symbols.find((sym) => sym.baseAsset === symbol);
        console.log('found=', found);
        if (found) {
            yield notifyUsers();
            yield addSymbolToDb(found.symbol, found.baseAsset, found.quoteAsset);
        }
    }
    res.send("Review here!");
}));
const options = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.SERVER_KEY
    }
};
const notifyUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = yield findUserTokens();
    return yield axios_1.default.post('https://fcm.googleapis.com/fcm/send', {
        data: { title: "New token has been listed!" },
        registration_ids: tokens,
        priority: 'high'
    }, options);
});
const addSymbolToDb = (sym, baseAsset, quoteAsset) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Symbol_1.Symbol.query().insert({ symbol: sym, baseAsset, quoteAsset });
});
const findSymbolInDb = (sym) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    return yield ((_a = User_1.User.query().findById(sym)) === null || _a === void 0 ? void 0 : _a[0]);
});
const findUserTokens = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield User_1.User.query().from('User');
});
router.post('/user/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('post user');
    const token = req.params.token;
    const user = yield findToken(token);
    console.log('user found=', user);
    if (!user) {
        yield User_1.User.query().insert({ fireBaseToken: token });
    }
    console.log('sending true');
    res.send(true);
}));
