const api = 'https://api.tvmaze.com/shows'

document.addEventListener('DOMContentLoaded', function () {
  fetchShows(api);
  makePageForEpisodes();
});

const template = document.getElementsByTagName("template")[0];
const showListPageElement = template.content.querySelector("#show-list-page").cloneNode(true)
const rootElem = document.getElementById("root");
const bodyElem = document.getElementsByTagName("body")[0];
const fetchMessageContainer = document.getElementById("fetch-message")
const searchInput = document.getElementById("search-input");
const episodeSelector = document.getElementById("episode-selector");
const showSelector = document.getElementById("show-selector");
const resetSearch = document.getElementById("reset-search");
const backToShowsPage = document.getElementById("back-to-show-page");
let allEpisodes = []
let allShows = []

// Handlers
const showSelectorChangeHandler = (event) => {
  const showId = event.target.value;
  showId ? fetchEpisodes(api, showId) : noShowSelected()
};

const showPageSelectShowHandler = (showId) => {
  showId ? fetchEpisodes(api, showId) : noShowSelected()
  showSelector.value = showId
  displayShowListPage()
}

const episodeSelectorChangeHandler = (event) => {
  const episodeId = Number(event.target.value);
  filterEpisodesById(episodeId);
};

const searchEpisodesInputHandler = (event) => {
  const searchTerm = event.target.value.trim().toLowerCase();
  filterEpisodesByKeyword(searchTerm);
}

const searchShowsInputHandler = (event) => {
  const searchTerm = event.target.value.trim().toLowerCase();
  filterShowsByKeyword(searchTerm);
}

const showListPageSelectorChangeHandler = (event) => {
  const showId = event.target.value;

  if (showId) {
    const filteredShowList = allShows.filter(show => show.id == showId);
    makePageForShows(filteredShowList);
  } else {
    makePageForShows(allShows);
  }
}

const backToShowsPageHandler = () => {
  const showListPageSelector = showListPageElement.querySelector("#show-list-page__selector")

  resetSearchClickHandler()
  showSelector.value = ''
  showListPageSelector.value = ''
  noShowSelected()
  makePageForShows(allShows)
  displayShowListPage()
}

const resetSearchClickHandler = () => {
  if (allEpisodes.length > 0) {
    searchInput.value = '';
    episodeSelector.value = '';
    makePageForEpisodes(allEpisodes);
  } else { }
}

// Fetch shows
function fetchShows(api) {
  fetch(api)
    .then((response) => response.json())
    .then((data) => allShows = data)
    .then(() => setupShowPage())
}

// Show list page

function setupShowPage() {
  rootElem.append(showListPageElement)
  populateShowSelector(allShows)
  makePageForShows(allShows)

  const showListPageSearch = showListPageElement.querySelector("#show-list-page__search");
  showListPageSearch.addEventListener("input", searchShowsInputHandler);
}

function displayShowListPage() {
  showListPageElement.classList.toggle("hidden");

}

function makePageForShows(showList) {
  const showListHtml = makeShowListHtml(showList)
  updateShowListCounter(showList)

}

function filterShowsByKeyword(searchTerm) {
  const filteredShows = allShows.filter(
    (show) => {
      const result = Object.values(show).toString().toLowerCase().includes(searchTerm)
      return result
    }
  );

  makePageForShows(filteredShows);
}

function updateShowListCounter(showList) {
  const showsDisplayAmount = showListPageElement.querySelector("#show-list-page__counter");

  if (showList && allShows) {
    showsDisplayAmount.textContent = `Displaying ${showList.length} out of ${allShows.length} shows`;
  } else { showsDisplayAmount.textContent = "" }
}

function makeShowListHtml(showList) {
  let showListHtml = showListPageElement.querySelector("#show-list-page__list")
  showListHtml.innerHTML = ""

  if (showList) {
    const showCards = showList.map(makeShowCard);
    showListHtml.append(...showCards);
  } else {
    showListHtml.innerHTML = `<h2 class="message">No show found</h2>`;
  }
}

function makeShowCard(show) {
  const showCard = template.content.querySelector(".show-card").cloneNode(true)

  const showId = show.id;
  const showTitle = show.name;
  const showImage = show.image ? show.image.medium : '';
  const showSummary = show.summary;
  const showRating = show.rating.average;
  const showGenres = show.genres.join(' | ')
  const showStatus = show.status;
  const showRuntime = show.runtime;

  showCard.dataset.showId = showId;
  showCard.querySelector(".show-card__title").textContent = showTitle;
  showCard.querySelector(".show-card__img").src = showImage;
  showCard.querySelector(".show-card__summary").innerHTML = showSummary;
  showCard.querySelector(".show-card__rating").innerHTML = `<p><b>Rated:</b> ${showRating}</p>`;
  showCard.querySelector(".show-card__genres").innerHTML = `<p><b>Genres:</b> ${showGenres}</p>`;
  showCard.querySelector(".show-card__status").innerHTML = `<p><b>Status:</b> ${showStatus}</p>`;
  showCard.querySelector(".show-card__runtime").innerHTML = `<p><b>Runtime:</b> ${showRuntime}</p>`;

  return showCard
}


