const Discord = require("discord.js");
const bot = new Discord.Client();

const token = 'ODQ4OTQ2MzAyOTIxNzM2MjM0.YLUA2w.8cI1jz1UCi9QxlD4ut8NfrEclA4';
bot.login(token);

const ytdl = require("ytdL-core");

const PREFIX = '.';

var servers = {};

bot.on('ready', () => {
    console.log("O bot tá ligado zz");
});


bot.on('message', message=>{
    if(message.content[0] === PREFIX){
        console.log(message.content[0], PREFIX);
        let args = message.content.substring(PREFIX.length).split(" ");
        console.log(args);

        vc = message.member.voice.channel

        switch(args[0]){
            case 'play':


                function Play(message, connection){

                    var server = servers[message.guild.id];

                    server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));

                    server.queue.shift();

                    server.dispatcher.on("end", function(){
                        if(server.queue[0]){
                            Play(message, connection)
                        }
                        else{
                            connection.disconnect()
                        }
                    })
                }

                if(!args[1]){
                    message.channel.send("Pede a música aí");
                    return
                }

                if(!vc){
                    message.channel.send("Vc tem q tá num canal né meu balaustre");
                    return
                }

                if(!servers[message.guild.id]) servers[message.guild.id] = {
                    queue: []
                }

                var server = servers[message.guild.id];

                if(!vc) vc.join().then(function(connection){
                    Play(message, connection);
                })
                server.queue.push(args[1]);

                break;

            case 'skip':

                var server = servers[message.guild.id];
                if(server.dispatcher) server.dispatcher.end();    

                break;

            case 'stop':
                var server = servers[message.guild.id];
                if(vc){
                    for(var i = 0; i < server.queue.length; i++){
                        server.queue.splice(i, 1);
                    }
                    server.dispatcher.end();
                    message.guild.voice.connection.disconnect();
                }        
            }
    }

});