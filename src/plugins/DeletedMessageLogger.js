const moment = require('moment')

module.exports = (self, log, config) => {
    self.on('messageDelete', (msg) => {
        if (!msg.author) return
        if (msg.author.id == self.user.id || msg.author.bot ) return
        if (config.deletedMessageLogger.inConsole) log.log(msg.author.username+": "+msg.content, "Delted Message", "red", true)
        if (config.deletedMessageLogger.inNotificationChannel) {
            if (Object.keys(self.channelGuildMap).includes(config.deletedMessageLogger.notificationChannelID)) {
                self.getMessages(msg.channel.id, 4, msg.id).then(msgs => {
                    var webhookContent = {
                        embeds: [{
                          color: 33279,
                            author: {
                                name: `${msg.author.username}#${msg.author.discriminator}`,
                                icon_url: msg.author.avatarURL
                            },
                            thumbnail: {
                              url: msg.channel.guild ? `https://cdn.discordapp.com/icons/${msg.channel.guild.id}/486f6b0a32b4a3257c504147b30c2539.webp` : msg.author.avatarURL
                            },
                            title:"Deleted Message",
                            description:"",
                            fields: [
                              {
                                name: `${msg.channel.guild ? msg.channel.guild.name : "Direct Message"}`,
                                value:`${msg.channel.mention ? msg.channel.mention : "<@"+msg.author.id+">"}`,
                                inline: true
                              },
                              {
                                name: `User ID`,
                                value:`${msg.author.id}`,
                                inline: true
                              }
                            ],
                            timestamp: new Date(msg.timestamp).toISOString()
                        }]
                    }

                    if (msg.cleanContent.length > 0){
                        webhookContent.embeds[0].description = "```"+msg.cleanContent+"```";
                    }

                    var attachments = "";
                    if(msg.attachments.length > 0){
                        for (a in msg.attachments) {
                            attachments += "\n" + msg.attachments[a].url

                            webhookContent.embeds.push({
                              title: "Attachment "+a,
                              description: msg.attachments[a].filename,
                              image: {
                                url: msg.attachments[a].url
                              }
                          })
                        }
                        //webhookContent.embeds[0].fields.splice(msg.cleanContent.length > 0 ? 1 : 0, 0, {name: 'Attatchments', value: "```"+attachments+" ```", inline:false});
                    }

                    self.getChannelWebhooks(config.deletedMessageLogger.notificationChannelID).then(webhooks => {
                        if (!webhooks || !webhooks.length) {
                        self.createChannelWebhook(config.deletedMessageLogger.notificationChannelID, { name: 'Selfbot' }).then(w => {
                            self.counts.msgsSent = self.counts.msgsSent + 1
                            self.executeWebhook(w.id, w.token, webhookContent)
                        })
                        } else {
                        self.counts.msgsSent = self.counts.msgsSent + 1
                        self.executeWebhook(webhooks[0].id, webhooks[0].token, webhookContent)
                        }
                    })
                })
            }
        }
    })
}
