//--------------------UI designing-------------------
const humberger = document.getElementById("humberger");
const sideBar = document.querySelector("#side-bar");
const smallSideBar = document.querySelector(".side-bar-sm");


//-----------------Fetching data----------------------
//------Add your Api Key in case of out of quota ----------------

const apiKey = `AIzaSyB750XpnggOUxA6lJ9VC0ceO26gNl2QNk8`;
const searchUrl = `https://www.googleapis.com/youtube/v3/search?`;
const videoUrl = `https://www.googleapis.com/youtube/v3/videos?`;
const channelUrl = `https://www.googleapis.com/youtube/v3/channels?`;

let userInput = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");
const videoCardContainer = document.querySelector(".video-container");

const filters = document.querySelector('.filters');
const filtersOptions = document.querySelectorAll('.filters .filter-option');
// var defaultvalue = 'all';


//-----------------humberger Menu-----------------------
humberger.addEventListener("click", sideBarMove);
// smallSideBar.addEventListener("mouseover", sideBarMove);
// smallSideBar.addEventListener('mouseout', sideBarMove);

function sideBarMove(){
  if (sideBar.matches(".enable")) {
    sideBar.classList.replace("enable", "disable");
    smallSideBar.classList.replace("disable", "enable");
  } else {
    sideBar.classList.replace("disable", "enable");
    smallSideBar.classList.replace("enable", "disable");
  }
}


const listEl = document.querySelector('#side-bar');
const liEls = listEl.querySelectorAll('#side-bar li');

liEls.forEach(tab => {
  tab.addEventListener('click', (e) => {
    listEl.querySelector('.active').classList.remove('active');
    e.target.classList.add('active');
  });
});

const liElsSm = smallSideBar.querySelectorAll('.side-bar-sm div');

liElsSm.forEach(tab => {
  tab.addEventListener('click', (e) => {
    smallSideBar.querySelector('.active').classList.remove('active');
    e.target.classList.add('active');
  });
});


//-----------------Display video on filter option select----------------------

filtersOptions.forEach(tab => {
  tab.addEventListener('click', (e) => {
    filters.querySelector('.active').classList.remove('active');
    e.target.classList.add('active');
    console.log(e.target.value);
    loadVideo(e.target.value);

  });
});
    
//------------------filter option------------------------------
async function loadVideo(value){
  const urlLink = searchUrl + new URLSearchParams({
    key: apiKey,
    q: value,
    part: 'snippet',
    maxResults: 6
  });
  
  try{
    const searchData = await getSearchVideo(urlLink);

    for(let i=0; i<searchData.items.length; i++){
      let video = searchData.items[i] ;
      let videoStats = await getVideoStats(video.id.videoId);
      let channelId = searchData.items[i].snippet.channelId;
      let channelData = await getChannelThumbnail(channelId);

      if(videoStats.items.length > 0){
        searchData.items[i].videoStats = videoStats.items[0].statistics; 
        searchData.items[i].duration = videoStats.items[0] && videoStats.items[0].contentDetails.duration;
        searchData.items[i].channelDatas = channelData.items[0].snippet.thumbnails.default.url;
      }
    }
    
    console.log(searchData);
    displayInUI(searchData.items);

  }catch(error){
    console.log(error);
  }
}




//------------------------Load Video on Window Loading -------------------------------
window.addEventListener('DOMContentLoaded', async () => {
  const defaultUrl = searchUrl + new URLSearchParams({
    key: apiKey,
    q: 'latest videos',
    part: 'snippet',
    maxResults: 6,
    regionCode: 'IN'
  });
  
  try{
    const searchData = await getSearchVideo(defaultUrl);

    for(let i=0; i<searchData.items.length; i++){
      let video = searchData.items[i] ;
      let videoStats = await getVideoStats(video.id.videoId);
      let channelId = searchData.items[i].snippet.channelId;
      let channelData = await getChannelThumbnail(channelId);

      if(videoStats.items.length > 0){
        searchData.items[i].videoStats = videoStats.items[0].statistics; 
        searchData.items[i].duration = videoStats.items[0] && videoStats.items[0].contentDetails.duration;
        searchData.items[i].channelDatas = channelData.items[0].snippet.thumbnails.default.url;
      }
    }
    
    console.log(searchData);
    displayInUI(searchData.items);

  }catch(error){
    console.log(error);
  }
});



