document.addEventListener('DOMContentLoaded', function () {
    const defaultShowId = 82; // We're setting a number to identify a TV show. It's like giving the TV show a special code.
  
    // When the page finishes loading, we want to show episodes of a TV show right away.
    fetchEpisodes(defaultShowId);
  
    // We're creating a special menu that lets people choose which TV show they want to see.
    const nameFilterElement = document.getElementById('name-filter');
    // We're also creating another special menu that lets people pick a specific episode they want to watch.
    const episodeNumberFilterElement = document.getElementById('episode-number-filter');
  
    // We're asking the internet for a list of TV shows and then making a menu of those shows for people to choose from.
    fetch('https://api.tvmaze.com/shows')
        .then(response => response.json())
        .then(data => {
            // We're taking the list of TV shows we got from the internet and organizing them into a nice menu.
            const nameFilterOptions = data.map(show => {
                return { id: show.id, name: show.name };
            });
            // When someone picks a TV show from the menu, we want to show the episodes of that show.
            populateDropdown(nameFilterElement, nameFilterOptions, 'name');
            // When someone picks a TV show from the menu, we want to show the episodes of that show.
            nameFilterElement.addEventListener('change', function () {
                fetchEpisodes(this.value);
            });
        })
        .catch(error => console.error('Error fetching TV shows:', error));
  
    // We're setting up a place where people can type in words to search for specific episodes.
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function () {
        // Whenever someone types something, we want to find and show episodes that match what they typed.
        const searchTerm = this.value.trim().toLowerCase();
        filterEpisodesByKeyword(searchTerm);
    });
  });
  
  // We're asking the internet for episodes of a TV show so we can show them to people.
  function fetchEpisodes(showId) {
    // We're finding the right place on the internet where we can get episodes of a specific TV show.
    const showEpisodesApi = `https://api.tvmaze.com/shows/${showId}/episodes`;
  
    // We're asking the internet to give us episodes of the TV show we're interested in.
    fetch(showEpisodesApi)
        .then(response => response.json())
        .then(episodes => {
            // Once we get the episodes from the internet, we want to show them on the webpage.
            makePageForEpisodes(episodes);
        })
        .catch(error => console.error('Error fetching episodes:', error));
  }
  
  // We're preparing a space on the webpage to show episodes of a TV show.
  function makePageForEpisodes(episodeList) {
    const rootElem = document.getElementById("root");
    rootElem.innerHTML = ""; // We're making sure there's nothing else on the webpage before we put the episodes here.
  
    // We're creating little cards for each episode and putting them on the webpage.
    episodeList.forEach(episode => {
        const episodeCard = makeEpisodeCard(episode);
        rootElem.appendChild(episodeCard);
    });
  
    // We're making a menu of episode numbers so people can pick a specific episode to watch.
    populateEpisodeNumberFilter(episodeList);
  
    // We're updating the episode list counter to show the total number of episodes.
    updateEpisodeListCounter(episodeList.length);
  }
  
  // We're creating a special card for each episode to show its details, like the title and summary.
  function makeEpisodeCard(episode) {
    // We're designing a special card to show information about the episode.
    const episodeCard = document.createElement('div');
    episodeCard.classList.add('episode-card');
  
    const title = document.createElement('h2');
    title.classList.add('episode-card__title');
    // We're showing the name of the episode and its season and episode numbers.
    title.textContent = `${episode.name} - S${episode.season.toString().padStart(2, '0')}E${episode.number.toString().padStart(2, '0')}`;
  
    const dataContainer = document.createElement('div');
    dataContainer.classList.add('episode-card__data');
  
    const image = document.createElement('img');
    image.classList.add('episode-card__img');
    // We're showing an image for the episode. If there's no image available, we show a placeholder.
    image.src = episode.image ? episode.image.medium : './No-Image-Placeholder.png';
  
    const summary = document.createElement('p');
    summary.classList.add('episode-card__summary');
    summary.innerHTML = episode.summary;
  
    // We're putting all the information about the episode together on the card.
    dataContainer.appendChild(image);
    dataContainer.appendChild(summary);
    episodeCard.appendChild(title);
    episodeCard.appendChild(dataContainer);
  
    return episodeCard;
  }
  
  // We're making a menu of episode numbers so people can pick a specific episode to watch.
  function populateEpisodeNumberFilter(episodeList) {
    const episodeNumberFilterElement = document.getElementById('episode-number-filter');
  
    // We're clearing out any old options from the menu.
    episodeNumberFilterElement.innerHTML = "";
  
    // We're making an option to show all episodes in case people want to see them all.
    const defaultOption = document.createElement('option');
    defaultOption.value = 'all';
    defaultOption.textContent = 'Show All Episodes';
    episodeNumberFilterElement.appendChild(defaultOption);
  
    // We're adding each episode number to the menu so people can pick one.
    episodeList.forEach(episode => {
        const optionElement = document.createElement('option');
        optionElement.value = `S${episode.season.toString().padStart(2, '0')}E${episode.number.toString().padStart(2, '0')}`;
        optionElement.textContent = `${optionElement.value} - ${episode.name}`;
        episodeNumberFilterElement.appendChild(optionElement);
    });
  
    // When someone picks an episode from the menu, we want to show that episode and hide the others.
    episodeNumberFilterElement.addEventListener('change', function () {
        const selectedEpisode = this.value;
        filterEpisodesByEpisodeNumber(selectedEpisode, episodeList);
    });
  }
  
  // Function to filter episodes by selected episode number
