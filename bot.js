const Discord = require("discord.js");
const client = new Discord.Client();
var prefix1 = 'os-';

// Bot
const Discord1 = require("discord.js");
const client1 = new Discord1.Client();
const Discord2 = require("discord.js");
const client2 = new Discord2.Client();
const Discord3 = require("discord.js");
const client3 = new Discord3.Client();

const ytdl = require("ytdl-core");
const search = require("yt-search");
const ownerID = '455331653309562910';
const active = new Map();
let ops = {ownerID : ownerID,active: active};
var prefix = '1';
var prefix2 = '2';
var prefix3 = '3';


client1.on('ready' , () => {
    console.log('Online.');
client1.user.setActivity('1play .. Oreo ', {type: 'LISTENING' });
});
client2.on('ready' , () => {
    console.log('Online.');
client2.user.setActivity('2play .. Oreo', {type: 'LISTENING' });
});
client3.on('ready' , () => {
    console.log('Online.');
client3.user.setActivity('3play .. Oreo', {type: 'LISTENING' });
});
client.on('ready' , () => {
    console.log('Online.');
client.user.setActivity('Oreo Server', {type: 'LISTENING' });
});



client.on('message', message => {
	if (!message.channel.guild) return;
	if (message.author.bot) return;
        if (message.content.startsWith( 'رابط')) {
    const invite = message.channel.createInvite({
        thing: true,
        maxUses: 2,
        maxAge: 86400
    }).then(invite =>
    message.author.send(`** الرابط : ${invite.url} \n هذا الرابط لمدة 24 ساعة تقدر تدعي شخصين فيه**`),
    
    message.channel.send(`**تم الارسال في الخاص .. :postbox: **`)
    )
        }    
});



client.on('message', message => {
	if (!message.channel.guild) return;
	if (message.author.bot) return;
    let args = message.content.split(" ").slice(1).join(" ");
    if (message.content.startsWith(prefix1 + 'bc')) {
	if(!args[0]) return message.channel.send(`Error: You have to write a message .`);
	message.channel.send(`Sending message to ${message.guild.memberCount} members ..`);
            message.guild.members.forEach(m => {
	m.send(`${args}`)
	    });
	}
});

//           Music 1           //

client1.on('message', message => {

    if (!message.channel.guild) return;
    if (message.author.bot) return;
        let args = message.content.slice(prefix.length).trim().split(' ');
        if (message.content.startsWith(prefix + `search`)) {
    search(args.join(' '), function(err, res) {
       if(err) return message.channel.send(`Sorry, something went wrong`);
       
       let videos = res.videos.slice(0 , 5);
       
       let resp = '';
       for (var i in videos) {
        resp += `\n**[${parseInt(i)+1}]:** \` ${videos[i].title}\`. `;
        
       }
       resp += `\n**Choose a number between **\`1-${videos.length}\`.`;
       
       
       message.channel.send(resp);
       
       const filter = m => !isNaN(m.content) && m.content < videos.length+1 && m.content > 0;
       const collector = message.channel.createMessageCollector(filter);
       
       collector.videos = videos;

       
    });
}
});
//leave
client1.on('message', message => {
    if (!message.channel.guild) return;
    if (message.author.bot) return;
    if (message.content.startsWith(prefix + `leave`)) {

    if (!message.member.voiceChannel) return message.channel.send('Please connect to a voice channel');
    if (!message.guild.me.voiceChannel) return message.channel.send(`Sorry, the bot isn't connected to a channel`);
    if (message.guild.me.voiceChannelID !== message.member.voiceChannelID) return message.channel.send(`sorry you aren't connected to the same channel`);
    
    message.guild.me.voiceChannel.leave();
    
    message.channel.send(`Leaving Channel...`);

    }
    });
