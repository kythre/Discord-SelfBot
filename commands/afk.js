module.exports = (self) => {
  self.registerCommand('afk', function (msg, args) {
    self.afk = !self.afk;
    this.send(msg, `Afk is now ${self.afk}`);
  })
}