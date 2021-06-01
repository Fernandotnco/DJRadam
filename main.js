const Discord = require("discord.js");
const bot = new Discord.Client();

const token = 'ODQ4OTQ2MzAyOTIxNzM2MjM0.YLUA2w.8cI1jz1UCi9QxlD4ut8NfrEclA4';
bot.login(token);

bot.commands = new Discord.Collection();
bot.events = new Discord.Collection();

['commandHandler', 'eventHandler'].forEach(handler =>{
    require(`./handlers/${handler}`)(bot, Discord);
})