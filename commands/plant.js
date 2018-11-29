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
            
    self.on('messageCreate', (msg) => {
        if (!plantMessage) return
        if (!msg.author) return
        if (msg.author.id == self.user.id) return
        if (msg.channel.guild.id != plantMessage.channel.guild.id) return 

        if(msg.content == ",pick"){
            self.createMessage(msg.channel.id,  {
                content: "",
                embed:{
                    description: `**${msg.author.username+msg.author.discriminator}** picked ${plantAmount}:kiwi:`,
                    color: 53380
                }
            }).then((msg)=>{
                plantMessage.delete()
                plantMessage = null
                setTimeout(() => {
                    msg.delete()
                }, 5000);
            })
        }
    })
  }