/*
  Quote. Quotes a message. Args: 1: messageID 2: channelID (if quoting from a different channel)
*/

module.exports = (self) => {
  self.registerCommand('quote', function (msg, args) {
    self.getMessages(args[1] ? args[1] :msg.channel.id, 1, null, null,args[0].toString()).then(msgs=>{
      this.embed(msg, {
        color: this.defaultColor,
        author: {
            name: msgs[0].author.username,
            icon_url: msgs[0].author.avatarURL
        },
        description: msgs[0].content,
        footer:{
            text: msgs[0].channel.name
        },
        timestamp: new Date(msgs[0].timestamp).toISOString()
      })
    })
  })
}
