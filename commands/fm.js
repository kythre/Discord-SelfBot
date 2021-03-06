/*
  FM. LastFM now playing.
*/
const ColorThief = require('color-thief');
const fs = require('fs');  
const url = require('url');
const https = require('https');

module.exports = (self) => {
  self.registerCommand('fm', function (msg, args) {
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
    
                /*https.get(albumarturl, (res) => {
                    res.setEncoding('utf8');
                    let rawData = '';
                    res.on('data', (d)=>{
                        rawData += d;
                    });

                    res.on('end', ()=>{
                        try {
                            console.log(rawData)
                        } catch (e) {
                            console.error(e.message);
                        }
                    });
                });*/


                this.embed(msg, {
                    thumbnail: {
                        url: albumarturl
                    },
                    color: this.defaultColor,
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
            } catch (e) {
                console.error(e.message);
            }
        });
    })  
  })
}
