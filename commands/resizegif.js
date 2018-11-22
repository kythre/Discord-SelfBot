const fs = require('fs')
const request = require('request');
const { exec } = require('child_process');
var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        //console.log('content-type:', res.headers['content-type']);
        //console.log('content-length:', res.headers['content-length']);
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

/*
  Resize. Resize the last gif posted
*/
module.exports = (self) => {
    self.registerCommand('resizegif', function (msg, args) {
        msg.channel.getMessages(2).then(msgs => {
            var gif = ""
             switch(true){
                case msg.attachments[0] != undefined:
                    gif = msg.attachments[0]
                    break;
                case (msg.embeds[0] != undefined) && msg.embeds[0].type == "image":
                    gif = msg.embeds[0]
                    gif.filename = gif.url.split('/')[gif.url.split('/').length-1]
                    break;
                case msgs[1].attachments[0] != undefined:
                    gif = msgs[1].attachments[0]
                    break;
                case (msgs[1].embeds[0] != undefined) && msgs[1].embeds[0].type == "image":
                    gif = msgs[1].embeds[0]
                    gif.filename = gif.url.split('/')[gif.url.split('/').length-1]
                    break;
                default:
                    return self.createMessage(msg.channel.id, self.config.prefix + ':thumbsdown: Bad gif')
            }

            if (!gif.url.endsWith('.gif'))
                return self.createMessage(msg.channel.id, self.config.prefix + ':thumbsdown: Bad url')

            download(gif.url, "./temp/"+gif.filename, function(){
                exec(`gifsicle.exe --resize-height 129 ./temp/${gif.filename} --colors 256 -o ./temp/${gif.filename}`, (err, stdout, stderr) => {
                    if (err) {
                        console.log(err)
                        return;
                    }
                    self.createMessage(msg.channel.id, self.config.prefix + ':ok_hand:', {
                        file: fs.readFileSync(`./temp/${gif.filename}`),
                        name: gif.filename
                    })
                });
            });
        })
    })
}  