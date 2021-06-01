
const fs = require('fs');

module.exports = (bot, Discord) =>{
    const loadDir = (dirs) => {
        const eventFiles = fs.readdirSync(`./events/${dirs}`).filter(file => file.endsWith('.js'));

        for(const file of eventFiles){
            const event = require(`../events/${dirs}/${file}`);
            const eventName = file.split('.')[0];

            bot.on(eventName, event.bind(null, bot, Discord));
        }
    }

    ['bot', 'guild'].forEach(e => loadDir(e));



}