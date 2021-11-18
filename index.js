const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const moment = require('moment');
var Jimp = require('jimp');
const { Client, Util } = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const express = require('express');
const config = require("./config.js");
require('./util/eventLoader.js')(client);
const path = require('path');
const snekfetch = require('snekfetch');
const ms = require('ms');
const tags = require('common-tags');
//

var prefix = ayarlar.prefix;//
//
const log = message => {//
    console.log(`${message}`);//
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`Macallan Komutları ${files.length} bu kdr simdi yuklenio`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`${props.help.name} Eklendi :P`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};



client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }

    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });
client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});
client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);

//------------------------------------------------------------------------------------------------------------\\
client.on('messageDelete', message => {
    const data = require("quick.db")
    data.set(`snipe.mesaj.${message.guild.id}`, message.content)
    data.set(`snipe.id.${message.guild.id}`, message.author.id)

})

//------------------------------------------------------------------------------------------------------------\\
//şüpheli
client.on("guildMemberAdd", member => {
  var moment = require("moment")
  require("moment-duration-format")
  moment.locale("tr")
   var {Permissions} = require('discord.js');  
   var x = moment(member.user.createdAt).add(14, 'days').fromNow()
   var user = member.user
   x = x.replace("birkaç saniye önce", " ")
   if(!x.includes("önce") || x.includes("sonra") ||x == " ") {
  const kytsz = member.guild.roles.cache.get(config.kaytsz) 
   var rol = member.guild.roles.cache.get(config.ŞüheliRol) // ŞÜPHELİ HESAP ROLÜNÜN İDSİNİ GİRİN
   var kayıtsız = member.guild.roles.cache.get(kytsz) // UNREGİSTER ROLÜNÜN İDSİNİ GİRİN
   member.roles.add(rol)
   member.roles.remove(kytsz)

member.user.send('Selam Dostum Ne Yazık ki Sana Kötü Bir Haberim Var Hesabın 1 Hafta Gibi Kısa Bir Sürede Açıldığı İçin Fake Hesap Katagorisine Giriyorsun Lütfen Bir Yetkiliyle İletişime Geç Onlar Sana Yardımcı Olucaktır.')
setTimeout(() => {

}, 1000)


   }
        else {

        }
    });
//------------------------

client.on("guildMemberAdd", member => {
  member.roles.add(config.kaytsz); // UNREGİSTER ROLÜNÜN İDSİNİ GİRİN
});

//------------------------------------------------------------------------------------------------------------\\
client.on("message", async msg => {
    if (!msg.guild) return;
    if (msg.content.startsWith(ayarlar.prefix + "afk")) return;

    let afk = msg.mentions.users.first();

    const kisi = db.fetch(`afkid_${msg.author.id}_${msg.guild.id}`);

    const isim = db.fetch(`afkAd_${msg.author.id}_${msg.guild.id}`);
    if (afk) {
        const sebep = db.fetch(`afkSebep_${afk.id}_${msg.guild.id}`);
        const kisi3 = db.fetch(`afkid_${afk.id}_${msg.guild.id}`);
        if (msg.content.includes(kisi3)) {
            msg.channel.send(
                new Discord.MessageEmbed()
                    .setColor("BLACK")
                    .setDescription(
                        `<@` +
                        msg.author.id +
                        `> Etiketlediğiniz Kişi Afk \nSebep : ${sebep}`
                    )
            );
        }
    }
    if (msg.author.id === kisi) {
        msg.channel.send(
            new Discord.MessageEmbed()
                .setColor("BLACK")
                .setDescription(`<@${kisi}> Başarıyla Afk Modundan Çıktınız`)
        );
        db.delete(`afkSebep_${msg.author.id}_${msg.guild.id}`);
        db.delete(`afkid_${msg.author.id}_${msg.guild.id}`);
        db.delete(`afkAd_${msg.author.id}_${msg.guild.id}`);
        msg.member.setNickname(isim);
    }
});

//--------------------------------------------------------------------------------------\\


