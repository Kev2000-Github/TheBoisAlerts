"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const env = (process.env.NODE_ENV || "development").trim();
switch (env) {
    case "test":
        require("dotenv").config({
            path: path.join(__dirname, "..", "..", ".env.test"),
        });
        break;
    case "development":
        require("dotenv").config();
        break;
    default:
}
const config = {
    mode: env,
    connection: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    }
};
exports.default = config;
