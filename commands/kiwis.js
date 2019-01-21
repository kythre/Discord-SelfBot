var Jimp = require('jimp');

module.exports = (self) => {
    var plantMessage = null
    var plantAmount = 37

    self.registerCommand('plant', function (msg, args) {
        if(args[0]) plantAmount = args[0]

        Jimp.read('https://cdn.discordapp.com/attachments/467813883617345538/517223793102684202/images.png').then((image) => {
            image.getBufferAsync(`image/${image.getExtension()}`).then((a)=>{
                this.send(msg, `**${msg.author.username+msg.author.discriminator}** planted ${plantAmount}:kiwi: Pick it up by typing \`,pick\``, null, {
                    file: a,
                    name: `kiwi.${image.getExtension()}`
                }, false).then((msg1)=>{
                    plantMessage = msg1
                })
            })
        })
        msg.delete()
    })

    function fakePicked(whomstve, amount){
        return self.createMessage(whomstve.channel.id,  {
            content: "",
            embed:{
            description: `**${whomstve.author.username+whomstve.author.discriminator}** picked ${amount}:kiwi:`,
                color: 53380
            }
        })
    }

    self.registerCommand('pick', function (msg, args) {
        fakePicked(msg, args[0])
        msg.delete()
    })
            
    self.on('messageCreate', (msg) => {
        if (!msg.author) return
        if (!msg.channel.guild) return

        if(enabled && msg.author.id == "338120746498785281" && msg.cleanContent.toString().includes(",pick")) 
            setTimeout(()=>{
                self.createMessage(msg.channel.id, ",pick")
            }, timeout);

        if(plantMessage && plantMessage != null) {
            if (msg.channel.guild.id != plantMessage.channel.guild.id) return 
            if (msg.content == ",pick"){
                fakePicked(msg, plantAmount).then((msg)=>{
                    plantMessage.delete()
                    plantMessage = null
                    setTimeout(() => {
                        msg.delete()
                    }, 5000);
                })
            }
        }
    })

    let enabled = false
    let timeout = 1400

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