//pause
client1.on('message', message => {
    if (!message.channel.guild) return;
    if (message.author.bot) return;
    if (message.content.startsWith(prefix + `pause`)) {

    let fetched = ops.active.get(message.guild.id);
    
    if (!fetched) return message.channel.send(`There currently isn't any music playing in this guild`);
    if (message.guild.me.voiceChannelID !== message.member.voiceChannelID) return message.channel.send(`Sorry, you currently aren't in the same channel as the music bot.`);
    if (fetched.dipatcher.paused) return message.channel.send('this music is already paused.');
    
    fetched.dipatcher.pause();
    
    message.channel.send(`Successfully paused ${fetched.queue[0].SongTitle}.`);
} 
});
//play
client1.on('message', async message => {
    if (!message.channel.guild) return;
    if (message.author.bot) return;
        let args = message.content.slice(prefix.length).trim().split(' ');
        if (message.content.startsWith(prefix + `play`)) {
    if (!message.member.voiceChannel) return message.channel.send('Please connect to a voice channel.');
    if (!args[0]) return message.channel.send('Sorry, please input a url following the channel');
    let validate = await ytdl.validateURL(args[0]);
    let info = await ytdl.getInfo(args[0]);
    if (!validate) return message.channel.send('Sorry, please input a **vaild** url following the command');
    let data = ops.active.get(message.guild.id)  || {};
    if (!data.connection) data.connection = await message.member.voiceChannel.join();
    if (!data.queue) data.queue = [];
    data.guildID = message.guild.id;
    data.queue.push({
       SongTitle: info.title,
       requester: message.author.tag,
       url: args[0],
       announceChannel: message.channel.id
    });
    if (!data.dipatcher) play(client1, ops, data);
    else {
        message.channel.send(`Added To Queue: ${info.title} | Rquested By: ${message.author.id}`);
    }
    
    ops.active.set(message.guild.id, data);
    
}
});
async function play(client1, ops, data) {
    
    client1.channels.get(data.queue[0].announceChannel).send(`Now Playing: ${data.queue[0].SongTitle} | Rquested By: ${data.queue[0].requester}`);
    data.dipatcher = await data.connection.playStream(ytdl(data.queue[0].url, { filter: 'audioonly' }));
    data.dipatcher.guildID = data.guildID;
    
    data.dipatcher.once('finish', function () {
        finish(client1, ops, this);
    });
    
}
function finish(client1, ops, dipatcher) {
    let fetched = ops.active.get(dipatcher.guildID);
    fetched.queue.shift();
    if (fetched.queue.length > 0) {
        ops.active.set(dipatcher.guildID, fetched);
        
        play(client1, ops, fetched);
        
        
    } else {
        ops.active.delete(dipatcher.guildID);
        
        let vc = client1.guilds.get(dipatcher.guildID).me.voiceChannel;
        if (vc) vc.leave();
    }
}
//resume
client1.on('message', message => {

    if (!message.channel.guild) return;
    if (message.author.bot) return;
    if (message.content.startsWith(prefix + `resume`)) {

    let fetched = ops.active.get(message.guild.id);
    
    if (!fetched) return message.channel.send(`There currently isn't any music playing in this guild`);
    if (message.guild.me.voiceChannelID !== message.member.voiceChannelID) return message.channel.send(`Sorry, you currently aren't in the same channel as the music bot.`);
    if (!fetched.dipatcher.paused) return message.channel.send(`this music isn't paused.`);
    
    fetched.dipatcher.resume();
    
    message.channel.send(`Successfully resumed ${fetched.queue[0].SongTitle}.`);
    }
    });
//skip
client1.on('message', message => {

    if (!message.channel.guild) return;
    if (message.author.bot) return;
        let args = message.content.slice(prefix.length).trim().split(' ');
        if (message.content.startsWith(prefix + `skip`)) {
    let fetched = ops.active.get(message.guild.id);
    
    if (!fetched) return message.channel.send(`There currently isn't any music playing in the guild`)
    if (message.guild.me.voiceChannelID !== message.member.voiceChannelID) return message.channel.send(`Sorry, you currently aren't in the same channel as the bot`);
    
    let userCount = message.member.voiceChannel.members.size;
    
    let required = Math.ceil(userCount/2);
    
    if (!fetched.queue[0].voteSkips) fetched.queue[0].voteSkips = [];
    
    if (fetched.queue[0].voteSkips.includes(message.author.id)) return message.channel.send(`Sorry, you already voted to skip! ${fetched.queue[0].voteSkips.length}/${required} required.`);
    
    fetched.queue[0].voteSkips.push(message.member.id);
    
    ops.active.set(message.guild.id, fetched);
    
    if (fetched.queue[0].voteSkips.length >= required) {
        message.channel.send(`Successfully skipped song!`)
        
        
        return fetched.dipatcher.emit('finish')
        
    }
    
    message.channel.send(`Successfully voted to skip! ${fetched.queue[0].voteSkips.length}/${required} required`);
        }
        });
