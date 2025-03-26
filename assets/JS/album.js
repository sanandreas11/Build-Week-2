const URLparameters = new URLSearchParams(location.search)
const albumId = URLparameters.get("albumId")
const albumUrl = `https://striveschool-api.herokuapp.com/api/deezer/album/`

let trackQueue = []
let currentTrackIndex = 0
let audio = new Audio()
let isPlaying = false

const getAlbumDetails = function () {
  fetch(albumUrl + albumId)
    .then((response) => {
      console.log("response", response)
      if (response.ok) {
        return response.json()
      } else {
        throw new Error("Errore nel recupero dei dettagli")
      }
    })
    .then((data) => {
      console.log("DETTAGLI ALBUM", data)
      trackQueue = data.tracks.data
      const albumCover = document.getElementById("album-cover")
      const artistCover = document.getElementById("artist-img-sm")
      const albumName = document.getElementById("album-name")
      const artistName = document.getElementById("artist-name")
      const releaseYear = document.getElementById("release-year")
      albumCover.setAttribute("src", data.cover) //Funziona
      artistCover.setAttribute("src", data.artist.picture_small)
      albumName.innerText = data.title //funziona
      artistName.innerText = data.artist.name //funziona
      artistName.setAttribute(
        "href",
        "./artist.html?artistId=" + data.artist.id
      )
      releaseYear.innerText = " " + data.release_date.slice(0, 4) //funziona
      console.log(data.tracks.data)
      console.log(data)
      const tracklist = document.getElementById("tracklist")
      tracklist.innerHTML = "" // 🔹 Svuota prima di aggiungere nuovi elementi

      data.tracks.data.forEach((track, i) => {
        const trackItem = document.createElement("div")
        trackItem.classList.add("songs")
        trackItem.innerHTML = `<p class="text-light ms-2">${track.title}</p>   
          <p class="text-secondary ms-2 mb-5">${track.artist.name}</p>`
        trackItem.addEventListener("click", () => playTrack(i))
        tracklist.appendChild(trackItem)
      })
    })
    .catch((err) => {
      console.log("ERRORE NEL RECUPERO DATI ALBUM", err)
    })
}

// Funzione per riprodurre il brano e evidenziarlo nella lista
function playTrack(index) {
  if (index >= 0 && index < trackQueue.length) {
    currentTrackIndex = index
    const track = trackQueue[index]

    // Imposta la sorgente del player audio e avvia la riproduzione
    audio.src = track.preview
    audio.play()
    isPlaying = true

    // Cambia l'icona di play/pause
    document.getElementById(
      "play-pause"
    ).innerHTML = `<i class="bi bi-pause-fill"></i>`

    // Aggiorna il titolo del brano nel player
    document.getElementById("track-title").textContent = track.title

    // Aggiorna il titolo del brano nel player specifico
    document.getElementById("track-title-player").textContent = track.title // Nuova riga per aggiornare il titolo nel player

    // Rimuovi la classe 'active' da tutti gli elementi della lista
    document.querySelectorAll(".list-group-item").forEach((item) => {
      item.classList.remove("active")
    })

    // Aggiungi la classe 'active' al brano selezionato
    topTracksList.children[index].classList.add("active")

    // Passa alla traccia successiva quando il brano finisce
    audio.addEventListener("ended", () => {
      if (currentTrackIndex < trackQueue.length - 1) {
        playTrack(currentTrackIndex + 1)
      }
    })
  }
}

// Play/Pause toggle
document.getElementById("play-pause").addEventListener("click", () => {
  if (isPlaying) {
    audio.pause()
    document.getElementById(
      "play-pause"
    ).innerHTML = `<i class="bi bi-play-fill"></i>`
  } else {
    audio.play()
    document.getElementById(
      "play-pause"
    ).innerHTML = `<i class="bi bi-pause-fill"></i>`
  }
  isPlaying = !isPlaying
})

// Next track
document.getElementById("next").addEventListener("click", () => {
  if (currentTrackIndex < trackQueue.length - 1) {
    playTrack(currentTrackIndex + 1)
  }
})

// Previous track
document.getElementById("prev").addEventListener("click", () => {
  if (currentTrackIndex > 0) {
    playTrack(currentTrackIndex - 1)
  }
})

// Shuffle functionality
document.getElementById("random-icon").addEventListener("click", () => {
  trackQueue = shuffleArray(trackQueue)
  getAlbumDetails()
  const randomIndex = Math.floor(Math.random() * trackQueue.length)
  playTrack(randomIndex)
})

// Shuffle function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
getAlbumDetails()
