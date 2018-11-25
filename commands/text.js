/*
  Text. Makes your text special
*/
module.exports = (self) => {
    self.registerCommand('text', function (msg, args) {
        if (args.length == 0)
            return

        var message = "";
       // console.log(danceEmoji)

        switch(args[0]){
            case "clap":
                message = "👏 ";
                for(var a in args){
                    if(a>0 && args[a].length>0)
                        message += args[a]+" 👏 "; 
                }    
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
                let emojis = self.guilds.get("504681647392948234").emojis
                for(var a in emojis){
                    emojis[emojis[a].name.substr(0,1)] = emojis[a]
                }

                for(var a in args){
                    let word = args[a]
                    word = word.toLowerCase()

                    if(a>0 && word.length>0)
                        for(var b in word){
                            let char = word[b]
                            if(char.match(/[a-z]/)){
                                message += `<a:${emojis[char].name}:${emojis[char].id}>`
                            }else{
                                message+=char
                            }
                        }
                        message+="  "
                }
                break;

            case "ri":
            for(var a in args){
                let word = args[a]
                word = word.toLowerCase()

                if(a>0 && word.length>0)
                    for(var b in word){
                        let char = word[b]
                        if(char.match(/[a-z]/)){
                            message += `:regional_indicator_${char}:`
                        }else{
                            message+=char
                        }
                    }
                    message+="  "
            }
            break;

            default:
                return
                break;
        }
        this.self.editMessage(msg.channel.id, msg.id, message)
    })
  }
  