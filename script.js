const template = document.getElementsByTagName("template")[0];
const rootElem = document.getElementById("root");
const bodyElem = document.getElementsByTagName("body")[0];

let allEpisodes = []
const api = 'https://api.tvmaze.com/shows/82'

fetchMessage("Loading episodes")

// fetch data from tvmaze and setup the page
fetch(`${api}/episodes`)
  .then((response) => response.json())
  .then((data) => {
    if (data.length > 100) {
      for (let i = 0; i < 100; i++) {
        allEpisodes.push(data[i])
      }
    } else {
      allEpisodes = [...data];
    }

    fetchMessage("");
  })
  .then(() => makePageForEpisodes(allEpisodes))
  .then(() => setupSearch())
  .then(() => allEpisodes.map((episode) => addEpisodeInSelector(episode)))
  .catch((error) => fetchMessage(error));

// Set the correct series name
fetch(api)
  .then((response) => response.json())
  .then((data) => setSeriesName(data.name))

function setSeriesName(seriesName) {
  const seriesNameField = document.querySelector("#series-name");
  seriesNameField.innerText = seriesName;
}

function makePageForEpisodes(episodeList) {
  const episodeListHtml = makeEpisodeListHtml(episodeList)
  rootElem.append(episodeListHtml);
  updateEpisodeListCounter(episodeList);
}

function makeEpisodeListHtml(episodeList) {
  let episodeListHtml = document.querySelector(".episodes-list");
  const episodeCards = episodeList.map(makeEpisodeCard);

  // If there is a episode list, delete content. If not, clone from the template.
  episodeListHtml ? episodeListHtml.innerHTML = "" : episodeListHtml = template.content.querySelector(".episodes-list").cloneNode(true)

  episodeListHtml.append(...episodeCards);

  return episodeListHtml;
}

function addEpisodeInSelector(episode) {
  const episodeName = episode.name;
  const episodeSeason = `${episode.season}`.padStart(2, "0");
  const episodeNumber = `${episode.number}`.padStart(2, "0");

  const episodeNumberAndTitle = `S${episodeSeason}E${episodeNumber} - ${episodeName}`
  const episodeOptionValue = `S${episodeSeason}E${episodeNumber}-${episodeName}`.toLowerCase().replace(/ /g, "-")

  const episodeSelector = document.querySelector("#episode-selector");
  episodeSelector.innerHTML += `<option value = ${episodeOptionValue}>${episodeNumberAndTitle}</option>`;
}

// Make the card
function makeEpisodeCard(episode) {
  const episodeCard = template.content.querySelector(".episode-card").cloneNode(true);
  const episodeName = episode.name;
  const episodeSeason = `${episode.season}`.padStart(2, "0");
  const episodeNumber = `${episode.number}`.padStart(2, "0");
  const episodeImage = episode.image.medium;
  const episodeSummary = episode.summary;

  const episodeTitle = `${episodeName} - S${episodeSeason}E${episodeNumber}`


  episodeCard.querySelector(".episode-card__title")
    .innerText = episodeTitle;

  episodeCard.querySelector(".episode-card__img").src = episodeImage || './No-Image-Placeholder.png';
  episodeCard.querySelector(".episode-card__summary").outerHTML = episodeSummary;

  return episodeCard;
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  const episodeSelector = document.getElementById("episode-selector");
  const resetSearch = document.getElementById("reset-search");

  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.trim().toLowerCase();
    filterEpisodes(searchTerm);
  });

  episodeSelector.addEventListener("change", function () {
    const selectedEpisode = episodeSelector.value;
    const searchTerm = selectedEpisode.substring(0, selectedEpisode.indexOf("-"));
    filterEpisodes(searchTerm);
  });

  resetSearch.addEventListener("click", function () {
    filterEpisodes("");
    searchInput.value = "";
    episodeSelector.value = "";
  })
}

function filterEpisodes(searchTerm) {
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

function updateEpisodeListCounter(episodeList) {
  const episodesDisplayAmount = document.querySelector(
    ".episodes-display-amount"
  );
  episodesDisplayAmount.textContent = `Displaying ${episodeList.length} out of ${allEpisodes.length} episodes`;
}

function fetchMessage(message) {
  const fetchMessageContainer = document.querySelector("#fetch-message") ? document.querySelector("#fetch-message") : template.content.querySelector("#fetch-message").cloneNode(true);

  if (message === "") {
    fetchMessageContainer.classList.toggle("hidden");
  } else {
    fetchMessageContainer.textContent = message;
    bodyElem.appendChild(fetchMessageContainer);
  }
}