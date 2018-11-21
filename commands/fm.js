/*
  FM. LastFM now playing.
*/
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = (self) => {
  self.registerCommand('fm', function (msg, args) {
      
    var request = new XMLHttpRequest();
    request.open('GET', 'https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=kylr_1&api_key='+self.secret.lastfmkey+'&limit=1&format=json', true);
    
    request.onload = () =>{
        var data = JSON.parse(request.responseText);
        
        if (request.status >= 200 && request.status < 400) {
            var currenttrack = data.recenttracks.track[0];
            var user = data.recenttracks["@attr"].user
            var artist = currenttrack.artist["#text"]
            var trackname = currenttrack.name
            
            this.embed(msg, {
                thumbnail: {
                    url: currenttrack.image[2]["#text"]
                },
                title: "Now Playing",
                url: currenttrack.url,
                color: this.defaultColor,
                fields: [
                    {
                        name:trackname,
                        value:artist
                    }
                ],
                footer:{
                    text: `${user}'s Last.FM`
                },
                timestamp: new Date(msg.timestamp).toISOString()
            })
        }
    }
    request.send();
  },
  {deleteAfter: false}
  )
}
