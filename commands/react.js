/*
    react. funny reaction
*/
module.exports = (self) => {
    self.registerCommand('react', function (msg, args) {
        
        let rmsgID = args[0] 

        if (rmsgID == "^"){
            this.getLastMessage(msg).then(lmsg => {
                for(let a in args){
                    if (a<0) continue

                    let reactText = args[a]
    
                    for(let b in reactText){
                        let char = reactText[b]
                        if(char.match(/[a-z]/)){
                            self.addMessageReaction(lmsg.channel.id, lmsg.id, String.fromCodePoint(0x1F1E5 + (char.charCodeAt(0) - 96)))
                        }
                    }
                }
            })
        }else{
            this.getMessage(msg, rmsgID).then(rmsg => {
                for(let a in args){
                    if (a<0) continue

                    let reactText = args[a]
    
                    for(let b in reactText){
                        let char = reactText[b]
                        if(char.match(/[a-z]/)){
                            self.addMessageReaction(rmsg.channel.id, rmsg.id, String.fromCodePoint(0x1F1E5 + (char.charCodeAt(0) - 96)))
                        }
                    }
                }
            })
        }

        msg.delete()
    })
  }
  