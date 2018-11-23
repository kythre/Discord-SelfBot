/*
  Text. Makes your text special
*/
module.exports = (self) => {
    self.registerCommand('text', function (msg, args) {
        if (args.length == 0)
            return

        var message = "";
        console.log(danceEmoji)

        switch(args[0]){
            case "clap":
                message = "👏 ";
                for(var a in args){
                    if(a>0 && args[a].length>0)
                        message += args[a]+" 👏 "; 
                }    
                this.self.createMessage(msg.channel.id, message)
                break;

            case "space":
                for(var a in args){
                    if(a>0 && args[a].length>0)
                        for(var b in args[a]){
                            message += args[a][b]+" "
                        }
                        message+=" "
                }
                break;

            case "dance":
                for(var a in args){
                    if(a>0 && args[a].length>0)
                        for(var b in args[a]){
                       //     message += `<a:${args[a][b]}_:504682628629397504>`
                        }
                        message+=" "
                }
                break;

            default:
                return
                break;
        }

        this.self.createMessage(msg.channel.id, message)
    })
  }
  