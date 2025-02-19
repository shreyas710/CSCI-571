const inputElement = document.getElementById("search-container")
const searchInput = document.getElementById("search-bar")
const artistContainer = document.getElementById("artist-container")
const artistDescriptionContainer = document.getElementById("artist-description-container")
const allCards = document.getElementsByClassName("artist-card");

window.addEventListener("click", (e) => {
    if (inputElement.contains(e.target)) {
        inputElement.classList.add('search-container-active');
    } else {
        inputElement.classList.remove('search-container-active');
    }
})

artistContainer.addEventListener("click", async (e) => {
    const card = e.target.closest(".artist-card");
    for (let i = 0; i < allCards.length; i++) {
        const currentCard = allCards[i];
        currentCard.style.backgroundColor = "rgb(35, 67, 98)";
    }
    if (card) {
        card.style.backgroundColor = "rgb(27, 38, 48)";
        const artistId = card.querySelector('.artist-id').textContent;
        await getArtist(artistId);
    }
})

function clearSearch() {
    searchInput.value = "";
    artistContainer.innerHTML = "";
    artistDescriptionContainer.innerHTML = "";
    searchInput.focus();
}

searchInput.addEventListener("keyup", async (e) => {
    if (e.key === "Enter") {
        await search(e);
    }
});

getArtsyToken()
    .then(data => {
        console.log('Token received:', data);
    })
    .catch(err => {
        console.error('Error getting token:', err);
    });

setInterval(getArtsyToken, 600000)

async function getArtsyToken() {
    try {
        const response = await fetch(`https://shreyas710-csci571-assignment2.wl.r.appspot.com/get_artsy_token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error in get_artsy_token:', error);
    }
}

function createArtistCard(artist) {
    const card = document.createElement('div');
    card.className = 'artist-card';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'artist-image-container';

    if (!artist["_links"]["thumbnail"]["href"].includes("missing_image")) {
        const img = document.createElement('img');
        img.src = artist["_links"]["thumbnail"]["href"];
        img.alt = artist["title"];
        img.className = 'artist-image';
        imageContainer.appendChild(img);
    } else {
        const img = document.createElement('img');
        img.src = "images/artsy_logo.svg";
        img.alt = artist["title"];
        img.className = 'artist-image';
        imageContainer.appendChild(img);
    }

    const name = document.createElement('div');
    name.className = 'artist-name';
    name.textContent = artist["title"];

    const artistId = document.createElement('div')
    artistId.className = 'artist-id'
    artistId.textContent = artist["_links"]["self"]["href"].split('/').pop();

    card.appendChild(imageContainer);
    card.appendChild(name);
    card.appendChild(artistId);

    return card;
}

function showLoading(containerElement) {
    containerElement.innerHTML = '';
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-container';

    const loadingGif = document.createElement('img');
    loadingGif.src = 'images/loading.gif';
    loadingGif.alt = 'Loading...';
    loadingGif.className = 'loading-gif';

    loadingDiv.appendChild(loadingGif);
    containerElement.appendChild(loadingDiv);
}

async function search(e) {
    e.preventDefault()
    artistDescriptionContainer.innerHTML = '';
    try {
        if (!searchInput.value.trim()) {
            searchInput.reportValidity();
            return;
        }

        if (artistContainer.innerHTML !== '') {
            showLoading(artistDescriptionContainer);
        } else {
            showLoading(artistContainer);
        }

        const searchResponse = await fetch(`https://shreyas710-csci571-assignment2.wl.r.appspot.com/search_artist/` + searchInput.value, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!searchResponse.ok) {
            console.error(`HTTP error! status: ${searchResponse.status}`);
        }
        const data = await searchResponse.json();
        artistDescriptionContainer.innerHTML = '';
        artistContainer.innerHTML = '';
        if (data.length === 0) {
            const name = document.createElement("div")
            name.className = 'no-results'
            name.textContent = "No results found.";
            artistContainer.appendChild(name);
            return;
        }

        data.forEach(artist => {
            const card = createArtistCard(artist);
            artistContainer.appendChild(card);
        })
    } catch(error) {
        console.error('Error while searching artist:', error);
    }
}

function showArtistCard(artist) {
    const card = document.createElement('div');
    card.className = 'artist-description-card';
    const name = document.createElement('div');
    name.className = 'artist-description-name';
    name.textContent = artist["name"] + " (" + artist["birthday"] + " - " + artist["deathday"] + ")";
    const location = document.createElement('div');
    location.className = 'artist-description-location';
    location.textContent = artist["nationality"];
    const biography = document.createElement('div');
    biography.className = 'artist-description-biography';
    biography.textContent = artist["biography"];
    card.appendChild(name);
    card.appendChild(location);
    card.appendChild(biography);
    return card;
}

async function getArtist(artistId) {
    try {
        if (!artistId) {
            return;
        }

        showLoading(artistDescriptionContainer);

        const artistResponse = await fetch(`https://shreyas710-csci571-assignment2.wl.r.appspot.com/get_artist/${artistId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!artistResponse.ok) {
            console.error(`HTTP error! status: ${artistResponse.status}`);
        }
        const data = await artistResponse.json();
        artistDescriptionContainer.innerHTML = '';

        if (data === null || data === undefined) {
            const name = document.createElement("div")
            name.className = 'no-results'
            name.textContent = "No results found.";
            artistDescriptionContainer.appendChild(name);
            return;
        }
        const card = showArtistCard(data);
        artistDescriptionContainer.appendChild(card);
    } catch (error) {
        console.error('Error while fetching artist:', error);
    }
}