//volume
client1.on('message', message => {

    if (!message.channel.guild) return;
    if (message.author.bot) return;
        let args = message.content.slice(prefix.length).trim().split(' ');
        if (message.content.startsWith(prefix + `volume` || prefix + 'vol')) {
    let fetched = ops.active.get(message.guild.id);
    
    if(!fetched) return message.channel.send(`There currently isn't any music playing in this guild.`);
    if (message.guild.me.voiceChannelID !== message.member.voiceChannelID) return message.channel.send(`Sorry, you aren't connected to the same channel`);
    if (isNaN(args[0]) || args[0] > 200 || args[0] < 0) return message.channel.send(`Please input a number between 0-200`);
    
    fetched.dipatcher.setVolume(args[0]/100);
    message.channel.send(`Successfuly set the volume of ${fetched.queue[0].SongTitle}`);
}
});
//           Music 2           //
//leave
client2.on('message', message => {
    if (!message.channel.guild) return;
    if (message.author.bot) return;
    if (message.content.startsWith(prefix + `leave`)) {

    if (!message.member.voiceChannel) return message.channel.send('Please connect to a voice channel');
    if (!message.guild.me.voiceChannel) return message.channel.send(`Sorry, the bot isn't connected to a channel`);
    if (message.guild.me.voiceChannelID !== message.member.voiceChannelID) return message.channel.send(`sorry you aren't connected to the same channel`);
    
    message.guild.me.voiceChannel.leave();
    
    message.channel.send(`Leaving Channel...`);

    }
    });
//pause
client2.on('message', message => {
    if (!message.channel.guild) return;
    if (message.author.bot) return;
    if (message.content.startsWith(prefix2 + `pause`)) {

    let fetched = ops.active.get(message.guild.id);
    
    if (!fetched) return message.channel.send(`There currently isn't any music playing in this guild`);
    if (message.guild.me.voiceChannelID !== message.member.voiceChannelID) return message.channel.send(`Sorry, you currently aren't in the same channel as the music bot.`);
    if (fetched.dipatcher.paused) return message.channel.send('this music is already paused.');
    
    fetched.dipatcher.pause();
    
    message.channel.send(`Successfully paused ${fetched.queue[0].SongTitle}.`);
} 
});
//play
client2.on('message', async message => {
    if (!message.channel.guild) return;
    if (message.author.bot) return;
        let args = message.content.slice(prefix2.length).trim().split(' ');
        if (message.content.startsWith(prefix2 + `play`)) {
    if (!message.member.voiceChannel) return message.channel.send('Please connect to a voice channel.');
    if (!args[0]) return message.channel.send('Sorry, please input a url following the channel');
    let validate = await ytdl.validateURL(args[0]);
    let info = await ytdl.getInfo(args[0]);
    if (!validate) return message.channel.send('Sorry, please input a **vaild** url following the command');
    let data = ops.active.get(message.guild.id)  || {};
    if (!data.connection) data.connection = await message.member.voiceChannel.join();
    if (!data.queue) data.queue = [];
    data.guildID = message.guild.id;
    data.queue.push({
       SongTitle: info.title,
       requester: message.author.tag,
       url: args[0],
       announceChannel: message.channel.id
    });
    if (!data.dipatcher) play(client, ops, data);
    else {
        message.channel.send(`Added To Queue: ${info.title} | Rquested By: ${message.author.id}`);
    }
    
    ops.active.set(message.guild.id, data);
    
}
});
async function play(client2, ops, data) {
    
    client2.channels.get(data.queue[0].announceChannel).send(`Now Playing: ${data.queue[0].SongTitle} | Rquested By: ${data.queue[0].requester}`);
    data.dipatcher = await data.connection.playStream(ytdl(data.queue[0].url, { filter: 'audioonly' }));
    data.dipatcher.guildID = data.guildID;
    
    data.dipatcher.once('finish', function () {
        finish(client2, ops, this);
    });
    
}
function finish(client2, ops, dipatcher) {
    let fetched = ops.active.get(dipatcher.guildID);
    fetched.queue.shift();
    if (fetched.queue.length > 0) {
        ops.active.set(dipatcher.guildID, fetched);
        
        play(client2, ops, fetched);
        
        
    } else {
        ops.active.delete(dipatcher.guildID);
        
        let vc = client2.guilds.get(dipatcher.guildID).me.voiceChannel;
        if (vc) vc.leave();
    }
}
//resume
client2.on('message', message => {

    if (!message.channel.guild) return;
    if (message.author.bot) return;
    if (message.content.startsWith(prefix2 + `resume`)) {

    let fetched = ops.active.get(message.guild.id);
    
    if (!fetched) return message.channel.send(`There currently isn't any music playing in this guild`);
    if (message.guild.me.voiceChannelID !== message.member.voiceChannelID) return message.channel.send(`Sorry, you currently aren't in the same channel as the music bot.`);
    if (!fetched.dipatcher.paused) return message.channel.send(`this music isn't paused.`);
    
    fetched.dipatcher.resume();
    
    message.channel.send(`Successfully resumed ${fetched.queue[0].SongTitle}.`);
    }
    });
