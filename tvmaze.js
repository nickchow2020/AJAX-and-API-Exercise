/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const response  = await axios.get("http://api.tvmaze.com/search/shows",{params:{q:query}});
  const allShow = response.data;
  const arrayData = [];
  extractObjInfo(arrayData,allShow)
  return arrayData
}

//function filter needed data
function extractObjInfo(arr,data){
  for(let {show} of data){
    const {id,name,summary,image} = show;
    const obj = {
      id,name,summary
    }
    if(image){
      const {medium:url} = image
      obj["url"] = url
    }else{
      obj["url"] = "https://tinyurl.com/tv-missing"
    }
    arr.push(obj)
  };
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
          <div class="card" data-show-id="${show.id}">
            <div class="card-body">
              <h5 class="card-title">${show.name}</h5>
              <img class="card-img-top" src=${show.url}>
              <p class="card-text">${show.summary}</p>
            </div>
            <button type="button" class="btn btn-success" data-toggle="modal" data-target="#exampleModal">Episodes</button>
          </div>
        </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);

  $("#search-query").val("");
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  const episodes = [];
  makeEpisodeObj(episodes,response)
  return episodes
}

//function to filter needed episode data
function makeEpisodeObj(arr,response){
  for(let episode of response.data){
    const {id,name,season,number} = episode
    const obj = {
      id,name,season,number
    }
    arr.push(obj)
  }
}

//function to print the Episode data to the DOM
async function populateEpisodes(episodes){
    const $episodeList = $("#episodes-list")
    for(let epis of episodes){
      const $li = $(`<li id=${epis.id}>${epis.name} (season ${epis.season}, number ${epis.number})</li>`)
      $episodeList.append($li)
    }
}

//callback function of episode buttons
async function handleEpisodes(e){
  const $showId = $(e.target).parent().data("showId");
  const episodes = await getEpisodes($showId);
  $("#episodes-list").empty();
  populateEpisodes(episodes);
  $("#episodes-area").show();
}

//click event episode buttons
$("#shows-list").on("click","button",handleEpisodes)
