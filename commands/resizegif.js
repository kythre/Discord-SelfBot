const fs = require('fs')
const os = require('os');
const request = require('request');
const { execSync } = require('child_process');

let download = function(uri, filename, callback){
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
        self.getMessages(msg.channel.id, 1, msg.id, null,null).then(msgs => {
            let prevmsg = msgs[0]
            let gif = {}
             switch(true){
                case msg.attachments[0] !== undefined:
                    gif = msg.attachments[0]
                    break;
                case (msg.embeds[0] !== undefined) && msg.embeds[0].type == "image":
                    gif = msg.embeds[0]
                    gif.filename = gif.url.split('/')[gif.url.split('/').length-1]
                    break;
                case prevmsg.attachments[0] !== undefined:
                    gif = prevmsg.attachments[0]
                    break;
                case (prevmsg.embeds[0] !== undefined) && prevmsg.embeds[0].type == "image":
                    gif = prevmsg.embeds[0]
                    gif.filename = gif.url.split('/')[gif.url.split('/').length-1]
                    break;
                default:
                 return this.msgError(msg, `noting to resize`, 'error resizing')
            }

            if (!gif.url.endsWith('.gif'))
              return this.msgError(msg, `invalid gif`, 'error resizing')

            this.msgProgress(msg, `downloading gif`)

            gif.filepath = "./temp/"+gif.filename

            gif.size = {
                original: 0,
                current: 0
            }

            download(gif.url, gif.filepath, ()=>{
                gif.size.original = fs.statSync(`${gif.filepath}`).size/1000

                if(gif.size.original < 256)
                    return this.msgSuccess(msg, `gif already small`)

                try{
                    let size = 128
                    this.msgProgress(msg, `resizing gif`)
                    do{
                        switch(os.platform()){
                          case "win32":
                            execSync(`gifsicle.exe --resize-height ${size} ${gif.filepath} --colors 256 -o ${gif.filepath}`)
                            break;
                          default:
                            return this.msgError(msg, `${os.platform()} not supported`, 'error resizing')
                        }
                        gif.size.current = fs.statSync(gif.filepath).size/1000
                        size -= 10
                    }while(gif.size.current > 256)
                }catch(err){
                    return this.msgError(msg, err, 'error resizing')
                }

                this.msgProgress(msg, `sending gif`)
    
                gif.size.current = fs.statSync(gif.filepath).size/1000
                gif.file = fs.readFileSync(gif.filepath)

                this.send(msg, {
                    content: `now ${gif.size.current}KB`,
                    embed:{
                        description: `Original: [${gif.filename}](${gif.url}) (${gif.size.original}KB)`
                    }
                }, null, {
                    file: gif.file,
                    name: gif.filename
                }).then(()=>{
                    msg.delete()
                })
            });
        })
    })
}  