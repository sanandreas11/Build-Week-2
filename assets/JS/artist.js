document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const artistId = params.get("artistId");

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
  const nameArtist = document.querySelector("#player-info small");
  const customPlayerImg = document.querySelector("#custom-player img");
  const mobileplayerName = document.getElementById("songMobile");

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
      nameArtist.textContent = data.name;
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

  // Funzione per formattare la durata in minuti:secondi
  function formatDuration(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }

  // Render track list
  function renderTrackList() {
    topTracksList.innerHTML = "";

    trackQueue.forEach((track, index) => {
      const listItem = document.createElement("li");
      listItem.className =
        "list-group-item bg-dark text-white border-secondary ";
      const albumImage = track.album ? track.album.cover_small : "";

      listItem.innerHTML = `
      <div class="row align-items-center">
        <div class="col-4 col-md-2 d-flex justify-content-center">
          ${
            albumImage
              ? `<img src="${albumImage}" alt="Album Image" class="img-fluid">`
              : ""
          }
        </div>
        <div class="col-6 col-md-4 d-flex flex-column gap-2">
          <span class="track-title">${track.title}</span>
          <span class="track-artist">${track.artist.name}</span>  
        </div>
        <div class="col-2 text-light d-flex justify-content-end d-md-none">
          <span <i class="bi bi-three-dots-vertical fs-5"></i></span>
        </div>
        <div class="col-3 d-flex justify-content-end">
          <span class="track-rank">${track.rank}</span>
        </div>
        <div class="col-3 d-flex justify-content-end">
          <span class="track-duration">${formatDuration(track.duration)}</span>
        </div>
      </div>
    `;

      topTracksList.appendChild(listItem);

      // Aggiungi un evento di click per ogni traccia
      listItem.addEventListener("click", () => playTrack(index));
    });
  }

  // Funzione per riprodurre il brano e evidenziarlo nella lista
  function playTrack(index) {
    if (index >= 0 && index < trackQueue.length) {
      currentTrackIndex = index;
      const track = trackQueue[index];

      // Verifica se l'anteprima del brano è disponibile
      if (track.preview) {
        audio.src = track.preview;
        audio.play();
        isPlaying = true;

        // Cambia l'icona di play/pause
        document.getElementById(
          "play-pause"
        ).innerHTML = `<i class="bi bi-pause-fill fs-2  "></i>`;
        document.getElementById(
          "play-pause-mobile"
        ).innerHTML = `<i class="bi bi-pause-fill fs-2  "></i>`;

        // Aggiorna il titolo del brano nel player
        document.getElementById("track-title").textContent = track.title;

        // Aggiorna il titolo del brano nel player specifico
        document.getElementById("track-title-player").textContent = track.title; // Nuova riga per aggiornare il titolo nel player
        mobileplayerName.textContent = track.title;

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

        // Gestione dell'immagine dell'album
        if (track.album && track.album.cover_big) {
          customPlayerImg.src = track.album.cover_big;
        } else {
          customPlayerImg.src = "./assets/imgs/main/image-3.jpg"; // Immagine di default
        }
      } else {
        console.error("Anteprima del brano non disponibile");
      }
    }
  }

  // Progress-bar player musicale
  audio.addEventListener("timeupdate", () => {
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    const progressBar = document.getElementById("pb");

    if (!isNaN(duration)) {
      // Aggiorna la barra di progresso
      progressBar.style.width = `${(currentTime / duration) * 100}%`;

      // Aggiorna i tempi
      document.getElementById("prog").textContent = formatTime(currentTime);
      document.getElementById("dur").textContent = formatTime(duration);
    }
  });

  // Formatta minuti e secondi
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  // Play/Pause toggle
  document.getElementById("play-pause").addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      document.getElementById(
        "play-pause"
      ).innerHTML = `<i class="bi bi-play-circle-fill fs-2 "></i>`;
    } else {
      audio.play();
      document.getElementById(
        "play-pause"
      ).innerHTML = `<i class="bi bi-pause-fill fs-2  "></i>`;
    }
    isPlaying = !isPlaying;
  });

  // Play/Pause toggle-mobile
  document.getElementById("play-pause-mobile").addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      document.getElementById(
        "play-pause-mobile"
      ).innerHTML = `<i class="bi bi-play-circle-fill fs-2 "></i>`;
    } else {
      audio.play();
      document.getElementById(
        "play-pause-mobile"
      ).innerHTML = `<i class="bi bi-pause-fill fs-2  "></i>`;
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

fetch("https://striveschool-api.herokuapp.com/api/deezer/search?q=pop")
  .then((response) => response.json())
  .then((data) => {
    const artistList = document.getElementById("artist-list");
    const artists = data.data.slice(0, 6); // Prende i primi 6 risultati

    artists.forEach((artist) => {
      const artistElement = document.createElement("div");
      artistElement.classList.add("artist");
      artistElement.innerHTML = `
          <img src="${artist.album.cover_small}" alt="${artist.artist.name}">
          <span>${artist.artist.name}</span>
      `;
      artistList.appendChild(artistElement);
    });
  })
  .catch((error) => console.error("Errore:", error));

//Naviga verso una pagina
document.getElementById("view-more").addEventListener("click", function () {
  window.location.href = "artist.html?artistId=17#";
});
