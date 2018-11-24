/*
  Eval. Evaluates a snippet of javascript code.
*/
const util = require('util')

module.exports = (self) => {
  self.registerCommand('eval', function (msg, args) {
    // If msg author is not the owner
    if (msg.author.id !== this.self.user.id) return

    // Delete the msg, create a new one, and then eval
    this.edit(msg, 'Evaluating...').then(m => {
      let evaled = ''
      var output
      var message
      try {
        evaled = eval(args.join(' ')) // eslint-disable-line no-eval
        if (Array.isArray(evaled) || typeof evaled === 'object') { evaled = util.inspect(evaled) }
        if (typeof (evaled) === 'string') {evaled.replace(/`/g, '`' + String.fromCharCode(8203)) }
      } catch (err) {
        evaled = err
      }

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
      ].join(' ')

      if (message.length > 2000)
        evaled = evaled.substring(0, evaled.length-(message.length-1997))+"..."

      message = [
        'k Input:',
        '```js\n',
        args.join(' '),
        '```\nOutput:',
        '```js\n',
        evaled,
        '\n```'
      ].join(' ')

      this.self.editMessage(msg.channel.id, msg.id, message)
    })
  })
}
