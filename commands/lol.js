module.exports = (self) => {
    self.registerCommand('ee', function (msg, args) {
        self.editMessage(msg.channel.id, msg.id, {
            content: `@everyone ${msg.content.substring(self.config.prefix.length + 3)}`, 
            disableEveryone: false
        })
    })
}
  