/*
  Quote. Quotes a message. Args: 1: messageID 2: channelID (if quoting from a different channel) 2: dm if the channelID is a DM
*/

module.exports = (self) => {  
  function quote(that, msg, quotemsg){
    that.embed(msg, {
      color: that.defaultColor,
      author: {
          name: quotemsg.author.username,
          icon_url: quotemsg.author.avatarURL
      },
      description: quotemsg.content,
      footer:{
          text: `${quotemsg.channel.name ? quotemsg.channel.name : quotemsg.author.username} in ${quotemsg.channel.name ? quotemsg.channel.name : 'DMs'}`
      },
      image: {
        url: quotemsg.attachments[0] ? quotemsg.attachments[0].url : ""
      },
      timestamp: new Date(quotemsg.timestamp).toISOString()
    })
  }

  self.registerCommand('quote', function (msg, args) {
    if (args[2]) {
      self.getDMChannel(args[1]).then(c => {
        c.getMessages(1, null, null,args[0].toString()).then(msgs=>{
          quote(this, msg, msgs[0])
        })
      })
    }else{
      self.getMessages(args[1] ? args[1] :msg.channel.id, 1, null, null,args[0].toString()).then(msgs=>{
        quote(this, msg, msgs[0])
      })
    }
  })
}

