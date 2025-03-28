const URLparameters = new URLSearchParams(location.search)
const albumId = URLparameters.get("albumId")
const albumUrl = `https://striveschool-api.herokuapp.com/api/deezer/album/`

let trackQueue = []
let currentTrackIndex = 0
let audio = new Audio()
let isPlaying = false
const artistLink = document.getElementById("artist-link")

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
      // let sum = 0
      // for (let i = 0; i < data.tracks.data.length; i++) {
      //   sum + data.tracks.data.duration
      //   return sum
      // }
      albumCover.setAttribute("src", data.cover_medium) //Funziona
      artistCover.setAttribute("src", data.artist.picture_small)
      albumName.innerText = data.title //funziona
      artistName.innerHTML = `<a class='text-decoration-none text-light d-flex' href='./artist.html?artistId=${
        data.artist.id
      }'>
      ${data.artist.name}
      <span class="d-none d-lg-block">· ${data.release_date.slice(0, 4)} · ${
        data.tracks.data.length
      } brani · </span></a>`
      releaseYear.innerText = " " + data.release_date.slice(0, 4) //funziona
      console.log(data.tracks.data)
      console.log(data)
      const tracklist = document.getElementById("tracklist")
      tracklist.innerHTML = ""

      data.tracks.data.forEach((track, i) => {
        const trackItem = document.createElement("div")
        trackItem.classList.add("songs")
        trackItem.innerHTML = `<p class="d-flex justify-content-between text-light ms-2">${
          track.title
        }<span class='text-secondary'>${formatDuration(
          track.duration
        )}</span></p>   
          <p class="text-secondary ms-2 mb-5">${track.artist.name}</p>`
        trackItem.addEventListener("click", () => playTrack(i))
        tracklist.appendChild(trackItem)
      })
    })
    .catch((err) => {
      console.log("ERRORE NEL RECUPERO DATI ALBUM", err)
    })
}

function formatDuration(duration) {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`
}

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
    document.getElementById("track-title-player").textContent = track.title

    // Aggiorna il titolo del brano nel player specifico
    document.getElementById("track-title-player").textContent = track.title // Nuova riga per aggiornare il titolo nel player

    // Rimuovi la classe 'active' da tutti gli elementi della lista
    document.querySelectorAll(".list-group-item").forEach((item) => {
      item.classList.remove("active")
    })

    // Aggiungi la classe 'active' al brano selezionato
    document.getElementById("tracklist").children[index].classList.add("active")
  }
}
// Passa alla traccia successiva quando il brano finisce
audio.addEventListener("ended", () => {
  if (currentTrackIndex < trackQueue.length - 1) {
    playTrack(currentTrackIndex + 1)
  }
})

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
  renderTrackList()
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

// Handle artist link click to start playing first track
artistLink.addEventListener("click", (event) => {
  if (trackQueue.length > 0) {
    event.preventDefault()
    playTrack(0)
  }
})

if (!albumId) {
  console.error("Album ID is missing from URL.")
} else {
  getAlbumDetails()
}
