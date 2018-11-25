/*
  CLean. Deletes commands and selfbot messages from a channel
*/
module.exports = (self) => {
    self.registerCommand('clean', function (msg, args) {
       if (!args[0] || !/\d{1,2}/ig.test(args[0])) args[0] = 20

      // Prune msgs
      msg.delete()
      
      msg.channel.getMessages(args[0]).then(msgs => {
        let msgArray = msgs.filter(m => m.author.id === this.self.user.id).filter(m => m !== msgs[0])
        msgArray.length = parseInt(10, 10)
        msgArray.map(m => {
            if(m.content.startsWith(self.config.prefix))
                m.delete().catch(err => this.log.err(err))
        })
      })
    })
  }
  