const api = 'https://api.tvmaze.com/shows'

document.addEventListener('DOMContentLoaded', function () {
  fetchShows(api);
  makePageForEpisodes();
});

const template = document.getElementsByTagName("template")[0];
const rootElem = document.getElementById("root");
const bodyElem = document.getElementsByTagName("body")[0];
const fetchMessageContainer = document.getElementById("fetch-message")

// Fetch shows
function fetchShows(api) {
  let showList = [];
  fetch(api)
    .then((response) => response.json())
    .then((data) => showList = data)
    .then(() => populateShowSelector(showList))
}

// Populate shows dropdown, and set event listener
function populateShowSelector(showList) {
  const orderedShowList = showList.sort((a, b) => a.name.localeCompare(b.name))
  const showSelector = document.querySelector("#show-selector");
  orderedShowList.map((show) => {
    const showName = show.name
    const showId = show.id
    showSelector.innerHTML += `<option value = ${showId}>${showName}</option>`;
  })

  const showSelectorChangeHandler = (event) => {
    const showId = event.target.value;
    fetchEpisodes(api, showId);
  };

  showSelector.addEventListener("change", showSelectorChangeHandler);
}

function fetchEpisodes(api, showId) {
  let allEpisodes = [];

  if (showId) {
    fetchMessage("Loading episodes")
    fetch(`${api}/${showId}/episodes`)
      .then((response) => response.json())
      .then((data) => allEpisodes = data)
      .then(() => makePageForEpisodes(allEpisodes))
      .then(() => populateEpisodeSelector(allEpisodes))
      .then(() => updateEpisodeListCounter(allEpisodes, allEpisodes))
      .catch((error) => fetchMessage(error));

    // Set the correct show name
    fetch(`${api}/${showId}`)
      .then((response) => response.json())
      .then((data) => setShowName(data.name))

    function setShowName(showName) {
      const showNameField = document.querySelector("#show-name");
      showNameField.innerText = showName;
    }
  } else {
    makePageForEpisodes();
  }
}

// Populate episodes dropdown menu, and set event listener
function populateEpisodeSelector(allEpisodes) {
  const episodeSelector = document.querySelector("#episode-selector");

  allEpisodes.map((episode) => {
    const episodeName = episode.name;
    const episodeSeason = `${episode.season}`.padStart(2, "0");
    const episodeNumber = `${episode.number}`.padStart(2, "0");

    const episodeNumberAndTitle = `S${episodeSeason}E${episodeNumber} - ${episodeName}`
    const episodeId = episode.id;

    episodeSelector.innerHTML += `<option value = ${episodeId}>${episodeNumberAndTitle}</option>`;
  })

  episodeSelector.addEventListener("change", (event) => {
    console.log(event.target.value);
  })
}

function makePageForEpisodes(episodeList) {
  const episodeListHtml = makeEpisodeListHtml(episodeList)
  rootElem.append(episodeListHtml);
}

function makeEpisodeListHtml(episodeList) {
  let episodeListHtml = document.querySelector(".episodes-list");
  episodeListHtml ? episodeListHtml.innerHTML = "" : episodeListHtml = template.content.querySelector(".episodes-list").cloneNode(true)


  if (episodeList) {
    const episodeCards = episodeList.map(makeEpisodeCard);
    episodeListHtml.append(...episodeCards);
    fetchMessage("")
    return episodeListHtml;
  }

  episodeListHtml.innerHTML = `<h2 class="message">Please, select a show in the dropdown menu above</h2>`;
  const episodesDisplayAmount = document.querySelector(".episodes-display-amount");
  episodesDisplayAmount.innerHTML = "";
  return episodeListHtml;
}

function addEpisodeInSelector(episode) {

}



// Make the card
function makeEpisodeCard(episode) {
  const episodeCard = template.content.querySelector(".episode-card").cloneNode(true);

  const episodeName = episode.name;
  const episodeSeason = `${episode.season}`.padStart(2, "0");
  const episodeNumber = `${episode.number}`.padStart(2, "0");
  const episodeImage = episode.image ? episode.image.medium : '';
  const episodeSummary = episode.summary;

  const episodeTitle = `${episodeName} - S${episodeSeason}E${episodeNumber}`;

  episodeCard.querySelector(".episode-card__title").textContent = episodeTitle;
  episodeCard.querySelector(".episode-card__img").src = episodeImage;
  episodeCard.querySelector(".episode-card__summary").innerHTML = episodeSummary;

  return episodeCard;
}

function setupSearchInput() {
  const searchInput = document.getElementById("search-input");
  const episodeSelector = document.getElementById("episode-selector");
  const showSelector = document.getElementById("show-selector");
  const resetSearch = document.getElementById("reset-search");

  searchInput.addEventListener("input", searchInputHandler);

  const searchInputHandler = (event) => {
    const searchTerm = event.value.trim().toLowerCase();
    filterEpisodes(searchTerm);
  }

  resetSearch.addEventListener("click", function () {
    filterEpisodes("");
    searchInput.value = "";
    episodeSelector.value = "";
    showSelector.value = ""
  })
}

function filterEpisodes(allEpisodes, searchTerm) {
  const filteredEpisodes = episodeList.filter(
    (episode) => {
      const episodeName = episode.name;
      const episodeSeason = `${episode.season}`.padStart(2, "0");
      const episodeNumber = `${episode.number}`.padStart(2, "0");

      const episodeTitle = `${episodeName} - S${episodeSeason}E${episodeNumber}`

      const result = episodeTitle.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)

      return result
    }
  );

  makePageForEpisodes(filteredEpisodes);
}

function updateEpisodeListCounter(episodeList, allEpisodes) {
  const episodesDisplayAmount = document.querySelector(".episodes-display-amount");
  episodesDisplayAmount.textContent = `Displaying ${episodeList.length} out of ${allEpisodes.length} episodes`;
}

function fetchMessage(message) {

  if (message === "") {
    console.log('class hidden toggled');
    fetchMessageContainer.classList.toggle("hidden");
  } else {
    fetchMessageContainer.classList.toggle("hidden");
    fetchMessageContainer.textContent = message;
    bodyElem.appendChild(fetchMessageContainer);
  }
}