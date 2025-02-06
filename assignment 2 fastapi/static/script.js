const inputElement = document.getElementById("search-container")
const searchInput = document.getElementById("search-bar")
const artistContainer = document.getElementById("artist-container")

window.addEventListener("click", (e) => {
    if (inputElement.contains(e.target)) {
        inputElement.classList.add('search-container-active');
    } else {
        inputElement.classList.remove('search-container-active');
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

    card.appendChild(imageContainer);
    card.appendChild(name);

    return card;
}

async function search(e) {
    e.preventDefault()
    try {
        if (searchInput.value === "") {
            console.log("Please enter a valid search");
            return;
        }

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
            name.textContent = "No results found.";
            artistContainer.appendChild(name);
            return;
        }

        data.forEach(artist => {
            const card = createArtistCard(artist);
            artistContainer.appendChild(card);
        })

        console.log(data);
    } catch(error) {
        console.error('Error while searching artist:', error);
    }
}