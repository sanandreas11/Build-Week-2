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
  const audioPlayer = document.getElementById("audio-player");
  const loading = document.getElementById("loading");

  let trackQueue = [];
  let currentTrackIndex = 0;

  loading.style.display = "block";

  function hideLoader() {
    loading.style.display = "none";
    document.querySelector(".container-fluid").style.opacity = 1; // Forza il layout a ricalcolarsi
  }

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

  fetch(topTracksUrl)
    .then((response) =>
      response.ok
        ? response.json()
        : Promise.reject("Errore nell'API per i brani")
    )
    .then((data) => {
      topTracksList.innerHTML = "";
      trackQueue = data.data;

      data.data.forEach((track, index) => {
        const listItem = document.createElement("li");
        listItem.className =
          "list-group-item bg-dark text-white border-secondary";
        const rank = track.rank || "";

        // Aggiungi l'immagine dell'album
        const albumImage = track.album ? track.album.cover_small : ""; // Controlla se esiste un album e prendi l'immagine

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
              <div class="col-2 d-none d-md-block text-center">
                <span class="rank">${rank}</span>
              </div>
              <div class="col-2 d-none d-md-block text-center">
                <span class="duration">${Math.floor(track.duration / 60)}:${(
          track.duration % 60
        )
          .toString()
          .padStart(2, "0")}</span>
              </div>
            </div>
          `;

        listItem.addEventListener("click", () => playTrack(index));
        topTracksList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Errore nel recupero dei top brani:", error);
    });

  function playTrack(index) {
    if (index >= 0 && index < trackQueue.length) {
      currentTrackIndex = index;
      audioPlayer.src = trackQueue[index].preview;
      audioPlayer.play();

      // Aggiorna il titolo del brano nell'elemento <h2>
      const trackTitle = trackQueue[index].title;
      document.getElementById("track-title").textContent = trackTitle; // Imposta il titolo

      // Rimuovi la classe 'active' da tutti gli elementi della lista
      document.querySelectorAll(".list-group-item").forEach((item) => {
        item.classList.remove("active");
      });

      // Aggiungi la classe 'active' al brano selezionato
      topTracksList.children[index].classList.add("active");
    }
  }

  audioPlayer.addEventListener("ended", () => {
    if (currentTrackIndex < trackQueue.length - 1) {
      playTrack(currentTrackIndex + 1);
    }
  });

  artistLink.addEventListener("click", (event) => {
    if (trackQueue.length > 0) {
      event.preventDefault();
      playTrack(0);
    }
  });

  // Funzione per riprodurre i brani in ordine casuale
  document.getElementById("random-icon").addEventListener("click", () => {
    trackQueue = shuffleArray(trackQueue); // Mescola la coda dei brani
    playTrack(0); // Inizia la riproduzione dal primo brano della coda mescolata
  });

  // Funzione per mescolare l'array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Scambia gli elementi
    }
    return array;
  }
});