const kiltifat = [
    'Gözlerindeki saklı cenneti benden başkası fark etsin istemiyorum.',
    'Mavi gözlerin, gökyüzü oldu dünyamın.',
    'Parlayan gözlerin ile karanlık gecelerime ay gibi doğuyorsun.',
    'Huzur kokuyor geçtiğin her yer.',
    'Öyle bir duru güzelliğin var ki, seni gören şairler bile adına günlerce şiir yazardı.',
    'Gözlerinin hareketi bile yeter  benim aklımı başımdan almaya.',
    'Güller bile kıskanır seni gördükleri zaman kendi güzelliklerini.',
    'Hiç yazılmamış bir şiirsin sen, daha önce eşi benzeri olmayan.',
    'Adım şaire çıktı civarda. Kimse senin şiir olduğunun farkında değil henüz.',
    'Etkili gülüş kavramını ben senden öğrendim.',
    'Seni anlatmaya kelimeler bulamıyorum. Nasıl anlatacağımı bilemediğim için seni kimselere anlatamıyorum.',
    'Gözlerinle baharı getirdin garip gönlüme.',
    'Bir gülüşün ile çiçek açıyor bahçemdeki her bir çiçek.',
    'Yuva kokuyor kucağın. Sarılınca seninle yuva kurası geliyor insanın.',
    'Sen bu  dünyadaki bütün şarkıların tek sahibisin. Sana yazılıyor bütün şarkılar ve şiirler. Adın geçiyor bütün namelerde.',
    'Seni yüreğimde taşıyorum ben, sırtımda taşımak ne kelime. Ömrüm boyunca çekmeye hazırım her anlamda senin yükünü.',
    'Hayatıma gelerek hayatımdaki bütün önemli şeylerin önemsiz olmasını sağladın. Artık sensin tek önem verdiğim şu hayatta.',
    'Sen benim bu hayattaki en büyük duamsın.  Gözlerin adeta bir ay parçası. Işık oluyorsun karanlık gecelerime.',
    'Aynı zaman diliminde yaşamak benim için büyük ödüldür.',
    'Biraz Çevrendeki İnsanları Takarmısın ?',
    'Kalbime giden yolu aydınlatıyor gözlerin.  Sadece sen görebilirsin kalbimi. Ve sadece ben hissedebilirim bana karşı olan hislerini.',
    'Onu Bunu Boşver de bize gel 2 bira içelim.',
    'Taş gibi kızsın ama okey taşı… Elden elde gidiyorsun farkında değilsin.',
    'Mucizelerden bahsediyordum.',
    "Yaşanılacak en güzel mevsim sensin.",
    "Sıradanlaşmış her şeyi, ne çok güzelleştiriyorsun.",
    "Gönlüm bir şehir ise o şehrin tüm sokakları sana çıkar.",
    "Birilerinin benim için ettiğinin en büyük kanıtı seninle karşılaşmam.",
    "Denize kıyısı olan şehrin huzuru birikmiş yüzüne.",
    "Ben çoktan şairdim ama senin gibi şiiri ilk defa dinliyorum.",
    "Gece yatağa yattığımda aklımda kalan tek gerçek şey sen oluyorsun.",
    "Ne tatlısın sen öyle. Akşam gel de iki bira içelim.",
    "Bir gamzen var sanki cennette bir çukur.",
    "Gecemi aydınlatan yıldızımsın.",
    "Ponçik burnundan ısırırım seni",
    "Bu dünyanın 8. harikası olma ihtimalin?",
    "Dilek tutman için yıldızların kayması mı gerekiyor illa ki? Gönlüm gönlüne kaydı yetmez mi?",
    "Süt içiyorum yarım yağlı, mutluluğum sana bağlı.",
    "Müsaitsen aklım bu gece sende kalacak.",
    "Gemim olsa ne yazar liman sen olmadıktan sonra...",
    "Gözlerimi senden alamıyorum çünkü benim tüm dünyam sensin.",
    "Sabahları görmek istediğim ilk şey sensin.",
    "Mutluluk ne diye sorsalar- cevabı gülüşünde ve o sıcak bakışında arardım.",
    "Hayatım ne kadar saçma olursa olsun, tüm hayallerimi destekleyecek bir kişi var. O da sensin, mükemmel insan.",
    "Bir adada mahsur kalmak isteyeceğim kişiler listemde en üst sırada sen varsın.",
    "Sesini duymaktan- hikayelerini dinlemekten asla bıkmayacağım. Konuşmaktan en çok zevk aldığım kişi sensin.",
    "Üzerinde pijama olsa bile, nasıl oluyor da her zaman bu kadar güzel görünüyorsun? Merhaba, neden bu kadar güzel olduğunu bilmek istiyorum.",
    "Çok yorulmuş olmalısın. Bütün gün aklımda dolaşıp durdun.",
    "Çocukluk yapsan da gönlüme senin için salıncak mı kursam?",
    "Sen birazcık huzur aradığımda gitmekten en çok hoşlandığım yersin.",
    "Hangi çiçek anlatır güzelliğini? Hangi mevsime sığar senin adın. Hiçbir şey yeterli değil senin güzelliğine erişmeye. Sen eşsizsin...",
    "Rotanızı geçen her geminin ışığıyla değil, yıldızlara göre ayarlayın.",
    "Telaşımı hoş gör, ıslandığım ilk yağmursun.",
    "Gülüşün ne güzel öyle- cumhuriyetin gelişi gibi...",
    "Seni yüreğimde taşıyorum ben, sırtımda taşımak ne kelime. Ömrüm boyunca çekmeye hazırım her anlamda senin yükünü.",
    "Seninle aşkı yaşamak çok güzel bir şey ama sensiz kalma korkusunu düşünmek korkutuyor beni.",
    "Kimse konuşmasın yalnız sen konuş bana. Yalnız sen bak gözlerimin içine. Kimse olmasın yalnızca sen ol benim hayatımda.",
    "Tek isteğim seninle yaşlanmak, tek vasiyetim ise gözlerine bakarak hayata gözlerimi yummak",
    "Sen bu  dünyadaki bütün şarkıların tek sahibisin. Sana yazılıyor bütün şarkılar ve şiirler. Adın geçiyor bütün namelerde.",
    "Seni de bu dünyada görünce yaşama sebebimi anladım. Meğer senmişsin beni dünyada yaşamaya zorlayan.",
    "Sen benim yanımda olduğun sürece benim nerde olduğum hiç önemli değil .Kokunu aldığım her yer cennet bana.",
    "Öyle bir duru güzelliğin var ki, seni gören şairler bile adına günlerce şiir yazardı.",
    "Çikolatalı keksin bu alemde teksin",
     "**Macallan diyor ki **Biliyorum ki, dünyaları hak ediyorsun ama sana bunu vermeye gücüm yetmez. Bu yüzden sana aşkımızın filizlerini en iyi şekilde büyütebileceğimiz şeyi vermek istiyorum: Dünyamı.",
    "**Macallan diyor ki **İnsan aşık olduğunda abartılı hareketler yapabilir, fakat sana karşı yaptığım hiçbir şey abartı değil. Benim her şeyim olduğunu ve senin için herşeyi yapabileceğimi söylediğimde, kesinlikle abartmıyorum.",
    "**Macallan diyor ki **Uyanışlarıma isyan ettiren, her saniyesini kaydetmek istediğim kusursuz bir rüya seni sevmek. Tüm çalar saatlere isyanım, senden öncesi yok saatlerin, sonrası da olmayacak inan...",
    "**Macallan diyor ki **Yürekten sevdiğim, sana bunları yazıyorum; çünkü bir göz kırpması bile bende bambaşka duygular oluşturan, o tatlı yüzü içimi ısıtan başka birisini nereden bulabilirim? Senin tatlı çehrende sonsuz sıkıntılarımı ve tarifi imkânsız kayıplarımı bile bulabilir ve o güzel yüzünü öptüğümde mutluluğa sarılırım.",
    "**Macallan diyor ki **Biz yine neşemizdeyiz ha güzelim..! Yanlış yapanın bılligini keseriz...+Anne benim keleşim nerde ",
    "Sen benim gökyüzüne gönderdiğim duanın yer yüzündeki karşılığısın ",
    "KARA KARA GÖZLERİN YERE DEĞSİN DİZLERİN AK$AM BİZE GELDE YUMRUK GÖRSÜN GÖZLERİN "
];
client.on("message", async message => {
    if (message.channel.id !== ("838456822452453397")) return;
    let Knavedev = db.get('chatiltifat');
    await db.add("chatiltifat", 1);
    if (Knavedev >= 35) {
        db.delete("chatiltifat");
        const random = Math.floor(Math.random() * ((kiltifat).length - 1) + 1);
        message.reply(`${(kiltifat)[random]}`);
    };
});

