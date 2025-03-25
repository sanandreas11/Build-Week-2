const URLparameters = new URLSearchParams(location.search)
const albumId = URLparameters.get("id")
const albumUrl = `https://striveschool-api.herokuapp.com/api/deezer/album/`

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
      releaseYear.innerText = " " + data.release_date.slice(0, 4) //funziona
      console.log(data.tracks.data)
      console.log(data)
      for (let i = 0; i < data.tracks.data.length; i++) {
        const tracklist = document.getElementById("tracklist")
        tracklist.innerHTML += ` <div>
         <p id="track" class="text-light ms-2">${data.tracks.data[i].title}</p>
         <p id="artist" class="text-light ms2">${data.tracks.data[i].artist.name}</p>   
        </div>`
      }
    })
    .catch((err) => {
      console.log("ERRORE NEL RECUPERO DATI CONCERTO", err)
    })
}

getAlbumDetails()
