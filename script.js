document.addEventListener('DOMContentLoaded', function () {
  const defaultShowId = 82; // Default TV show ID, you can change this as needed

  // Fetch and display episodes for the default TV show upon page load
  fetchEpisodes(defaultShowId);

  // Add event listener to search input field
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', function () {
    const searchTerm = this.value.trim().toLowerCase();
    filterEpisodesByKeyword(searchTerm);
  });


  // Add event listener to reset button
const resetButton = document.getElementById('reset-search');
resetButton.addEventListener('click', function () {
  resetSearch(); // This function is called when the reset button is clicked
});

// Function to reset search input and episode selector
function resetSearch() {
  const searchInput = document.getElementById('search-input');
  searchInput.value = ''; // Reset search input field

  // Reset episode selector to show all episodes
  const episodeSelector = document.getElementById('episode-selector');
  episodeSelector.value = 'placeholder';

  // Fetch episodes for the default TV show
  fetchEpisodes(82); // Default show ID is 82
}






  // Fetch and display list of TV shows
  fetch('https://api.tvmaze.com/shows')
    .then(response => response.json())
    .then(data => {
      const nameFilterOptions = data.map(show => {
        return { id: show.id, name: show.name };
      });
      populateDropdown(document.getElementById('show-selector'), nameFilterOptions, 'name');

      // Event listener for selecting a TV show
      const showSelector = document.getElementById('show-selector');
      showSelector.addEventListener('change', function () {
        fetchEpisodes(this.value);
      });
    })
    .catch(error => console.error('Error fetching TV shows:', error));
});

// Fetch episodes for the selected TV show
function fetchEpisodes(showId) {
  const showEpisodesApi = `https://api.tvmaze.com/shows/${showId}/episodes`;

  fetch(showEpisodesApi)
    .then(response => response.json())
    .then(episodes => {
      makePageForEpisodes(episodes);
      populateEpisodeNumberFilter(episodes); // Populate episode number filter dropdown
    })
    .catch(error => console.error('Error fetching episodes:', error));
}

// Make page for episodes
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear previous episodes

  // Create and append episode cards
  episodeList.forEach(episode => {
    const episodeCard = makeEpisodeCard(episode);
    rootElem.appendChild(episodeCard);
  });

  // Update episode list counter
  updateEpisodeListCounter(episodeList.length);
}

// Function to create episode cards
function makeEpisodeCard(episode) {
  // Create episode card elements and populate them with episode information
  const episodeCard = document.createElement('div');
  episodeCard.classList.add('episode-card');

  const title = document.createElement('h2');
  title.classList.add('episode-card__title');
  title.textContent = `${episode.name} - S${episode.season.toString().padStart(2, '0')}E${episode.number.toString().padStart(2, '0')}`;

  const dataContainer = document.createElement('div');
  dataContainer.classList.add('episode-card__data');

  const image = document.createElement('img');
  image.classList.add('episode-card__img');
  image.src = episode.image ? episode.image.medium : './No-Image-Placeholder.png';

  const summary = document.createElement('p');
  summary.classList.add('episode-card__summary');
  summary.innerHTML = episode.summary;

  // Append elements to episode card
  dataContainer.appendChild(image);
  dataContainer.appendChild(summary);
  episodeCard.appendChild(title);
  episodeCard.appendChild(dataContainer);

  return episodeCard;
}

// Function to populate dropdown menu for episode number filter
function populateEpisodeNumberFilter(episodeList) {
  const episodeNumberFilterElement = document.getElementById('episode-selector');

  // Clear previous options
  episodeNumberFilterElement.innerHTML = "";

  // Create default option to show all episodes
  const defaultOption = document.createElement('option');
  defaultOption.value = 'all';
  defaultOption.textContent = 'Show All Episodes';
  episodeNumberFilterElement.appendChild(defaultOption);

  // Populate dropdown with episode numbers
  episodeList.forEach(episode => {
    const optionElement = document.createElement('option');
    optionElement.value = `S${episode.season.toString().padStart(2, '0')}E${episode.number.toString().padStart(2, '0')}`;
    optionElement.textContent = `${optionElement.value} - ${episode.name}`;
    episodeNumberFilterElement.appendChild(optionElement);
  });

  // Add event listener to filter episodes when an option is selected
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

// Function to filter episodes by keyword
function filterEpisodesByKeyword(keyword) {
  const rootElem = document.getElementById("root");
  const episodeCards = rootElem.querySelectorAll('.episode-card');
  episodeCards.forEach(card => {
    if (card.textContent.toLowerCase().includes(keyword)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Function to populate dropdown menu
function populateDropdown(element, options, type) {
  options.sort((a, b) => a.name.localeCompare(b.name));
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.id;
    if (type === 'name') {
      optionElement.textContent = option.name;
    } else if (type === 'episodeNumber') {
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
