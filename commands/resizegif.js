const fs = require('fs')
const request = require('request');
const { execSync } = require('child_process');
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
        self.getMessages(msg.channel.id, 1, msg.id, null,null).then(msgs => {
            var prevmsg = msgs[0]
            var gif = {}
             switch(true){
                case msg.attachments[0] != undefined:
                    gif = msg.attachments[0]
                    break;
                case (msg.embeds[0] != undefined) && msg.embeds[0].type == "image":
                    gif = msg.embeds[0]
                    gif.filename = gif.url.split('/')[gif.url.split('/').length-1]
                    break;
                case prevmsg.attachments[0] != undefined:
                    gif = prevmsg.attachments[0]
                    break;
                case (prevmsg.embeds[0] != undefined) && prevmsg.embeds[0].type == "image":
                    gif = prevmsg.embeds[0]
                    gif.filename = gif.url.split('/')[gif.url.split('/').length-1]
                    break;
                default:
                    return this.edit(msg, {embed:{description:`:thumbsdown: nothing to resize`}})
            }

            if (!gif.url.endsWith('.gif'))
                return this.edit(msg, {embed:{description:`:thumbsdown: invalid gif`}})

            this.edit(msg, {embed:{description:`:point_up: downloading gif`}})

            gif.filepath = "./temp/"+gif.filename

            gif.size = {
                original: 0,
                current: 0
            }

            download(gif.url, gif.filepath, ()=>{
                gif.size.original = fs.statSync(`${gif.filepath}`).size/1000

                if(gif.size.original < 256)
                    return this.edit(msg, {embed:{description:`:thumbsup: gif already small`}})

                try{
                    let size = 128
                    this.edit(msg, {embed:{description:`:point_up: resizing gif`}})
                    do{
                        execSync(`gifsicle.exe --resize-height ${size} ${gif.filepath} --colors 256 -o ${gif.filepath}`)
                        gif.size.current = fs.statSync(gif.filepath).size/1000
                        size -= 10
                    }while(gif.size.current > 256)
                }catch(err){
                    return this.edit(msg, {embed:{description:`:point_up: error resizing: ${err}`}})
                }

                this.edit(msg, {embed:{description:`:point_up: sending gif`}})
    
                gif.size.current = fs.statSync(gif.filepath).size/1000
                gif.file = fs.readFileSync(gif.filepath)

                this.send(msg, {
                    content: `:thumbsup: now ${gif.size.current}KB`,
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