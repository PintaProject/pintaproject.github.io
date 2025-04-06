let player;
let youtubeApiLoaded = false;
let activeListItem = null; // Store the currently highlighted <li> element

function loadYouTubeAPI(callback) {
    if (!youtubeApiLoaded) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.onload = callback;
        document.head.appendChild(tag);
        youtubeApiLoaded = true;
    } else if (typeof YT !== "undefined" && YT.Player) {
        callback();
    }
}

function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url;
}

function highlightCurrentVideo(videoId) {
    // Reset the previous active item's border
    if (activeListItem) {
        activeListItem.style.borderColor = ""; // Reset to default
    }

    // Find and highlight the <li> containing the button with matching data-source
    document.querySelectorAll(".pinta-tutorial-list li").forEach(li => {
        const button = li.querySelector("button[data-source]");
        if (button) {
            const buttonVideoId = extractVideoId(button.getAttribute("data-source"));
            if (buttonVideoId === videoId) {
                li.style.borderColor = "var(--pinta-orange)";
                activeListItem = li;
            }
        }
    });
}

function resetVideoHighlight() {
    if (activeListItem) {
        activeListItem.style.borderColor = ""; // Reset border when video is unloaded
        activeListItem = null;
    }
}

function createYouTubePlayer(videoId) {
    if (!player) {
        player = new YT.Player('player', {
            videoId: videoId,
            playerVars: { autoplay: 1, modestbranding: 1 },
            events: {
                'onReady': function (event) {
                    event.target.playVideo(); // Force autoplay on first load
                    highlightCurrentVideo(videoId); // Highlight correct <li>
                },
                'onStateChange': function (event) {
                    if (event.data === YT.PlayerState.PLAYING) {
                        highlightCurrentVideo(videoId);
                    }
                }
            }
        });
    } else {
        player.loadVideoById(videoId);
        setTimeout(() => player.playVideo(), 200); // Small delay ensures playback
        highlightCurrentVideo(videoId); // Highlight immediately on new selection
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".pinta-tutorial-list button").forEach(button => {
        button.addEventListener("click", function () {
            const rawSource = this.getAttribute("data-source");
            const videoId = extractVideoId(rawSource);

            loadYouTubeAPI(() => {
                if (typeof YT !== "undefined" && YT.Player) {
                    createYouTubePlayer(videoId);
                }
            });
        });
    });

    // Play video when clicking on #player (if it has a data-source)
    const playerElement = document.getElementById("player");
    playerElement.addEventListener("click", function () {
        const rawSource = playerElement.getAttribute("data-source");
        if (rawSource) {
            const videoId = extractVideoId(rawSource);

            loadYouTubeAPI(() => {
                if (typeof YT !== "undefined" && YT.Player) {
                    createYouTubePlayer(videoId);
                    highlightCurrentVideo(videoId); // Ensure highlighting works on click
                }
            });
        }
    });

    // Load More functionality
    const tutorialList = document.querySelector(".pinta-tutorial-list");
    const items = tutorialList.querySelectorAll("li");
    const maxVisible = 10;
    let currentVisible = maxVisible;

    if (items.length > maxVisible) {
        items.forEach((item, index) => {
            if (index >= maxVisible) {
                item.style.display = "none";
            }
        });

        const loadMoreBtn = document.createElement("button");
        loadMoreBtn.textContent = "Load More";
        loadMoreBtn.classList.add("pinta-button", "pinta-load-more-button");

        tutorialList.parentNode.appendChild(loadMoreBtn);

        loadMoreBtn.addEventListener("click", function () {
            const nextVisible = currentVisible + maxVisible;
            items.forEach((item, index) => {
                if (index < nextVisible) {
                    item.style.display = "";
                }
            });
            currentVisible = nextVisible;
            if (currentVisible >= items.length) {
                loadMoreBtn.style.display = "none";
            }
        });
    }
});
