const template = document.getElementsByTagName("template")[0];
let allEpisodes
const rootElem = document.getElementById("root");

// Load the page
async function setup() {
  allEpisodes = await getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  setupSearch();
}

function makePageForEpisodes(episodeList) {
  const episodeListHtml = makeEpisodeListHtml(episodeList)
  rootElem.append(episodeListHtml);
  updateEpisodeListCounter(episodeList);
}

async function makeEpisodeListHtml(episodeList) {
  let episodeListHtml = document.querySelector(".episodes-list");
  const episodeCards = await episodeList.map(makeEpisodeCard);

  // If there is a episode list, delete content. If not, clone from the template.
  episodeListHtml ? episodeListHtml.innerHTML = "" : episodeListHtml = template.content.querySelector(".episodes-list").cloneNode(true)

  episodeListHtml.append(...episodeCards);

  return episodeListHtml;
}

function makeEpisodeListArray(episodeList, htmlElement) {

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

  episodeCard.querySelector(".episode-card__img").src = episodeImage;
  episodeCard.querySelector(".episode-card__summary").outerHTML = episodeSummary;

  return episodeCard;
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.trim().toLowerCase();
    filterEpisodes(searchTerm);
  });
}

function filterEpisodes(searchTerm) {
  const filteredEpisodes = allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchTerm) ||
      episode.summary.toLowerCase().includes(searchTerm)
  );

  makePageForEpisodes(filteredEpisodes);
}

function updateEpisodeListCounter(episodeList) {
  const episodesDisplayAmount = document.querySelector(
    ".episodes-display-amount"
  );
  episodesDisplayAmount.textContent = `Displaying ${episodeList.length} out of ${allEpisodes.length} episodes`;
}

window.onload = setup;


