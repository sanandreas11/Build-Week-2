document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const artistId = params.get("id");

  if (!artistId) {
    console.error("Nessun ID artista trovato nell'URL");
    return;
  }

  const apiUrl = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}`;
  const topTracksUrl = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=5`;

  // Elementi DOM
  const artistName = document.getElementById("artist-name");
  const artistImage = document.getElementById("artist-image");
  const artistFans = document.getElementById("artist-fans");
  const artistLink = document.getElementById("artist-link");
  const topTracksList = document.getElementById("top-tracks");
  const audioPlayer = document.getElementById("audio-player");

  let trackQueue = []; // Lista delle tracce in ordine
  let currentTrackIndex = 0;

  // Fetch info artista
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      artistName.textContent = data.name;
      artistImage.src = data.picture_big;
      artistFans.textContent = data.nb_fan.toLocaleString();
      artistLink.href = data.link;
    })
    .catch((error) =>
      console.error("Errore nel recupero dati artista:", error)
    );

  // Fetch top brani
  fetch(topTracksUrl)
    .then((response) => response.json())
    .then((data) => {
      topTracksList.innerHTML = "";
      trackQueue = data.data;

      data.data.forEach((track, index) => {
        const listItem = document.createElement("li");
        listItem.className =
          "list-group-item bg-dark text-white border-secondary";
        listItem.innerHTML = `
              <div class="d-flex justify-content-between">
                <span>${track.title}</span>
                <span>${Math.floor(track.duration / 60)}:${(track.duration % 60)
          .toString()
          .padStart(2, "0")}</span>
              </div>
            `;
        listItem.addEventListener("click", () => playTrack(index));
        topTracksList.appendChild(listItem);
      });
    })
    .catch((error) =>
      console.error("Errore nel recupero dei top brani:", error)
    );

  // Funzione per riprodurre una traccia dalla lista
  function playTrack(index) {
    if (index >= 0 && index < trackQueue.length) {
      currentTrackIndex = index;
      audioPlayer.src = trackQueue[index].preview;
      audioPlayer.play();
    }
  }

  // Quando il brano finisce, riproduce quello successivo
  audioPlayer.addEventListener("ended", () => {
    if (currentTrackIndex < trackQueue.length - 1) {
      playTrack(currentTrackIndex + 1);
    }
  });

  // Quando si clicca su "Ascolta su Deezer", inizia la playlist invece di aprire il sito
  artistLink.addEventListener("click", (event) => {
    event.preventDefault();
    if (trackQueue.length > 0) {
      playTrack(0);
    }
  });
});
