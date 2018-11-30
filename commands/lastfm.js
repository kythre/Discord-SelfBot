/*
  FM. LastFM now playing.
*/
const ColorThief = require('color-thief');
const https = require('https');
var Jimp = require('jimp');

module.exports = (self) => {
  self.registerCommand('np', function (msg, args) {
    https.get('https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=kylr_1&api_key='+self.secret.lastfmkey+'&limit=1&format=json', (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (d)=>{
            rawData += d;
        });

        res.on('end', ()=>{
            try {
                const data = JSON.parse(rawData);
                let currenttrack = data.recenttracks.track[0];
                let user = data.recenttracks["@attr"].user
                let artist = currenttrack.artist["#text"]
                let trackname = currenttrack.name
                let albumarturl = currenttrack.image[3]["#text"];

                Jimp.read(albumarturl).then((image) => {
                    image.getBufferAsync(`image/${image.getExtension()}`).then((buffer)=>{
                        let colorThief = new ColorThief();
                        let color = colorThief.getColor(buffer)
                        let colorr = '0x'
                        for(let a in color){
                            colorr += color[a].toString(16)
                        }
                        color = parseInt(colorr)

                        this.embed(msg, {
                            thumbnail: {
                                url: albumarturl
                            },
                            color: color,
                            /*
                            title: "Now Playing",
                            url: currenttrack.url,
                            fields: [
                                {
                                    name:trackname,
                                    value:artist
                                }
                            ],
                            */
                           author: {
                               name: "Now Playing",
                               url: `https://www.last.fm/user/${user}`
                           },
                            title: trackname,
                            url: currenttrack.url,
                            description: artist,
                            footer:{
                                text: `${user}'s Last.FM`,
                               /* icon_url: "https://www.last.fm/static/images/favicon.702b239b6194.ico",*/
                            },
                            timestamp: new Date(msg.timestamp).toISOString()
                        })
                    })
                })
            } catch (e) {
                console.error(e.message);
            }
        });
    })  
  })

  var npstatus = {}
  npstatus.enabled = true
  npstatus.func = () => {
    if(!npstatus.enabled){
        if(npstatus.interval){
            clearInterval(npstatus.interval)
            npstatus.interval = null
        }
        return
    } 

    let b = true
    let c = ""
    npstatus.interval = setInterval(() => {
      https.get('https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=kylr_1&api_key='+self.secret.lastfmkey+'&limit=1&format=json', (res) => {
          res.setEncoding('utf8');
          let rawData = '';
          res.on('data', (d)=>{
              rawData += d;
          });
  
          res.on('end', ()=>{
              try {
                const data = JSON.parse(rawData);
                let currenttrack = data.recenttracks.track[0];
                let artist = currenttrack.artist["#text"]
                let trackname = currenttrack.name
                let a = trackname + " by "+ artist
                self.log.log("Song: "+ a,  "LastFM", "bgCyan", true);
  
                if (currenttrack["@attr"]){
                    self.log.log("Currently Playing",  "LastFM", "bgCyan", true);
  
                  if (c != a){
                    self.log.log("Setting to: "+ a,  "LastFM", "bgCyan", true);
                    self.editStatus(self.config.defaultStatus.toLowerCase(), {name: a})
                    b = true;
                    c = a;
                  }
                }else{
                  if (b){
                    self.log.log("Setting to: nothing",  "LastFM", "bgCyan", true)
                    self.editStatus(self.config.defaultStatus.toLowerCase(), {name: 'nothing'})
                    b = false;
                  }
                }
                self.editAFK(self.afk);
              } catch (e) {
                console.error(e.message);
            }
        });
      })  
    }, 15000);  
  }
  
  npstatus.func()

  self.registerCommand('npstatus', function (msg, args) {
    npstatus.enabled = !npstatus.enabled
    npstatus.func()
    this.edit(msg, `lastfm playing status ${npstatus.enabled? "enabled" : "disabled"}`);
  })
}
