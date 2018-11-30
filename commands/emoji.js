/*
  Emoji. Add emojis from URL's, remove or list emojis from the current guild. (Needs "Manage Emojis" permisssion)
  "emoji add emoji_name IMAGE_URL"
  "emoji remove emoji"
  "emoji list"
*/
const request = require('superagent')
var Jimp = require('jimp');

module.exports = (self) => {
  self.registerCommand('emoji', function (msg, args) {
    switch(args[0]){
      case 'add':
        if (!args[1] || !args[1].length > 1) return this.msgError(msg, "emoji name too short")
        if (!args[2] || !args[2].match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/)) return this.msgError(msg, "invalid image url")

        try{
          this.msgProgress(msg, "downloading image")
          Jimp.read(args[2]).then((image) => {
            this.msgProgress(msg, "resizing image")
            image.scaleToFit(128, 128)
            this.msgProgress(msg, "getting buffer")
            image.getBufferAsync(`image/${image.getExtension()}`).then((a)=>{
              this.msgProgress(msg, "uploading image")
              const type = a[0] === 0xFF && a[1] === 0xD8 && a[2] === 0xFF ? 'data:image/jpeg;base64,' : 'data:image/png;base64,'
              this.self.createGuildEmoji(msg.channel.guild.id, { name: args[1], image: `${type}${a.toString('base64')}` }).then(e => {
                this.msgSuccess(msg, `emoji \`:${e.name}:\` created`)
              }).catch(err => { 
                this.log.err(err, 'Emoji'); this.msgError(msg, err, 'error creating emoji')
               })
            })
          })
        }catch(err){
          this.log.err(err, 'Emoji'); this.msgError(msg, err, 'error creating emoji') 
        }
        break;

      case 'remove':
        if (!args[1]) return this.edit(msg, 'No emoji specified.')
        if (msg.channel.guild.emojis.length > 0) {
          this.self.deleteGuildEmoji(msg.channel.guild.id, /<:\w+:(\d+)>/.exec(args[1])[1])
          .then(() => this.edit(msg, `**Guild Emoji Deleted!**\nWas: \`${args[1]}\``))
          .catch(err => { this.log.err(err, 'Emoji'); this.msgError(msg, err, 'error deleting emoji') })
        } else return this.edit(msg, 'This guild has no custom Emojis.')
        break;

        case 'list':
          if (msg.channel.guild.emojis.length > 0) {
            this.edit(msg, `**Emojis:** ${msg.channel.guild.emojis.map(e => `\`:${e.name}:\``).join(', ')}`)
          } else return this.edit(msg, 'This guild has no custom Emojis.')
        break;

        default:
          return this.info(msg, 'What do you want to do? `add`, `remove`, or `list` emojis?')
    }
  }, {
    perm: ['manageEmojis'],
    noPms: true
  })
}
