/*
  yoink. yoinks kiwis.
*/
module.exports = (self) => {
    let enabled = false
    let timeout = 1400

    self.on('messageCreate', (msg) => {
        if (!enabled)
            return

        if(msg.author.id == "338120746498785281" && msg.cleanContent.toString().includes(",pick")){
            setTimeout(()=>{
                self.createMessage(msg.channel.id, ",pick")
           }, timeout);
        }
    })

    self.registerCommand('yoink', function (msg, args) {
        switch(args[0]){
            case "timeout":
                if(args[1]){
                    timeout = args[1]
                    this.edit(msg, `yoink timeout set to \`${timeout}\``)
                }else{
                    this.edit(msg, `yoink timeout is currently \`${timeout}\``)
                }
                break;
            default:
                enabled = !enabled;
                this.edit(msg, `yoink set to \`${enabled}\``)
                break;
        }
    })
}
  