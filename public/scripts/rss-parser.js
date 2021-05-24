var episodeList = [];
var feed = "https://impruv.libsyn.com/rss";
var fetchSize = 28;
var librarySize = 4;

$(document).ready(function() {
  init();
});

function init() {
  createAudioPlayerEvent()

  episodeList = JSON.parse(window.localStorage.getItem('episodes')) 
  if (true) {
  // if (!episodeList || episodeList.length == 0) {
    fetchRssFeed(parseRssFeed);
  } else {
    injectEpisodes();
  }
}	

function createAudioPlayerEvent() {
  document.addEventListener('play', function(e){
    var audios = document.getElementsByTagName('audio');
    for(var i = 0, len = audios.length; i < len;i++){
        if(audios[i] != e.target){
            audios[i].pause();
        }
    }
  }, true);
}

function fetchRssFeed(cb) {
  $.ajax(feed, {
    accepts:{
      xml:"application/rss+xml"
    },
    dataType:"xml",
    success:(data) => {
      cb(data);
    }
  });
}

function parseRssFeed(data) {
  episodeList = [];
  $(data).find("item").each((function(index) { // or "item" or whatever suits your feed
    if (index >= fetchSize) return;

    var el = $(this);

    const title = el.find("title").text();
    const link = el.find('enclosure').attr('url')
    const description = el.find('itunes\\:summary').text();
    const thumbnail = el.find('itunes\\:image, image').attr('href');
    console.log('title, link, description, thumbnail, enclosure', title, link, description, thumbnail)

    episodeList.push({title, link, description, thumbnail})
    
  }));

  injectEpisodes();
  window.localStorage.setItem('episodes', JSON.stringify(episodeList))
}

function injectEpisodes() {
  if (episodeList && episodeList.length >= 1) {    
    const homeEpisodes = episodeList.slice(0, 3);
    homeEpisodes.forEach(ep => {
      $('#episodes').append(newEpisode(ep.title, ep.link, ep.description, ep.thumbnail));
    })
  
    const featEp = episodeList[0]
    if (featEp) $('#featured-episode').append(newFeaturedEpisode(featEp.title, featEp.link, featEp.description, featEp.thumbnail))
  
    const libraryEpisodes = episodeList.slice(1, 4);
    libraryEpisodes.forEach(ep => {
      $('#library').append(newLibraryEpisode(ep.title, ep.link, ep.description, ep.thumbnail));
    })
  }
  
  if (!episodeList || episodeList.length < 1 ) {
    $('#not-found-msg').attr('hidden', false)
  }

  if (!episodeList || episodeList.length <= 1) {
    $('#load-more-btn').attr('hidden', true)
    $('#library-not-found-msg').attr('hidden', false)
  }
}

function newEpisode(title, url, description, thumbnail) {
  return `
    <div class="episode bg-accent text-secondary box-shadow-sm">
      <div class="episode-flex">
        <img class="thumbnail" src="${thumbnail}" alt="album picture for episode">
        <div class="episode-content">
          <h4 class="body-heading">${title}</h4>
          <p class="paragraph-md">${description}</p>
        </div>
      </div>
      <audio controls controlsList="nodownload" src="${url}">
        Your browser does not support audio playback.
      </audio>
    </div>`
}

function newFeaturedEpisode(title, url, description, thumbnail) {
  return `
    <div class="featured-episode-flex">
      <img class="featured-thumbnail margin-bottom margin-right" src="${thumbnail}" alt="album picture for featured episode">
      <div class="margin-left">
        <h4 class="margin-0 body-header">${title}</h4>
        <p class="paragraph-md">${description}</p>
      </div>
    </div>
    <audio class="margin-top w-100" controls controlsList="nodownload" src="${url}">
      Your browser does not support audio playback.
    </audio>`
}

function newLibraryEpisode(title, url, description, thumbnail) {
  return `
  <article class="episode bg-secondary text-left box-shadow-sm">
    <img class="library-thumbnail" src="${thumbnail}" alt="album picture for library episode">
    <h4 class="body-heading margin-bottom">${title}</h4>
    <p class="paragraph-md">${description}</p>
    <audio class="lib-audio-player" controls controlsList="nodownload" src="${url}">
      Your browser does not support audio playback.
    </audio>
  </article>`
}

function loadMoreLibraryEpisodes() {
  const moreLibraryEpisodes = episodeList.slice(librarySize, librarySize + 3);
  moreLibraryEpisodes.forEach(ep => {
    $('#library').append(newLibraryEpisode(ep.title, ep.link, ep.description, ep.thumbnail));
  })
  librarySize += 3;
  setTimeout(scrollToBottom, 100)
}

function scrollToBottom() {
  const librarySection =  $('#library');
  const loadBtn =  $('#load-more-btn');
  const targetPosition = (loadBtn.offset().top + loadBtn.height() + loadBtn.outerHeight()) - window.innerHeight;
  $([document.documentElement, document.body])
  .animate({
    scrollTop: targetPosition
  }, 500);
}