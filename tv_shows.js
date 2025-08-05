let showsContainer = document.getElementById("tv_show_catalog");
let episodesContainer = document.getElementById("details");
let searchField = document.getElementById("search_bar");

searchField.addEventListener('keypress', function(event){
    if (event.key === 'Enter') {
        event.preventDefault();
        const showName = searchField.value.trim().toLowerCase().replace(/ /g, "%20");
        if (showName) findShow(showName);
    }
});

function findShow(show) {
    fetch(`https://api.tvmaze.com/singlesearch/shows?q=${show}&embed=episodes`)
        .then(res => res.json())
        .then(showData => {
            showsContainer.style.display = 'block';
            episodesContainer.innerHTML = "";

            // Set title and image
            document.getElementById("show_name").textContent = showData.name;
            document.getElementById("show_image").src = showData.image.original;

            const showInfo = document.getElementById("show_info");
            if (showInfo) {
                showInfo.innerHTML = `
                    <p><strong>Genres:</strong> ${showData.genres.join(", ")}</p>
                    <p><strong>Language:</strong> ${showData.language}</p>
                    <p><strong>Rating:</strong> ${showData.rating.average ?? "N/A"}</p>
                    <p><strong>Premiered:</strong> ${showData.premiered}</p>
                    <p><strong>Status:</strong> ${showData.status}</p>
                    <p><strong>Summary:</strong><br> ${showData.summary.replace(/<[^>]+>/g, "")}</p>
                `;
            }

            const episodes = showData._embedded.episodes;
            const showImage = showData.image?.original;

            const episodesHeader = document.createElement('h4');
            episodesHeader.textContent = "Episodes";
            episodesContainer.appendChild(episodesHeader);

            for (let i = 0; i < episodes.length; i += 4) {
                const row = document.createElement("div");
                row.className = "row";

                for (let j = i; j < i + 4 && j < episodes.length; j++) {
                    const episode = episodes[j];

                    const col = document.createElement("div");
                    col.className = "col s12 m6 l3";

                    const card = document.createElement("div");
                    card.className = "card hoverable";

                    const cardImage = document.createElement("div");
                    cardImage.className = "card-image";

                    const img = document.createElement("img");
                    img.src = episode.image?.original || showImage || "https://via.placeholder.com/300x200?text=No+Image";

                    const seasonText = document.createElement("span");
                    seasonText.className = "card-title season-info";
                    seasonText.textContent = `Season ${episode.season}`;

                    const cardContent = document.createElement("div");
                    cardContent.className = "card-content";

                    const episodeTitle = document.createElement("p");
                    episodeTitle.className = "episode-title";
                    episodeTitle.textContent = episode.name;

                    cardImage.appendChild(img);
                    cardImage.appendChild(seasonText);
                    cardContent.appendChild(episodeTitle);
                    card.appendChild(cardImage);
                    card.appendChild(cardContent);
                    col.appendChild(card);
                    row.appendChild(col);

                    card.addEventListener("click", () => {
                        window.open(episode.url, "_blank");
                    });
                }

                episodesContainer.appendChild(row);
            }
        })
        .catch(err => {
            episodesContainer.innerHTML = "<p>Show not found. Please try again.</p>";
            console.error("Fetch error:", err);
        });
}

