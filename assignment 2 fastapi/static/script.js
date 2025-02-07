const inputElement = document.getElementById("search-container")
const searchInput = document.getElementById("search-bar")
const artistContainer = document.getElementById("artist-container")
const artistDescriptionContainer = document.getElementById("artist-description-container")

window.addEventListener("click", (e) => {
    if (inputElement.contains(e.target)) {
        inputElement.classList.add('search-container-active');
    } else {
        inputElement.classList.remove('search-container-active');
    }
})

artistContainer.addEventListener("click", async (e) => {
    const card = e.target.closest(".artist-card");
    if (card) {
        const artistId = card.querySelector('.artist-id').textContent;
        await getArtist(artistId);
    }
})

function clearSearch() {
    searchInput.value = "";
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
        const response = await fetch(`http://localhost:8000/get_artsy_token`, {
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
    try {
        if (!searchInput.value.trim()) {
            searchInput.reportValidity();
            return;
        }

        showLoading(artistContainer);

        const searchResponse = await fetch(`http://localhost:8000/search_artist/` + searchInput.value, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!searchResponse.ok) {
            console.error(`HTTP error! status: ${searchResponse.status}`);
        }
        const data = await searchResponse.json();
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
    const name = document.createElement('div');
    name.className = 'artist-description-name';
    name.textContent = artist["name"] + " (" + artist["birthday"] + " - " + artist["deathday"] + ")";
    return name;
}

async function getArtist(artistId) {
    try {
        if (!artistId) {
            return;
        }

        showLoading(artistDescriptionContainer);

        const artistResponse = await fetch(`http://localhost:8000/get_artist/${artistId}`, {
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