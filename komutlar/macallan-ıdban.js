        const { MessageEmbed } = require("discord.js");
        exports.run = async(client, message, args) => {
        
        let log = "836332837438357584"; // ban atıldıktan kayıt alınacak log kanalı.
        
            if (!message.member.roles.cache.has('836332601270599752')&& !message.member.hasPermission("ADMINISTRATOR")) return message.react('❎')
            let member = await client.users.fetch(args[0]);
            if (!args[0]) return message.reply('Bir kullanıcı giriniz.')
            let sebep = args.splice(1).join(" ") || "Bir Sebep Belirtilmemiş"
        
            message.guild.members.ban(member.id, { reason: sebep })
            message.channel.send(new MessageEmbed().setDescription(`<@!${member} Adlı Kullanıcı \`${sebep}\` Sebebiyle Sunucudan Yasaklandı.`).setFooter('Bir Kullanıcı Yasaklandı').setColor('GREEN'))
            client.channels.cache.get(log).send(new MessageEmbed().setDescription(`<@!${member.id}> - ( \`${user.id}\` ) Yasaklandı \nSebep : \`${sebep}\`\nYetkili: ${message.author}`).setColor('RANDOM').setTitle('BİR KULLANICI BANLANDI'))
        };
        exports.conf = {
  aliases: ['iban'],
  permLevel: 0
};

exports.help = {
  name: 'iban'
};