// Populate shows dropdown, and set event listener
function populateShowSelector(showList) {
  const showListPageSelector = showListPageElement.querySelector("#show-list-page__selector")
  showListPageSelector.innerHTML += `<option value="">Select a show</option>`

  const orderedShowList = showList.sort((a, b) => a.name.localeCompare(b.name))
  orderedShowList.map((show) => {
    const showName = show.name
    const showId = show.id
    showSelector.innerHTML += `<option value = ${showId}>${showName}</option>`;
    showListPageSelector.innerHTML += `<option value = ${showId}>${showName}</option>`;
  })

  showSelector.addEventListener("change", showSelectorChangeHandler);
  showListPageSelector.addEventListener("change", showListPageSelectorChangeHandler);
}

// Episodes List Page

function fetchEpisodes(api, showId) {
  if (showId) {
    fetchMessage("Loading episodes")
    fetch(`${api}/${showId}/episodes`)
      .then((response) => response.json())
      .then((data) => allEpisodes = data)
      .then(() => makePageForEpisodes(allEpisodes))
      .then(() => populateEpisodeSelector(allEpisodes))
      .then(() => updateEpisodeListCounter(allEpisodes, allEpisodes))
      .then(() => fetchMessage(""))
      .catch((error) => fetchMessage(error));

    // Set the correct show name
    fetch(`${api}/${showId}`)
      .then((response) => response.json())
      .then((data) => setShowName(data.name))

  } else {
    resetSearchClickHandler();
  }
}

function setShowName(showName) {
  const showNameField = document.querySelector("#show-name");
  showNameField.innerText = `${showName} Episodes`;
}

// Populate episodes dropdown menu, and set event listener
function populateEpisodeSelector(allEpisodes) {
  if (allEpisodes.length > 0) {
    episodeSelector.innerHTML = "";
    episodeSelector.innerHTML = `<option value = "">Show all Episodes</option>`
    allEpisodes.map((episode) => {
      const episodeName = episode.name;
      const episodeSeason = `${episode.season}`.padStart(2, "0");
      const episodeNumber = `${episode.number}`.padStart(2, "0");

      const episodeNumberAndTitle = `S${episodeSeason}E${episodeNumber} - ${episodeName}`
      const episodeId = episode.id;

      episodeSelector.innerHTML += `<option value = ${episodeId}>${episodeNumberAndTitle}</option>`;
    })
    episodeSelector.removeEventListener("change", episodeSelectorChangeHandler)
    episodeSelector.addEventListener("change", episodeSelectorChangeHandler)

    searchInput.removeEventListener("input", searchEpisodesInputHandler)
    searchInput.addEventListener("input", searchEpisodesInputHandler);
  } else {
    episodeSelector.innerHTML = "<option>No episodes found</option>";
    episodeSelector.removeEventListener("change", episodeSelectorChangeHandler)
    searchInput.removeEventListener("input", searchEpisodesInputHandler)
  }
}

function makePageForEpisodes(episodeList) {
  const episodeListHtml = makeEpisodeListHtml(episodeList)
  rootElem.append(episodeListHtml);
  updateEpisodeListCounter(episodeList)
}

function makeEpisodeListHtml(episodeList) {
  let episodeListHtml = document.querySelector(".episodes-list");
  episodeListHtml ? episodeListHtml.innerHTML = "" : episodeListHtml = template.content.querySelector(".episodes-list").cloneNode(true)

  if (episodeList) {
    const episodeCards = episodeList.map(makeEpisodeCard);
    episodeListHtml.append(...episodeCards);
    return episodeListHtml;
  }

  setShowName("No")
  episodeListHtml.innerHTML = `<h2 class="message">Please, select a show in the dropdown menu above</h2>`;
  updateEpisodeListCounter()
  return episodeListHtml;
}

// Make the episode card
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

function filterEpisodesByKeyword(searchTerm) {
  const filteredEpisodes = allEpisodes.filter(
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

function filterEpisodesById(episodeId) {
  if (episodeId) {
    const selectedEpisode = allEpisodes.filter((episode) => {
      return episode.id === episodeId;
    })
    makePageForEpisodes(selectedEpisode)
  } else {
    makePageForEpisodes(allEpisodes)
  }
}

resetSearch.addEventListener("click", resetSearchClickHandler)
backToShowsPage.addEventListener("click", backToShowsPageHandler)

function updateEpisodeListCounter(episodeList) {
  const episodesDisplayAmount = document.querySelector(".episodes-display-amount");

  if (episodeList && allEpisodes) {
    episodesDisplayAmount.textContent = `Displaying ${episodeList.length} out of ${allEpisodes.length} episodes`;
  } else { episodesDisplayAmount.textContent = "" }

}

function noShowSelected() {
  searchInput.value = "";
  episodeSelector.value = '';
  allEpisodes = []
  makePageForEpisodes();
  populateEpisodeSelector(allEpisodes);
}

function fetchMessage(message) {

  if (message === "") {
    fetchMessageContainer.classList.toggle("hidden");
  } else {
    fetchMessageContainer.classList.toggle("hidden");
    fetchMessageContainer.textContent = message;
  }
}