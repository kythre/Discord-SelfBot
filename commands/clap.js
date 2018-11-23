/*
  Clap. Sends clap message.
*/
module.exports = (self) => {
  self.registerCommand('clap', function (msg, args) {
    console.log(msg.content)
    var message = "👏 ";
    for(var a in args){
      if(args[a].length>0)
         message += args[a]+" 👏 "; 
    }    
    this.self.createMessage(msg.channel.id, message)
  })
}
