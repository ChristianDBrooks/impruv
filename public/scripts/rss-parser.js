$(document).ready(function() {

  refreshEpisodes();
	

  function refreshEpisodes() {
	  var feed = "https://feed.syntax.fm/rss";

    var episodeList = [];
    episodeList = JSON.parse(window.localStorage.getItem('episodes'))
    if (episodeList && episodeList.length <= 0) {          
      var refreshedEpisodes = [];
      
      console.log(refreshedEpisodes)
      window.localStorage.setItem('episodes', JSON.stringify(refreshedEpisodes))
    }

    $.ajax(feed, {
      accepts:{
        xml:"application/rss+xml"
      },
      dataType:"xml",
      success:function(data) {
        //Credit: http://stackoverflow.com/questions/10943544/how-to-parse-an-rss-feed-using-javascript
        

          $(data).find("item").each((function(index) { // or "item" or whatever suits your feed
            if (index >= 50) return;
    
            var el = $(this);
    
            const title = el.find("title").text();
            const link = el.find("link").text();
            const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi efficitur molestie vulputate. Fusce elit neque, hendrerit at libero quis, aliquet imperdiet ante. Donec consectetur, odio vel interdum lacinia, tortor tellus gravida ligula, non maximus erat libero sed neque. Fusce varius neque ac quam scelerisque interdum. Duis lobortis ullamcorper ipsum pretium varius. Cras fringilla ipsum eu faucibus commodo. Suspendisse arcu ligula, mattis id libero a, efficitur aliquam ipsum. Nunc consequat lacus odio, ut finibus mi placerat vitae. Phasellus aliquam turpis felis, id ullamcorper odio aliquet vel. Maecenas sollicitudin dui sit amet nibh scelerisque, et fringilla velit tristique.`
            const thumbnail = el.find('itunes\\:image, image').attr('href')
    
            refreshedEpisodes.push({title, link, description, thumbnail})
            // $('#episodes').append(newEpisode(title, link, description, thumbnail));
          }));
      }	
    });
  }
  
  function newEpisode(title, url, description, thumbnail) {
    return `
      <div class="episode bg-light">
        <div class="episode-thumbnail">
          <img src="${thumbnail}" />
        </div>
        <div class="episode-content">
          <h3 class="episode-title">${title}</h3>
          <p>${description}</p>
          ${createAudioPlayer(url)}
        </div>
      </div>`
  }

  function createAudioPlayer(url) {
    return `<audio controls class="audio-player">
              <source src="${url}" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>`
  }
	
});