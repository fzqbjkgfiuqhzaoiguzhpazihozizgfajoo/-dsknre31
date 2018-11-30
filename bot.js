const Discord = require("discord.js");
const client = new Discord.Client();
var prefix = 'os-';



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
    if (message.content.startsWith(prefix + 'bc')) {
	if(!args[0]) return message.channel.send(`Error: You have to write a message .`);
	message.channel.send(`Sending message to ${message.guild.memberCount} members ..`);
            message.guild.members.forEach(m => {
	m.send(`${args}`)
	    });
	}
});

client.login(process.env.BOT_TOKEN);
