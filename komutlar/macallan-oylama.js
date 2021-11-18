const Discord = require("discord.js");
const config = require("../config");

exports.run = (client, message, args) => {
  if (message.channel.type == "dm") return;
  if (message.channel.type !== "text") return;

  if (!message.member.hasPermission(config.Owner)) return message.reply(`Bu Komutu Kullanabilmek İçin **Mesajları Yönet** İznine Sahip Olmalısın Ama Senin Yok Kullanamazsın`).then(m => m.delete({ timeout: 10000}));

  message.delete();

  let question = args.join(" ");

  let user = message.author.username;

  if (!question) return message.channel.send(new Discord.MessageEmbed().setTitle(`Yazı Yazmayı Unuttun Yaw`)).then(m => m.delete(({ timeout: 5000})));

  message.channel.send(new Discord.MessageEmbed()
        .setColor("007bff")
        .setThumbnail(client.user.avatarURL())
        .setTimestamp()
        .setFooter("Macallan :heart: ", client.user.avatarURL())
        .addField(`${client.user.username}`, `**${question}**`)
    )
.then(async (arc) => {
await arc.react("✅")
await arc.react("❌")
})
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["oylama","voting"],
  permLevel: 0
};

exports.help = {
  name: "oylama",
  description: "Oylama yapmanızı sağlamaktadır.",
  usage: "!oylama <oylamaismi>"
};