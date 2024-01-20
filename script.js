//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  // const episodeCards = episodeList.map(makeEpisodeCard);
  const template = document.getElementsByTagName("template")[0];
  console.log(template);
  let clone = template.content.cloneNode(true);
  console.log(clone);
  rootElem.append(clone);

  // rootElem.append(...episodeCards)
}

// function makeEpisodeCard(episode) {
  
// }


window.onload = setup;
