"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
exports.default = {
    development: {
        client: 'mysql',
        connection: config_1.default.connection,
        debug: true,
        log: {
            warn(message) {
            },
            error(message) {
            },
            deprecate(message) {
            },
            debug(message) {
            },
        }
    },
    test: {
        client: 'mysql',
        connection: config_1.default.connection,
        debug: true,
        log: {
            warn(message) {
            },
            error(message) {
            },
            deprecate(message) {
            },
            debug(message) {
            },
        }
    },
    production: {
        client: 'mysql',
        connection: config_1.default.connection,
        pool: {
            min: 2,
            max: 10,
        }
    }
};
