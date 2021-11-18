const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
const moment = require("moment");
//Yuri
module.exports.run = async (client, message, args) => {
  let üye = message.mentions.users.first()
  if(üye){
  let durum = üye.presence.status
   .replace("online", "Çevrimiçi")
   .replace("dnd", "Rahatsız Etme")
   .replace("idle", "Boşta")
   .replace("offline", "Çevrimdışı")
    message.channel.send(
      new Discord.MessageEmbed()
      .setThumbnail(üye.displayAvatarURL({dynamic: true}))
      .setColor("#fd8f8f")
      .setTitle(üye.username)
      .setDescription(üye.tag + `Kullanıcısının bilgileri : \n\n\`Kullanıcı Adı\` : ${üye.username}\n\n\`Etiket\` : #${üye.discriminator}\n\n\`ID\` : ${üye.id}\n\n\`Kullanıcı Bot mu ?\` : ${üye.bot ? "Evet" : "Hayır"}\n\n\`Kullanıcı Aktivitesi\` : ${üye.presence.activities[0].state}\n\n\`Kullanıcı Durumu\` : ${durum}\n\n\`Kuruluş Tarihi\` : ${moment(üye.createdAt).format("DD")}/${moment(üye.createdAt).format("MM")}/${moment(üye.createdAt).format("YY HH:mm ss")}\n\n\`Kullanıcının Boost Durumu : \`\n\n\`Kullanıcının Rolleri\` : ${message.guild.members.cache.get(üye.id).roles.cache.filter(r => r !== "@everyone").map(ro => ro).join("|")}`))
      } else {
    üye = message.author
        let durum = üye.presence.status
   .replace("online", "Çevrimiçi")
   .replace("dnd", "Rahatsız Etme")
   .replace("idle", "Boşta")
   .replace("offline", "Çevrimdışı")
    message.channel.send(
      new Discord.MessageEmbed()
      .setThumbnail(üye.displayAvatarURL({dynamic: true}))
      .setColor("#fd8f8f")
      .setTitle(üye.username)
      .setDescription(üye.tag + `Kullanıcısının bilgileri : \n\n\`Kullanıcı Adı\` : ${üye.username}\n\n\`Etiket\` : #${üye.discriminator}\n\n\`ID\` : ${üye.id}\n\n\`Kullanıcı Bot mu ?\` : ${üye.bot ? "Evet" : "Hayır"}\n\n\`Kullanıcı Aktivitesi\` : ${üye.presence.activities[0].state}\n\n\`Kullanıcı Durumu\` : ${durum}\n\n\`Kuruluş Tarihi\` : ${moment(üye.createdAt).format("DD")}/${moment(üye.createdAt).format("MM")}/${moment(üye.createdAt).format("YY HH:mm ss")}\n\n\`Kullanıcının Rolleri\` : ${message.guild.members.cache.get(üye.id).roles.cache.filter(r => r !== "@everyone").map(ro => ro).join("|")}`))
}}
  exports.conf = {
  aliases: ["kbilgi","bilgi"]
};
exports.help = {
  name: 'üyebilgi'
};