//------------------------------------------------------------------------------------------------------------\\

client.on("message", message => {
    if (message.content.toLowerCase() == "günaydın")
        return message.channel.send(`${message.author}, Günaydın Hoş geldin <a:ilgi:840164297068904479>`);
});


client.on("message", message => {
    if (message.content.toLowerCase() == "sa")
        return message.channel.send(`${message.author}, Aleyküm Selam. Hoş geldin <a:kalpgif:841079193437208596>`);
});

client.on("message", message => {
    if (message.content.toLowerCase() == "selam")
        return message.channel.send(`${message.author}, Selam hoşgeldin.<a:kalpgif:841079193437208596>`);
});

client.on("message", message => {
    if (message.content.toLowerCase() == "merhaba")
        return message.channel.send(`${message.author}, Merhaba hoşgeldin.<a:kalpgif:841079193437208596>`);
});


client.on("message", message => {
    if (message.content.toLowerCase() == "s.a")
        return message.channel.send(`${message.author}, Aleyküm Selam.`);
});

client.on("message", message => {
    if (message.content.toLowerCase() == "slm")
        return message.channel.send(`${message.author}, Selam hoşgeldin.`);
});
client.on("message", message => {
    if (message.content.toLowerCase() == "macallan")
        return message.channel.send(`${message.author}, Efendim Caney :heart: `);
});