//-------------------Load video onclick-----------------------------------------------
searchBtn.addEventListener('click', async () => {
  const urlLink = searchUrl + new URLSearchParams({
    key: apiKey,
    q: userInput.value,
    part: 'snippet',
    maxResults: 6
  });
  
  try{
    const searchData = await getSearchVideo(urlLink);

    for(let i=0; i<searchData.items.length; i++){
      let video = searchData.items[i] ;
      let videoStats = await getVideoStats(video.id.videoId);
      let channelId = searchData.items[i].snippet.channelId;
      let channelData = await getChannelThumbnail(channelId);

      if(videoStats.items.length > 0){
        searchData.items[i].videoStats = videoStats.items[0].statistics; 
        searchData.items[i].duration = videoStats.items[0] && videoStats.items[0].contentDetails.duration;
        searchData.items[i].channelDatas = channelData.items[0].snippet.thumbnails.default.url;
      }
    }
    console.log(searchData);
    displayInUI(searchData.items);

  }catch(error){
    console.log(error);
  }
});


//-------------fetch videoUrl data------------------
async function getSearchVideo(urlLink) {
  try {
    const response = await fetch(urlLink);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

//--------------fetch channel thumbnail-------------
async function getChannelThumbnail(channelId) {
  const channelThumbnailUrl = 
    channelUrl +
    new URLSearchParams({
      key: apiKey,
      part: "snippet",
      id: channelId,
    });

  try {
    const response = await fetch(channelThumbnailUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}


//------------fetch video stats
async function getVideoStats(videoId) {
  // console.log(videoId);
  const videoIdLink = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=statistics,contentDetails&id=${videoId}`;

  try {
    const response = await fetch(videoIdLink);
    const data = await response.json();
    return data;
  } catch (e) {
    return e;
  }
}

//-----------View sorter------------------
function getView(n){
  let num = parseInt(n);
  console.log(num);
  if(num < 1000){
    return num;
  }else if(num >= 1000 && num <= 999999){
    num /= 1000;
    num = parseInt(num);
    console.log(num+'K');
    return num+'K';
  }else {
    let million = parseInt(num / 1000000) + 'M';
    console.log(million);
    return million;
  }
}

//------------Time formating--------------
function formattedData(duration) {
  if(!duration){
    return 'NA';
  }
  //PT2H33M23S
  let newTime = duration.substring(2);
  // console.log(newTime);
  let strTime = "";
  
  for(let i=0; i<newTime.length-1; i++){
    if(newTime[i] === 'H' || newTime[i] === 'M'){
      strTime += ':';
    }else{
      strTime += newTime[i];
    }
  }
  console.log(strTime);
  if(strTime.length === 2){
    return '00:'+strTime;
  }else if(strTime.length === 1){
    return '00:0'+strTime;
  }
  return strTime;
}


//-----------------Display the fetched data to UI ------------------
function displayInUI(data) {

  videoCardContainer.innerHTML = '';

  data.forEach((dataItem) => {
    let thumbnailImg = dataItem.snippet.thumbnails.high.url;
    let channelIcone = dataItem.channelDatas;
    let videoTitle = dataItem.snippet.title;
    let channelTitle = dataItem.snippet.channelTitle;
    let time = dataItem.duration;
    let views = dataItem.videoStats ? getView(dataItem.videoStats.viewCount) + " views" : "NA";
    let Id = dataItem.id.videoId ? dataItem.id.videoId : dataItem.id.playlistId;
    console.log(Id);

    videoCardContainer.innerHTML += `
        <div class="video" onclick="window.open('https://www.youtube.com/watch?v=${Id}')" >
            <img src="${thumbnailImg}" class="thumbnail" alt="thumbnail">
                <div class="content">
                    <img src="${channelIcone}" class="channel-icon" alt="channel icon">
                    <b>${formattedData(time)}</b>
                    <div class="info">
                        <h4 class="title">${videoTitle}</h4>
                        <p class="channel-name">${channelTitle}</p>
                        <p class="viwes">${views}</p>
                    </div>
                </div>
        </div>
    `;
  });
}












//------------------------------Ignore the Below code-------------------------------------

// fetch(defaultUrl)
// .then(response => response.json())
// .then(data => {
//   data.items.forEach((item) => {
//     getChannelIcon(item);
//   });
// })
// .catch(error => console.log(error))

// const getChannelIcon = (video_data) => {
//   fetch(channelUrl + new URLSearchParams({
//     key: apiKey,
//     part: 'snippet',
//     id: video_data.snippet.channelId
//   }))
//   .then(response => response.json())
//   .then(data => {
//     video_data.channelDatas = data.items[0].snippet.thumbnails.default.url;
//     getVideoStatsOf(video_data);
//   })
// }

// const getVideoStatsOf = (video_data) => {
//   fetch(videoUrl + new URLSearchParams({
//     key: apiKey,
//     part: 'snippet,contentDetails',
//     id: video_data.id.videoId
//   }))
//   .then(response => response.json())
//   .then(data => {
//     if(data.items.length > 0){
//       video_data.videoDatas = data.items[0].statistics;
//       video_data.videoDatas.contentDetails = data.items[0].contentDetails.duration;
//     }
    
//     // displayInUI(video_data);
//     console.log(video_data);
//   })
// }

