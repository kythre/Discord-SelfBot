/*
  CLean. Deletes commands and selfbot messages from a channel
*/
module.exports = (self) => {
    self.registerCommand('clean', function (msg, args) {
      // Prune msgs
      msg.delete()
      msg.channel.getMessages(20).then(msgs => {
        let msgArray = msgs.filter(m => m.author.id === this.self.user.id).filter(m => m !== msgs[0])
        msgArray.length = parseInt(10, 10)
        msgArray.map(m => {
            if(m.content.startsWith(self.config.prefix))
                m.delete().catch(err => this.log.err(err))
        })
      })
    })
  }
  