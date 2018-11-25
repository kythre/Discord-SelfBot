module.exports = (self) => {
  self.registerCommand('afk', function (msg, args) {
    self.afk = !self.afk;
    this.edit(msg, `AFK is now ${self.afk}`);
  })
}