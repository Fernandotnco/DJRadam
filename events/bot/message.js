
module.exports = (bot, Discord, message)=>{

    const PREFIX = '.';
    if(!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.slice(PREFIX.length).split((' '));
    const cmd = args.shift().toLowerCase();
    console.log(cmd);
    console.log(bot.commands.get('play').aliasses);
    console.log(bot.commands.get('play').aliasses.includes('p'));
    console.log(bot.commands.get('play').aliasses.includes(cmd));
    const command = bot.commands.get(cmd) || bot.commands.find(a => a.aliasses && a.aliasses.includes(cmd));
    console.log(command);

    if(command) command.execute(message, args, cmd, bot, Discord);
}