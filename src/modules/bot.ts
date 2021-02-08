const Telebot = require('telebot');
require('dotenv').config();
console.log(process.env.NODE_ENV)
export const bot = new Telebot(process.env.BOT_TOKEN);
export const chatId = process.env.CHAT_ID;
bot.start();


