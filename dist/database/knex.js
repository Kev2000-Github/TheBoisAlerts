"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const knexConfig_1 = __importDefault(require("./knexConfig"));
const config_1 = __importDefault(require("../config/config"));
exports.default = knex_1.default(knexConfig_1.default[config_1.default.mode]);
