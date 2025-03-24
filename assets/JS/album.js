const URLparameters = new URLSearchParams(location.search)
const albumId = URLparameters.get("id")
const albumUrl = `https://striveschool-api.herokuapp.com/api/deezer/album/39949511`

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
      const albumCover = document.getElementById("album-cover")
      const artistCover = document.getElementById("artist-img-sm")
      const albumName = document.getElementById("album-name")
      const artistName = document.getElementById("artist-name")
      const releaseYear = document.getElementById("release-year")
      albumCover.setAttribute("src", data.cover) //Funziona
      artistCover.setAttribute("src", data.artist.picture_small)
      albumName.innerText = data.title //funziona
      albumName.setAttribute("href", "./artist.html?id=" + data.artist.id)
      artistName.innerText = data.artist.name //funziona
      releaseYear.innerText = data.release_date.slice(0, 4) //funziona
      console.log(data.tracks)
    })
    .catch((err) => {
      console.log("ERRORE NEL RECUPERO DATI CONCERTO", err)
    })
}
// LE CANZONI SI TROVANO DENTRO UN ARRAY DI NOME DATA CHE BISOGNA FAR CICLARE PER DISPORRE LE CANZONI DINAMICAMENTE
const getSongsFromAlbum = function () {
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
      data.forEach((tracks) => {
        const tracklist = document.getElementById("tracklist")
        tracklist.innerHTML = `<div>
         <p id="track" class="text-light ms-2">${tracks.title}</p>
         <p id="artist" class="text-light ms2">${tracks.artist.name}</p>   
        </div>`
      })
    })
    .catch((err) => {
      console.log("ERRORE NEL RECUPERO DATI CONCERTO", err)
    })
}

getAlbumDetails()
getSongsFromAlbum()
