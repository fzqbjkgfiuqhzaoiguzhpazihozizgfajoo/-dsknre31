const Discord = require("discord.js");
const client = new Discord.Client();
var prefix = 'os-';
const moment = require('moment');
const fs = require("fs");
let sug = JSON.parse(fs.readFileSync(`./sug.json`, `utf8`));

// Bo

client.on('ready' , () => {
    console.log('Online.');
client.user.setActivity('Oreo Server', {type: 'LISTENING' });
});



client.on("error", function(err) {
 return console.log(err);
});



const invites = {};

const wait = require('util').promisify(setTimeout);



client.on('ready', () => {
  wait(1000);

  client.guilds.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
});



client.on('guildMemberAdd', member => {
  member.guild.fetchInvites().then(guildInvites => {
    const ei = invites[member.guild.id];
    invites[member.guild.id] = guildInvites;
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
    const inviter = client.users.get(invite.inviter.id);
    const guild = client.guilds.find(guild => guild.name == 'Oreo Area ,');
    const logChannel = guild.channels.find(channel => channel.name === "invites-log");
    logChannel.send(`#:champagne_glass:  :blue_heart:  Welcome to Oreo <@!${member.user.id}> invited by <@!${inviter.id}> (${invite.uses} invites`);
  });
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



client.on('message' , message => {
	var prefix = '.';
	if (message.author.bot) return;
	if (!message.channel.guild) return;
	let sugC = message.guild.channels.find(channel => channel.name == 'suggestions');
    if (!message.channel.guild) return;
    let args = message.content.split(" ").slice(1).join(" ");
	if (!sug[message.guild.id]) sug[message.guild.id] = {
	    	scase: 0,
    };
    if (message.content.startsWith(prefix + 'sug')) {
    if(!args[0]) return message.channel.send(`**Error : You have to write a message .**`);
        if(!sugC) return;
		let embed = new Discord.RichEmbed();
		embed.setTitle(`New Suggestion :`);
		embed.setAuthor(message.guild.name);
		embed.setThumbnail(message.author.avatarURL);
		embed.setColor('PURPLE');
		embed.setDescription(`** Suggestion Number : ${sug[message.guild.id].scase+1} ,
		
From : \n ${message.author.username}

Suggestion : \n ${args}**`);
		embed.setFooter(message.guild.name, message.guild.iconURL);
		embed.setTimestamp();
	 message.channel.send(`**Done .. :white_check_mark: **`);
	sugC.send(embed);
	sug[message.guild.id].scase += 1;
    }
    fs.writeFile('./sug.json', JSON.stringify(sug), (err) => {
    	if (err) console.error(err);
    });
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
    if (message.content.startsWith(prefix + 'bc')) {
	if(!args[0]) return message.channel.send(`Error: You have to write a message .`);
	message.channel.send(`Sending message to ${message.guild.memberCount} members ..`);
            message.guild.members.forEach(m => {
	m.send(`${args}`)
	    });
	}
});



client.on('message', async message => {
  if(message.content.startsWith(prefix + "voice")) {
  if(!message.guild.member(message.author).hasPermissions('MANAGE_CHANNELS')) return message.reply(':x: **ليس لديك الصلاحيات الكافية**');
  if(!message.guild.member(client.user).hasPermissions(['MANAGE_CHANNELS','MANAGE_ROLES_OR_PERMISSIONS'])) return message.reply(':x: **ليس معي الصلاحيات الكافية**');
  var args = message.content.split(' ').slice(1).join(' ');
  if(args && !args.includes(0)) return message.channel.send(':negative_squared_cross_mark: » فشل اعداد الروم الصوتي .. __يجب عليك كتابة 0 في اسم الروم__');
  if(!args) args = `VoiceOnline: [ ${message.guild.members.filter(s => s.voiceChannel).size} ]`;
  message.channel.send(':white_check_mark: » تم عمل الروم الصوتي بنجاح');
  message.guild.createChannel(`${args.replace(0, message.guild.members.filter(s => s.voiceChannel).size)}`, 'voice').then(c => {
    c.overwritePermissions(message.guild.id, {
      CONNECT: false,
      SPEAK: false
    });
    setInterval(() => {
      c.setName(`${args.replace(0, message.guild.members.filter(s => s.voiceChannel).size)}`).catch(err => {
        if(err) return;
      });
    },3000);
  });
  }
});



client.on('guildMemberAdd', member => {
	if(datediff(parseDate(moment(member.user.createdTimestamp).format('l')), parseDate(moment().format('l'))) < 1) {
		member.guild.member(member).ban({ reason: 'Fake account.' })
 		member.guild.channels.find(channel => channel.name == 'ban-logs').send(`:white_check_mark: | <@${member.id}> Successfully banned. Reason: \`\`Fake account.\`\``);
	}
});
function parseDate(str) {
	var mdy = str.split('/');
	return new Date(mdy[2], mdy[0]-1, mdy[1]);
};
function datediff(first, second) {
	return Math.round((second-first)/(1000*60*60*24));
};


client.on("error", (e)=> console.log(e)); 



client.on("error", function(err) {
 return console.log(err);
});



client.login(process.env.BOT_TOKEN);


