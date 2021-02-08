"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("./modules/app"));
const compression_1 = __importDefault(require("compression"));
const knex_1 = __importDefault(require("./database/knex"));
const objection_1 = require("objection");
//DATABASE SETTINGS
objection_1.Model.knex(knex_1.default);
exports.app = express_1.default();
//APP SETTINGS
exports.app.set("PORT", process.env.PORT || 3000);
if (process.env.NODE_ENV == 'development') {
    const morgan = require('morgan');
    exports.app.use(morgan('dev')); // enable logging
}
exports.app.use(compression_1.default()); // compress responses
exports.app.use(express_1.default.json()); // parse receiving data to json
exports.app.use('/', app_1.default); // add all routes
//APP SERVER
exports.server = exports.app.listen(exports.app.get('PORT'), () => {
    console.log(`app running on port ${exports.app.get("PORT")}`);
});
