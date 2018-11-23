/*
  Quote. Quotes a message.
*/
module.exports = (self) => {
  self.registerCommand('quote', function (msg, args) {
    msg.channel.getMessage(args[0]).then(m=>{
      console.log(m)
    })
    //this.self.createMessage(msg.channel.id, 'Pong!').then(m => this.edit(m, `${m.content} (${m.timestamp - msg.timestamp}ms)`))
  })
}
