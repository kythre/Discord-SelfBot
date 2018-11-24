/*
  Eval. Evaluates a snippet of javascript code.
*/
const util = require('util')

module.exports = (self) => {
  self.registerCommand('eval', function (msg, args) {
    // If msg author is not the owner
    if (msg.author.id !== this.self.user.id) return

    this.edit(msg, 'evaluating...').then(m => {
      let evaled
      let message
      try {
        evaled = eval(args.join(' ')) // eslint-disable-line no-eval
      } catch (err) {
        evaled = err
      }

      if(evaled && evaled.hasOwnProperty('shard')){
        evaled.shard = null;
      }

      evaled = util.inspect(evaled)
      evaled.replace(/`/g, '`' + String.fromCharCode(8203))

      for(var a in self.secret){
        evaled = evaled.replace(self.secret[a], "")
      }

      message = [
        'k Input:',
        '```js\n',
        args.join(' '),
        '```\nOutput:',
        '```js\n',
        evaled,
        '\n```'
      ]

      if (message.join(' ').length > 2000)
        message[5] = evaled.substring(0, evaled.length-(message.join(' ').length-1997))+"..."

      this.self.editMessage(msg.channel.id, msg.id, message.join(' '))
    })
  })
}
