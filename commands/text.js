/*
  Text. Makes your text special
*/
module.exports = (self) => {
    self.registerCommand('text', function (msg, args) {
        let message = "";
        
        switch(args[0]){
            case "clap":
                message = "👏 ";
                for(let a in args){
                    if(a>0 && args[a].length>0)
                        message += args[a]+" 👏 "; 
                }    
                break;

            case "space":
                for(let a in args){
                    if(a>0 && args[a].length>0)
                        for(let b in args[a]){
                            message += args[a][b]+" "
                        }
                        message+=" "
                }
                break;

            case "dance":
            case "ri":
                if(args[0] == "dance"){
                    var emojis = self.guilds.get("504681647392948234").emojis
                    for(let a in emojis){
                        emojis[emojis[a].name.substr(0,1)] = emojis[a]
                    }
                }

                for(let a in args){
                    let word = args[a].toLowerCase()

                    if(a>0 && word.length>0)
                        for(let b in word){
                            let char = word[b]
                            if(char.match(/[a-z]/)){
                                if(args[0] == "dance"){
                                    message += `<a:${emojis[char].name}:${emojis[char].id}>`
                                }else{
                                    message += String.fromCodePoint(0x1F1E5 + (char.charCodeAt(0) - 96)) + String.fromCodePoint(0x200D)
                                }
                            }else{
                                message+=char
                            }
                        }
                        message+="  "
                }
                break;

            default:
                //empty message lol
                break;
        }
        this.edit(msg, message, null, false)
    })
  }
  