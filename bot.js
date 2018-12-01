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
var prefix = '122';
var prefix2 = '233';
var prefix3 = '344';


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
        maxUses: 100,
        maxAge: 86400
    }).then(invite =>
    message.author.send(`** الرابط : ${invite.url} \n هذا الرابط لمدة 24 ساعة تقدر تدعي 100 شخص**`),
    
    message.channel.send(`**تم الارسال في الخاص .. :postbox: **`)
    )
        }    
});



client.on("guildMemberAdd", (member) => {
        var guild = client.guilds.find("name", 'Oreo Area ,');
const channel = guild.channels.find(channel => channel.name == 'oreo');
         channel.send(`** # Welcome To Our Server :rose: .. **`);
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


client1.login(process.env.BOT1_TOKEN);

client2.login(process.env.BOT2_TOKEN);

client3.login(process.env.BOT3_TOKEN);

client.login(process.env.BOT_TOKEN);


