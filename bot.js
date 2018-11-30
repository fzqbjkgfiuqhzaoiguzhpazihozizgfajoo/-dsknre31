const Discord = require("discord.js");
const client = new Discord.Client();
var prefix1 = 'os-';
const getYoutubeID = require('get-youtube-id');
const fetchVideoInfo = require('youtube-info');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube("AIzaSyAdORXg7UZUo7sePv97JyoDqtQVi3Ll0b8");
const queue = new Map();

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
client.on('message', async msg => { // eslint-disable-line
	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(prefix)) return undefined;
	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);
	let command = msg.content.toLowerCase().split(" ")[0];
	command = command.slice(prefix.length)
	if (command === `play`) {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('Please connect to a voice channel.')
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send(` **${playlist.title}** Successfully Added to queue `)
		} else {
			try {

				var video = await youtube.getVideo(url);
			} catch (error) {
				try {// Danger
					var videos = await youtube.searchVideos(searchString, 5);
					let index = 0;
					const embed1 = new Discord.RichEmbed()
			        .setDescription(`****Choose a number between **1-5** :
${videos.map(video2 => `[**${++index} **] \`${video2.title}\``).join('\n')}`)
					.setFooter("CODES")
					msg.channel.sendEmbed(embed1).then(message =>{message.delete(20000)})
					
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 15000,
							errors: ['time']
						});// Danger
					} catch (err) {
						console.error(err);
						return msg.channel.send('The Time is over no one choose .')
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send(':X: No results ');
				}
			}// Danger

			return handleVideo(video, msg, voiceChannel);
		}// Danger
	} else if (command === `skip`) {
		if (!msg.member.voiceChannel) return msg.channel.send('أYou are not in a voice channel');
		if (!serverQueue) return msg.channel.send(`There currently isn't any music playing in this guild`);
		serverQueue.connection.dispatcher.end('Successfully skiped the vedio.');
		return undefined;
	} else if (command === `stop`) {// Danger
		if (!msg.member.voiceChannel) return msg.channel.send('أYou are not in a voice channel');
		if (!serverQueue) return msg.channel.send(`There currently isn't any music playing in this guild`);
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Successfully Stoped the vedio');
		return undefined;
	} else if (command === `vol`) {
		if (!msg.member.voiceChannel) return msg.channel.send('أYou are not in a voice channel');
		if (!serverQueue) return msg.channel.send(`There currently isn't any music playing in this guild`);
		if (!args[1]) return msg.channel.send(`:loud_sound: Volume Level **${serverQueue.volume}**`);
		serverQueue.volume = args[1];// Danger
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 50);
		return msg.channel.send(`:speaker:Successfully changed the volume from ${serverQueue.volume} to  **${args[1]}**`);
	} else if (command === `np`) {
		if (!serverQueue) return msg.channel.send('Nothing is playing.')
		const embedNP = new Discord.RichEmbed()
	.setDescription(`:notes: Now is playing : **${serverQueue.songs[0].title}**`)
		return msg.channel.sendEmbed(embedNP);
	} else if (command === `queue`) {
		// Danger
		if (!serverQueue) return msg.channel.send(`There currently isn't any music playing in this guild`);
		let index = 0;
		// Danger
		const embedqu = new Discord.RichEmbed()
// Danger
.setDescription(`**Songs Queue**
${serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join('\n')}
**Now is playing** ${serverQueue.songs[0].title}`)
		return msg.channel.sendEmbed(embedqu);
	} else if (command === `pause`) {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('Successfully paused the vedio.')
		}// Danger
		return msg.channel.send(`There currently isn't any music playing in this guild`)
	} else if (command === "resume") {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send(`Successfully resumed the vedio.`)
		}// Danger
		return msg.channel.send(`There currently isn't any music playing in this guild`)
	}

}
  
});
// Danger
async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	// Danger
//	console.log('yao: ' + Util.escapeMarkdown(video.thumbnailUrl));
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};// Danger
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};// Danger
		queue.set(msg.guild.id, queueConstruct);
// Danger
		queueConstruct.songs.push(song);
// Danger
		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send (`I cant join to this room ${error}`);
		}
	} else {// Danger
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(` **${song.title}** Successfully add the music to the queue `)
	}
	return undefined;
}// Danger

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {// Danger
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;// Danger
	}// Danger
	console.log(serverQueue.songs);
// Danger
	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {// Danger
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();// Danger
			play(guild, serverQueue.songs[0]);
		})// Danger
		.on('error', error => console.error(error));// Danger
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);// Danger

	serverQueue.textChannel.send(`Start playing : **${song.title}**`);
}// Danger


//           Music 2           //

//           Music 3           //

client1.login(process.env.BOT1_TOKEN);

client2.login(process.env.BOT2_TOKEN);

client3.login(process.env.BOT3_TOKEN);

client.login(process.env.BOT_TOKEN);