//skip
client2.on('message', message => {

    if (!message.channel.guild) return;
    if (message.author.bot) return;
        let args = message.content.slice(prefix2.length).trim().split(' ');
        if (message.content.startsWith(prefix2 + `skip`)) {
    let fetched = ops.active.get(message.guild.id);
    
    if (!fetched) return message.channel.send(`There currently isn't any music playing in the guild`)
    if (message.guild.me.voiceChannelID !== message.member.voiceChannelID) return message.channel.send(`Sorry, you currently aren't in the same channel as the bot`);
    
    let userCount = message.member.voiceChannel.members.size;
    
    let required = Math.ceil(userCount/2);
    
    if (!fetched.queue[0].voteSkips) fetched.queue[0].voteSkips = [];
    
    if (fetched.queue[0].voteSkips.includes(message.author.id)) return message.channel.send(`Sorry, you already voted to skip! ${fetched.queue[0].voteSkips.length}/${required} required.`);
    
    fetched.queue[0].voteSkips.push(message.member.id);
    
    ops.active.set(message.guild.id, fetched);
    
    if (fetched.queue[0].voteSkips.length >= required) {
        message.channel.send(`Successfully skipped song!`)
        
        
        return fetched.dipatcher.emit('finish')
        
    }
    
    message.channel.send(`Successfully voted to skip! ${fetched.queue[0].voteSkips.length}/${required} required`);
        }
        });
//volume
client2.on('message', message => {

    if (!message.channel.guild) return;
    if (message.author.bot) return;
        let args = message.content.slice(prefix2.length).trim().split(' ');
        if (message.content.startsWith(prefix2 + `volume` || prefix2 + 'vol')) {
    let fetched = ops.active.get(message.guild.id);
    
    if(!fetched) return message.channel.send(`There currently isn't any music playing in this guild.`);
    if (message.guild.me.voiceChannelID !== message.member.voiceChannelID) return message.channel.send(`Sorry, you aren't connected to the same channel`);
    if (isNaN(args[0]) || args[0] > 200 || args[0] < 0) return message.channel.send(`Please input a number between 0-200`);
    
    fetched.dipatcher.setVolume(args[0]/100);
    message.channel.send(`Successfuly set the volume of ${fetched.queue[0].SongTitle}`);
}
});
//           Music 3           //
//leave
client3.on('message', message => {
    if (!message.channel.guild) return;
    if (message.author.bot) return;
    if (message.content.startsWith(prefix3 + `leave`)) {

    if (!message.member.voiceChannel) return message.channel.send('Please connect to a voice channel');
    if (!message.guild.me.voiceChannel) return message.channel.send(`Sorry, the bot isn't connected to a channel`);
    if (message.guild.me.voiceChannelID !== message.member.voiceChannelID) return message.channel.send(`sorry you aren't connected to the same channel`);
    
    message.guild.me.voiceChannel.leave();
    
    message.channel.send(`Leaving Channel...`);

    }
    });
