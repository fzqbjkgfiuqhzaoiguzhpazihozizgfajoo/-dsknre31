const Discord = require("discord.js");
const client = new Discord.Client();
var prefix = 'os-';
const moment = require('moment');
// Bo

client.on('ready' , () => {
    console.log('Online.');
client.user.setActivity('Oreo Server', {type: 'LISTENING' });
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
    const guild = member.guilds.find(guild => guild.name == 'Oreo Area ,');
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



client.on("guildMemberAdd", (member) => {
        var guild = client.guilds.find("name", 'Oreo Area ,');
	const channel = guild.guild.channels.find(channel => channel.name == 'oreo');
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



client.login(process.env.BOT_TOKEN);


