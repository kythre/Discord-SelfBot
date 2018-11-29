module.exports = (self) => {
    self.registerCommand('ghostping', function (msg, args) {
        if(args[0])
        for(let i = 0; i < 5; i++){
            this.send(msg, `<@${args[0]}>`).then((msg)=>{
                msg.delete()
            });
        }
        msg.delete()
    })
  }