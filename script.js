//You can edit ALL of the code here
const template = document.getElementsByTagName("template")[0];

// Load the page
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
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


window.onload = setup;