function filterEpisodesByEpisodeNumber(selectedEpisode, episodeList) {
    const rootElem = document.getElementById("root");
    rootElem.innerHTML = ""; // Clear previous episodes
    
    if (selectedEpisode === 'all') {
      makePageForEpisodes(episodeList);
      displayEpisodeCount(episodeList.length);
    } else {
      const [season, episodeNumber] = selectedEpisode.split('E');
      const selectedEpisodeCard = episodeList.find(episode => episode.season === parseInt(season.slice(1)) && episode.number === parseInt(episodeNumber));
      if (selectedEpisodeCard) {
        const episodeCard = makeEpisodeCard(selectedEpisodeCard);
        rootElem.appendChild(episodeCard);
        displayEpisodeCount(1); // Display count of 1 when single episode is selected
      }
    }
    }
    
    // Display the count of episodes
    function displayEpisodeCount(count) {
    const episodesDisplayAmount = document.querySelector(".episodes-display-amount");
    episodesDisplayAmount.textContent = `Displaying ${count} out of ${count} episodes`;
    }
    
  
  // We're looking at each episode's details to see if they match the search keyword people typed in.
  function filterEpisodesByKeyword(keyword) {
    const rootElem = document.getElementById("root");
    const episodeCards = rootElem.querySelectorAll('.episode-card');
    episodeCards.forEach(card => {
        // If the episode contains the keyword, we show it. Otherwise, we hide it.
        if (card.textContent.toLowerCase().includes(keyword)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
  }
  
  // We're making a menu where people can pick different options.
  function populateDropdown(element, options, type) {
    // We're arranging the options in alphabetical order.
    options.sort((a, b) => a.name.localeCompare(b.name));
    // We're putting the options in the menu for people to choose from.
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.id;
        if (type === 'name') {
            // We're showing the names of the TV shows in the menu.
            optionElement.textContent = option.name;
        } else if (type === 'episodeNumber') {
            // We're showing the episode numbers in the menu.
            optionElement.textContent = `Episode ${option.number}`;
        }
        element.appendChild(optionElement);
    });
  }
  
   // Function to update episode list counter
function updateEpisodeListCounter(filteredEpisodeCount) {
    const episodesDisplayAmount = document.querySelector('.episodes-display-amount');
    episodesDisplayAmount.textContent = `Displaying ${filteredEpisodeCount} out of ${filteredEpisodeCount} episodes`;
  }
  
