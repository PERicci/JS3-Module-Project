const template = document.getElementsByTagName("template")[0];

// Load the page
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  setupSearch();
}

// Make the clone of the list, fill with episode cards and append them into the root
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const episodeListClone = template.content.querySelector(".episodes-list").cloneNode(true);
  const pageTitle = template.content.querySelector('h1').cloneNode(true)
  const episodeCards = episodeList.map(makeEpisodeCard);

  episodeListClone.append(...episodeCards);
  rootElem.append(pageTitle, episodeListClone);
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

// This parts is for the search bar and filtering through episodes
function setupSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.trim().toLowerCase();
    filterEpisodes(searchTerm);
  });
}

function filterEpisodes(searchTerm) {
  const allEpisodes = getAllEpisodes();
  const filteredEpisodes = allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchTerm) ||
      episode.summary.toLowerCase().includes(searchTerm)
  );

  updateEpisodeDisplay(filteredEpisodes);
}

function updateEpisodeDisplay(filteredEpisodes) {
  const episodesDisplayAmount = document.querySelector(
    ".episodes-display-amount"
  );
  episodesDisplayAmount.textContent = `Displaying ${filteredEpisodes.length} out of ${getAllEpisodes().length} episodes`;

  const episodesList = document.querySelector(".episodes-list");
  episodesList.innerHTML = ""; // Clear the current episode list

  filteredEpisodes.forEach(function (episode) {
    const episodeCard = makeEpisodeCard(episode);
    episodesList.appendChild(episodeCard);
  });
}

window.onload = setup;


