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
const httpResponseCodes_1 = require("../utils/httpResponseCodes");
const User_1 = require("../database/User");
const router = express_1.default.Router();
exports.routes = router;
function findToken(fireBaseToken) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield User_1.User.query().findOne("fireBaseToken", fireBaseToken);
    });
}
//PARA SABER QUE FUNCIONA EN HEROKU
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("HOME");
}));
router.get('/review', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("reviewing at", new Date());
    res.send("Review here!");
}));
router.post('/user/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const user = yield findToken(token);
    if (user) {
        res.send({ "code": httpResponseCodes_1.httpCodes.CONFLICT, "Error": "TOKEN ALREADY EXISTS" });
        return;
    }
    const insertedToken = yield User_1.User.query().insert({ fireBaseToken: token });
    res.send(true);
}));