//pause
client3.on('message', message => {
    if (!message.channel.guild) return;
    if (message.author.bot) return;
    if (message.content.startsWith(prefix3 + `pause`)) {

    let fetched = ops.active.get(message.guild.id);
    
    if (!fetched) return message.channel.send(`There currently isn't any music playing in this guild`);
    if (message.guild.me.voiceChannelID !== message.member.voiceChannelID) return message.channel.send(`Sorry, you currently aren't in the same channel as the music bot.`);
    if (fetched.dipatcher.paused) return message.channel.send('this music is already paused.');
    
    fetched.dipatcher.pause();
    
    message.channel.send(`Successfully paused ${fetched.queue[0].SongTitle}.`);
} 
});
//play
client3.on('message', async message => {
    if (!message.channel.guild) return;
    if (message.author.bot) return;
        let args = message.content.slice(prefix3.length).trim().split(' ');
        if (message.content.startsWith(prefix3 + `play`)) {
    if (!message.member.voiceChannel) return message.channel.send('Please connect to a voice channel.');
    if (!args[0]) return message.channel.send('Sorry, please input a url following the channel');
    let validate = await ytdl.validateURL(args[0]);
    let info = await ytdl.getInfo(args[0]);
    if (!validate) return message.channel.send('Sorry, please input a **vaild** url following the command');
    let data = ops.active.get(message.guild.id)  || {};
    if (!data.connection) data.connection = await message.member.voiceChannel.join();
    if (!data.queue) data.queue = [];
    data.guildID = message.guild.id;
    data.queue.push({
       SongTitle: info.title,
       requester: message.author.tag,
       url: args[0],
       announceChannel: message.channel.id
    });
    if (!data.dipatcher) play(client, ops, data);
    else {
        message.channel.send(`Added To Queue: ${info.title} | Rquested By: ${message.author.id}`);
    }
    
    ops.active.set(message.guild.id, data);
    
}
});
async function play(client3, ops, data) {
    
    client3.channels.get(data.queue[0].announceChannel).send(`Now Playing: ${data.queue[0].SongTitle} | Rquested By: ${data.queue[0].requester}`);
    data.dipatcher = await data.connection.playStream(ytdl(data.queue[0].url, { filter: 'audioonly' }));
    data.dipatcher.guildID = data.guildID;
    
    data.dipatcher.once('finish', function () {
        finish(client3, ops, this);
    });
    
}
function finish(client3, ops, dipatcher) {
    let fetched = ops.active.get(dipatcher.guildID);
    fetched.queue.shift();
    if (fetched.queue.length > 0) {
        ops.active.set(dipatcher.guildID, fetched);
        
        play(client3, ops, fetched);
        
        
    } else {
        ops.active.delete(dipatcher.guildID);
        
        let vc = client3.guilds.get(dipatcher.guildID).me.voiceChannel;
        if (vc) vc.leave();
    }
}
//resume
client3.on('message', message => {

    if (!message.channel.guild) return;
    if (message.author.bot) return;
    if (message.content.startsWith(prefix3 + `resume`)) {

    let fetched = ops.active.get(message.guild.id);
    
    if (!fetched) return message.channel.send(`There currently isn't any music playing in this guild`);
    if (message.guild.me.voiceChannelID !== message.member.voiceChannelID) return message.channel.send(`Sorry, you currently aren't in the same channel as the music bot.`);
    if (!fetched.dipatcher.paused) return message.channel.send(`this music isn't paused.`);
    
    fetched.dipatcher.resume();
    
    message.channel.send(`Successfully resumed ${fetched.queue[0].SongTitle}.`);
    }
    });
//skip
client3.on('message', message => {

    if (!message.channel.guild) return;
    if (message.author.bot) return;
        let args = message.content.slice(prefix3.length).trim().split(' ');
        if (message.content.startsWith(prefix3 + `skip`)) {
    let fetched = ops.active.get(message.guild.id);
    
    if (!fetched) return message.channel.send(`There currently isn't any music playing in the guild`)
    if (message.guild.me.voiceChannelID !== message.member.voiceChannelID) return message.channel.send(`Sorry, you currently aren't in the same channel as the bot`);
    
    let userCount = message.member.voiceChannel.members.size;
    
    let required = Math.ceil(userCount/2);
    
    if (!fetched.queue[0].voteSkips) fetched.queue[0].voteSkips = [];
    
    if (fetched.queue[0].voteSkips.includes(message.author.id)) return message.channel.send(`Sorry, you already voted to skip! ${fetched.queue[0].voteSkips.length}/${required} required.`);
    
    fetched.queue[0].voteSkips.push(message.member.id);
    
    ops.active.set(message.guild.id, fetched);
    
    if (fetched.queue[0].voteSkips.length >= required) {
        message.channel.send(`Successfully skipped song!`)
        
        
        return fetched.dipatcher.emit('finish')
        
    }
    
    message.channel.send(`Successfully voted to skip! ${fetched.queue[0].voteSkips.length}/${required} required`);
        }
        });
//volume
client3.on('message', message => {

    if (!message.channel.guild) return;
    if (message.author.bot) return;
        let args = message.content.slice(prefix3.length).trim().split(' ');
        if (message.content.startsWith(prefix3 + `volume` || prefix3 + 'vol')) {
    let fetched = ops.active.get(message.guild.id);
    
    if(!fetched) return message.channel.send(`There currently isn't any music playing in this guild.`);
    if (message.guild.me.voiceChannelID !== message.member.voiceChannelID) return message.channel.send(`Sorry, you aren't connected to the same channel`);
    if (isNaN(args[0]) || args[0] > 200 || args[0] < 0) return message.channel.send(`Please input a number between 0-200`);
    
    fetched.dipatcher.setVolume(args[0]/100);
    message.channel.send(`Successfuly set the volume of ${fetched.queue[0].SongTitle}`);
}
});

client1.login(process.env.BOT1_TOKEN);

client2.login(process.env.BOT2_TOKEN);

client3.login(process.env.BOT3_TOKEN);

client.login(process.env.BOT_TOKEN);


