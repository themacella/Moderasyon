const Discord = require("discord.js");
const ayarlar = require('../ayarlar.json');

module.exports.run = async (bot, message, args, user) => {

  let day = message.guild.createdAt.getDate()
  let month = 1 + message.guild.createdAt.getMonth()
  let year = message.guild.createdAt.getFullYear()
  let sicon = message.guild.iconURL;
  
   let serverembed = new Discord.MessageEmbed()
   
   .setAuthor('Sunucu Bilgi')
   
   .setColor("RANDOM")
  
   .setThumbnail(message.guild.iconURL)
   
   .addField('Sunucu Adı',message.guild.name, true)
   .addField("Sunucu İd", message.guild.id, true)
   .addField("Sunucu Sahibi", message.guild.owner.user.tag, true)
   .addField("Üyeler", message.guild.memberCount, true)
   .addField("Kanallar", message.guild.channels.size, true)
   .addField("Roller", message.guild.roles.size, true)
   
   message.channel.send(serverembed);

}

exports.conf = {
  enabled: true, 
  guildOnly: false,
  aliases: ['sunucu-bilgi','sbilgi','s-bilgi'], 
  permLevel: 0 
};

exports.help = {
  name: 'sunucubilgi', 
  description: 'Sunucu hakkında bilgi verir.',
  usage: 'sunucubilgi' 
};
