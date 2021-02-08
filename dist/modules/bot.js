"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatId = exports.bot = void 0;
const Telebot = require('telebot');
require('dotenv').config();
console.log(process.env.NODE_ENV);
exports.bot = new Telebot(process.env.BOT_TOKEN);
exports.chatId = process.env.CHAT_ID;
exports.bot.start();
