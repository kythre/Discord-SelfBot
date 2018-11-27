/*
  Quote. Quotes a message. Args: 1: messageID 2: channelID (if quoting from a different channel) 2: dm if the channelID is a DM
*/

module.exports = (self) => {  
  self.registerCommand('quote', function (msg, args) {
    qmsgID = args[0] 
    qchanID = args[1]
    isDM = args[2] 

    this.getMessage(msg, qmsgID, qchanID, isDM).then(qmsg=>{
      this.quote(msg, qmsg)
    })
  })
}