client.on("message", message => {
    if (message.content.toLowerCase() == "mac")
        return message.channel.send(`${message.author}, Efendim Kuzum <a:izleyici:838085412903583794>`);
});

client.on("message", message => {
    if (message.content.toLowerCase() == "<@782642932443774976>")
        return message.channel.send(`${message.author}, Efendim Canım <a:pck:838086074642595841>`);
});

client.on("message", message => {
    if (message.content.toLowerCase() == "elanur")
        return message.channel.send(`${message.author}, Bence çok tatlı bir insan ve Çok sıcakkanlı <a:pck:838086074642595841>`);
});

//------------------------------------------------------------------------------------------------------------\\amk-amk-hayat%C4%B1-gif-19243
//------------------------------------------------------------------------------------------------------------\\

client.on('userUpdate', async (oldUser, newUser) => {
    var knaveetiket = "マ"
    let sunucu = client.guilds.cache.find(e => e.id === "805556388319330345")
    let knaverol = sunucu.roles.cache.find(a => a.id === "836332643011395604")
    let üye = sunucu.members.cache.get(newUser.id)
    if (newUser.discriminator.includes(knaveetiket) && !oldUser.username.includes(knaveetiket)) {
        üye.roles.add(knaverol)

        const knaevlog = new Discord.MessageEmbed()
            .setColor(`BLACK`)
            .setDescription(`**<@${newUser.id}> Tagımızı Aldığı İçin Yasaklı Tag Rolü Verildi**`)
        client.channels.cache.get(`836332848566763590`).send(knaevlog)

    }
}
);

client.on('userUpdate', async (oldUser, newUser) => {
    var knave31 = "tag"
    let sunucu = client.guilds.cache.find(e => e.id === "sunucu id")
    let knave1 = sunucu.roles.cache.find(a => a.id === "ekip rol id")
    let üye = sunucu.members.cache.get(oldUser.id)
    if (oldUser.discriminator.includes(knave31) && !newUser.username.includes(knave31)) {
        üye.roles.remove(knave1)

        let knave = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setDescription(`**<@${oldUser.id}> Tagımızı Sildiği İçin ${knave1} Rolü Alındı**`)
        client.channels.cache.get(`log kanal id`).send(knave)
    }
}
);

//------------------------------------------------------------------------------------------------------------\\

//--------------------------------deneme----------------------------------------------------------------------------\\


client.on('messageDelete', async message => {
    if (message.author.bot) return

    const channel = message.guild.channels.cache.get(db.fetch(`codeminglog_${message.guild.id}`));
    if (!channel) return;

    let embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
        .setTitle("Mesaj silindi")
        .addField(`Silinen mesaj : ${message.content}`, `Kanal: ${message.channel.name}`)
        //  .addField(`Kanal:`,`${message.channel.name}`)
        .setTimestamp()
        .setColor("RANDOM")
        .setFooter(`${message.client.user.username}#${message.client.user.discriminator}`, message.client.user.avatarURL)

    channel.send(embed)
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (oldMessage.author.bot) return;
    if (oldMessage.content == newMessage.content) return;

    const channel = oldMessage.guild.channels.cache.get(db.fetch(`codeminglog_${oldMessage.guild.id}`));
    if (!channel) return;

    let embed = new Discord.MessageEmbed()
        .setTitle("Mesaj güncellendi!")
        .addField("Eski mesaj : ", `${oldMessage.content}`)
        .addField("Yeni mesaj : ", `${newMessage.content}`)
        .addField("Kanal : ", `${oldMessage.channel.name}`)
        .setTimestamp()
        .setColor("RANDOM")
        .setFooter(`${oldMessage.client.user.username}#${oldMessage.client.user.discriminator}`, `${oldMessage.client.user.avatarURL}`)

    channel.send(embed)
});



