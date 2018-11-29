module.exports = (self) => {
    self.registerCommand('test', function (msg, args) {
        self.joinVoiceChannel(args[0].toString()).catch((err) => { // Join the user's voice channel
            self.createMessage(msg.channel.id, "Error joining voice channel: " + err.message); // Notify the user if there is an error
            console.log(err); // Log the error
        }).then((connection) => {
            if(connection.playing) { // Stop playing if the connection is playing something
                connection.stopPlaying();
            }
            connection.play("https://www.myinstants.com/media/sounds/oof_UDwDEXN.mp3"); // Play the file and notify the user
            var a = setInterval(() => {
                if (!connection.playing){
                    connection.disconnect()
                    clearInterval(a);
                }
            }, 100);
        });
        msg.delete()
    })
}
  