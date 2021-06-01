const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const queue = new Map();

module.exports = {
    name: 'play',
    aliasses: ['p', 'stop', 'skip'],
    async execute(message, args, cmd, bot, Discord){
        const vc = message.member.voice.channel;
        if(!vc) return message.channel.send("Vc tem q tá num canal pra isso né meu balaustre");

        const serverQueue = queue.get(message.guild.id);
        if(cmd === 'p' || cmd === 'play'){
            if(args.length === 0) return message.channel.send("Vc tem q pedir amúsica maluco");

            let song = {}

            if(ytdl.validateURL(args[0])){
                songInfo = await ytdl.getInfo(args[0]);
                song = {title: songInfo.videoDetails.title, url: songInfo.videoDetails.video.url}
            }
            else{
                const videoFinder = async (query) =>{
                    const video_result = await ytSearch(query);
                    return (video_result.videos.length > 0) ? video_result.videos[0] : null;
                }
                const video = await videoFinder(args.join(' '));
                if(video){
                    song = {title: video.title, url: video.url}
                }
                else{
                    message.channel.send("Esse vídeo nem exite. Tu tá doido");
                }
            }

            if(!serverQueue){
                const queueConstructor ={
                    vc: vc,
                    tc: message.channel,
                    connection: null,
                    songs: []

                }

                queue.set(message.guild.id, queueConstructor);
                queueConstructor.songs.push(song);

                try{
                    const connection = await vc.join();
                    queueConstructor.connection = connection;
                    VideoPlayer(message.guild, queueConstructor.songs[0]);
                }
                catch(e){
                    queue.delete(message.guild.id);
                    message.channel.send("Bugou tudo aqui flw");
                    throw e
                }

            }
            else{
                serverQueue.songs.push(song);
                return message.channel.send(`${song.title} agora ta na fila`);
            }
        }
        else if(cmd === 'skip') SkipSong(message, serverQueue);
        else if(cmd === 'stop') StopSong(message, serverQueue);
    }
}

const VideoPlayer = async (guild, song)=>{
    songQueue = queue.get(guild.id);

    if(!song){
        songQueue.vc.leave();
        queue.delete(guild.id);
        return
    }

    const stream = ytdl(song.url, {filter: 'audioonly'});

    songQueue.connection.play(stream, {seek:0, audio:1}).on("finish" ,() =>{
        songQueue.songs.shift();
        VideoPlayer(guild, songQueue.songs[0]);
    });

    await songQueue.tc.send(`A mais braba foi lançada! Tocando agora ${song.title}`);
}

const SkipSong = (message, serverQueue) =>{
    if (!message.member.voice.channel) return message.channel.send('Adentre um canal de voz antes de lançar esse comando');
    if(!serverQueue){
        return message.channel.send(`A fila está devota de músicas`);
    }
    serverQueue.connection.dispatcher.end();
}

const StopSong = (message, serverQueue) =>{
    if (!message.member.voice.channel) return message.channel.send('Para de tentar tirar a música q o povo ta ouvindo vc nem tá no canal de voz');
    serverQueue.songs = []
    serverQueue.connection.dispatcher.end();
}