//&& client.guilds.cache.get(sunucu).members.cache.get(newUser.id).roles.cache.has(rol)) //TAGLI ROLU VARSA

    client.on('voiceStateUpdate', async (oldState, newState) => {
        let yas = newState.guild.members.cache.get(newState.id)
        if(yas.displayName.includes(" | 12") || yas.displayName.includes(" | 13") || yas.displayName.includes(" | 14") || yas.displayName.includes(" | 15") || yas.displayName.includes(" | 16") || yas.displayName.includes(" | 17")) {
        
        if(!oldState.channelID && newState.channelID === "806623770658996292") {
        if(await db.get(`Sceza.${newState.id}`) > 1) {
        await newState.guild.members.cache.get(newState.id).roles.add(config.Yayıncezalı)
        setTimeout(() => {  newState.guild.members.cache.get(newState.id).voice.setChannel(null)  }, 1200)
        return client.channels.cache.get("806623770658996290").send(`${config.redemoji} <@${newState.id}> üyesi **18 yaşından** küçük olmasına rağmen +18 kanallara 3 kez giriş yaptığı için \`Streamer Cezalı\` rolü verildi.`)
        }
        }
        if(!oldState.channelID && newState.channelID === "806623770658996292") {
        if(await db.get(`Sceza.${newState.id}`) || 0 < 3) {
        await db.add(`Sceza.${newState.id}`, 1)
        client.channels.cache.get("806623770658996290").send(`${config.redemoji} <@${newState.id}> üyesi **18 yaşından** küçük olmasına rağmen \`${newState.guild.channels.cache.get(newState.channelID).name}\` kanalına giriş yaptığı için kanaldan atıldı!`)
        setTimeout(() => {  newState.guild.members.cache.get(newState.id).voice.setChannel(null)  }, 1200)
        }
        }
        // Alttaki taşınınca, üstteki kanala bağlanınca
        if(oldState.channelID && newState.channelID === "806623770658996292") {
        if(await db.get(`Sceza.${newState.id}`) > 1) {
        await newState.guild.members.cache.get(newState.id).roles.add(config.Yayıncezalı)
        setTimeout(() => {  newState.guild.members.cache.get(newState.id).voice.setChannel(null)  }, 1200)
        return client.channels.cache.get("806623770658996290").send(`${config.redemoji} <@${newState.id}> üyesi **18 yaşından** küçük olmasına rağmen +18 kanallara 3 kez giriş yaptığı için \`Streamer Cezalı\` rolü verildi.`)
        }
        }
        if(oldState.channelID && newState.channelID === "806623770658996292") {
        if(await db.get(`Sceza.${newState.id}`) || 0 < 3) {
        await db.add(`Sceza.${newState.id}`, 1)
        client.channels.cache.get("806623770658996290").send(`${config.redemoji} <@${newState.id}> üyesi **18 yaşından** küçük olmasına rağmen \`${newState.guild.channels.cache.get(newState.channelID).name}\` kanalına giriş yaptığı için kanaldan atıldı!`)
        setTimeout(() => {  newState.guild.members.cache.get(newState.id).voice.setChannel(null)  }, 1200)
        }
        }
        
        };
        }); 



//----------------


client.on("userUpdate", async (oldUser, newUser) => { 
    let sunucu = config.serverid;
    let kanal = config.taglog;
    let taglı = config.tagRol;
  
    let tag = config.tag;
    let untag = config.tag2;
    let channel = client.guilds.cache.get(sunucu).channels.cache.get(kanal);
  
    if (oldUser.username !== newUser.username) {
      if (
        newUser.username.includes(tag) &&
        !client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .roles.cache.has(taglı)
      ) {
        await client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .roles.add(taglı);
  
        await client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .setNickname(
            client.guilds.cache
              .get(sunucu)
              .members.cache.get(newUser.id)
              .displayName.replace(untag, tag)
          );
  
        channel.send(`**${newUser} adlı kullanıcı "${tag}" sembolünü kullanıcı adına ekleyerek ailemize katıldı.**`);
      }
      if (
        !newUser.username.includes(tag) &&
        client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .roles.cache.has(taglı)
      ) {
        if (db.fetch(`taglıAlım.${sunucu}`)) {
          await client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .roles.remove(taglı);
          await client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .roles.set([config.kaytsz] || []);
        }
        await client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .roles.remove(taglı);
  
        await client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .setNickname(
            client.guilds.cache
              .get(sunucu)
              .members.cache.get(newUser.id)
              .displayName.replace(tag, untag)
          );
        channel.send(`**${newUser} adlı kullanıcı "${tag}" sembolünü kullanıcı adından kaldırarak ailemizden ayrıldı.**`);
      }
    }
  });



