var fs = require('fs'),
request = require('request');
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
        var gif
        msg.channel.getMessages(2).then(msgs => {
            gif = msgs[1].attachments[0] ? msgs[1].attachments[0] : msg.attachments[0]

            console.log(gif)
            console.log(gif.url)
            console.log(gif.height >= 129 )
    
            download(gif.url, "./temp/"+gif.filename, function(){
                exec(`gifsicle.exe --resize-height 129 ${gif.filename} --colors 256 -o ./temp/${gif.filename}`, (err, stdout, stderr) => {
                    if (err) {
                        // node couldn't execute the command
                        return;
                    }
                });
            });
        })
    })
}  