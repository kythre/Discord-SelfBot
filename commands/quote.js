/*
  Quote. Quotes a message.
*/


module.exports = (self) => {
  self.registerCommand('quote', function (msg, args) {

    console.log( msg.channel.messages.get(args[0]).content);

//    self.guilds.get(gid).channels.get(cid).messages.get(id).content;

    

    //this.self.createMessage(msg.channel.id, 'Pong!').then(m => this.edit(m, `${m.content} (${m.timestamp - msg.timestamp}ms)`))
  })
}
