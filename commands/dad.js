module.exports = (self) => {
    var dad = false

    self.on('messageCreate', (msg) => {
        if (!msg.author) return
        if (msg.author.id == self.user.id) return
        if (!msg.channel.guild) return
        if (msg.channel.guild.id != "467813883617345536") return 


        let k = /\b(im|i'm|i`m|i‘m)\s(.+)/ig.exec(msg.content);

        if(k && dad)
        self.createMessage(msg.channel.id,  `hi ${k[2]}, i'm dad!`)
    })

    self.registerCommand('dad', function (msg, args) {
        dad = !dad
        this.edit(msg, `${dad ? "dad is awake" : "*sshhh* dad is sleeping"}`, null, false)
    })
  }