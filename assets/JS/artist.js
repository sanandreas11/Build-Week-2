document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const artistId = params.get("id");

  if (!artistId) {
    console.error("Nessun ID artista trovato nell'URL");
    return;
  }

  const apiUrl = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}`;
  const topTracksUrl = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=5`;

  const artistName = document.getElementById("artist-name");
  const artistImage = document.getElementById("artist-image");
  const artistFans = document.getElementById("artist-fans");
  const artistLink = document.getElementById("artist-link");
  const topTracksList = document.getElementById("top-tracks");
  const loading = document.getElementById("loading");

  let trackQueue = [];
  let currentTrackIndex = 0;
  let audio = new Audio();
  let isPlaying = false;

  loading.style.display = "block";

  function hideLoader() {
    loading.style.display = "none";
    document.querySelector(".container-fluid").style.opacity = 1;
  }

  // Fetch artist data
  fetch(apiUrl)
    .then((response) =>
      response.ok ? response.json() : Promise.reject("Errore nell'API")
    )
    .then((data) => {
      hideLoader();
      artistName.textContent = data.name;
      artistImage.src = data.picture_big;
      artistFans.textContent = data.nb_fan.toLocaleString();
      artistLink.href = data.link;
    })
    .catch((error) => {
      hideLoader();
      console.error("Errore nel recupero dati artista:", error);
      loading.textContent = "Errore nel caricamento dei dati dell'artista";
    });

  // Fetch top tracks
  fetch(topTracksUrl)
    .then((response) =>
      response.ok
        ? response.json()
        : Promise.reject("Errore nell'API per i brani")
    )
    .then((data) => {
      trackQueue = data.data;
      renderTrackList();
    })
    .catch((error) => {
      console.error("Errore nel recupero dei top brani:", error);
    });

  // Render track list
  function renderTrackList() {
    topTracksList.innerHTML = "";

    trackQueue.forEach((track, index) => {
      const listItem = document.createElement("li");
      listItem.className =
        "list-group-item bg-dark text-white border-secondary";
      const albumImage = track.album ? track.album.cover_small : "";
      listItem.innerHTML = `
        <div class="row align-items-center">
          <div class="col-2 d-flex justify-content-center">
            ${
              albumImage
                ? `<img src="${albumImage}" alt="Album Image" class="img-fluid">`
                : ""
            }
          </div>
          <div class="col-6 d-flex flex-column gap-2">
            <span class="track-title">${track.title}</span>
            <span class="track-artist">${track.artist.name}</span>
          </div>
        </div>
      `;
      listItem.addEventListener("click", () => playTrack(index));
      topTracksList.appendChild(listItem);
    });
  }

  // Funzione per riprodurre il brano e evidenziarlo nella lista
  function playTrack(index) {
    if (index >= 0 && index < trackQueue.length) {
      currentTrackIndex = index;
      const track = trackQueue[index];

      // Imposta la sorgente del player audio e avvia la riproduzione
      audio.src = track.preview;
      audio.play();
      isPlaying = true;

      // Cambia l'icona di play/pause
      document.getElementById(
        "play-pause"
      ).innerHTML = `<i class="bi bi-pause-fill"></i>`;

      // Aggiorna il titolo del brano nel player
      document.getElementById("track-title").textContent = track.title;

      // Aggiorna il titolo del brano nel player specifico
      document.getElementById("track-title-player").textContent = track.title; // Nuova riga per aggiornare il titolo nel player

      // Rimuovi la classe 'active' da tutti gli elementi della lista
      document.querySelectorAll(".list-group-item").forEach((item) => {
        item.classList.remove("active");
      });

      // Aggiungi la classe 'active' al brano selezionato
      topTracksList.children[index].classList.add("active");

      // Passa alla traccia successiva quando il brano finisce
      audio.addEventListener("ended", () => {
        if (currentTrackIndex < trackQueue.length - 1) {
          playTrack(currentTrackIndex + 1);
        }
      });
    }
  }

  // Play/Pause toggle
  document.getElementById("play-pause").addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      document.getElementById(
        "play-pause"
      ).innerHTML = `<i class="bi bi-play-fill"></i>`;
    } else {
      audio.play();
      document.getElementById(
        "play-pause"
      ).innerHTML = `<i class="bi bi-pause-fill"></i>`;
    }
    isPlaying = !isPlaying;
  });

  // Next track
  document.getElementById("next").addEventListener("click", () => {
    if (currentTrackIndex < trackQueue.length - 1) {
      playTrack(currentTrackIndex + 1);
    }
  });

  // Previous track
  document.getElementById("prev").addEventListener("click", () => {
    if (currentTrackIndex > 0) {
      playTrack(currentTrackIndex - 1);
    }
  });

  // Shuffle functionality
  document.getElementById("random-icon").addEventListener("click", () => {
    trackQueue = shuffleArray(trackQueue);
    renderTrackList();
    const randomIndex = Math.floor(Math.random() * trackQueue.length);
    playTrack(randomIndex);
  });

  // Shuffle function
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Handle artist link click to start playing first track
  artistLink.addEventListener("click", (event) => {
    if (trackQueue.length > 0) {
      event.preventDefault();
      playTrack(0);
    }
  });
});
