const searchUrl = " https://striveschool-api.herokuapp.com/api/deezer/album/"



// ------------ codice per player principale

albumPlayerId = 8832423;
fetch(searchUrl + albumPlayerId)
    .then((response) => response.json())
    .then((data) => {
        // Modifica il titolo dell'album
        let playerTitle = document.getElementById("player-title");
        playerTitle.innerText = data.tracks.data[0].title;

        // Modifica l'artista
        let playerArtist = document.getElementById("player-artist");
        playerArtist.innerText = data.tracks.data[0].artist.name;

        // Modifica l'immagine dell'album
        let playerImage = document.getElementById("player-image");
        playerImage.src = data.cover_big;

        // Aggiorna anche il nome dell'artista nello span
        let artistName = document.getElementById("artist-name");
        artistName.innerText = data.tracks.data[0].artist.name;
    })
    .catch((error) => console.error("Errore nel recupero dei dati:", error));

//--------------------------------



//codice per generare dinamicamente card sezione-2
let listaAlbumSez2 = [
    606344212, 642312861, 727466171, 212391, 442973585, 522138732,
]

const container = document.getElementById("sezione2")

container.classList.add("row", "g-0")


listaAlbumSez2.forEach((albumId) => {
    fetch(searchUrl + albumId)
        .then((response) => response.json())
        .then((data) => {
            const col = document.createElement("div")
            col.classList.add("col-6", "col-md-4", "p-1")

            col.innerHTML = `
                <div class="card fs-2 bg-dark">
                    <div class="row g-0 h-100">
                        <div class="col-4 h-100">
                            <img src="${data.cover_big}" class="img-fluid rounded-start  w-100 h-100" alt="${data.title}">
                        </div>
                        <div class="col-8">
                            <div class="card-body fs-2">
                                <h5 class="card-title fs-6 text-light">${data.title}</h5>
                            </div>
                        </div>
                    </div>
                </div> 
            `

            container.appendChild(col)
        })
        .catch((error) => console.error("Errore nel recupero dei dati:", error))
})

document.getElementById('view-more').addEventListener('click', function () {
    //Naviga verso una pagina
    window.location.href = "artist.html?id=17#";

});

let listaAlbumSez3 = [52845302, 341061, 1399087, 301050827, 87722792];

const container2 = document.getElementById("sezione3");
container2.classList.add(
    "row",
    "g-3",
    "d-flex",
    "justify-content-around",
    "flex-wrap"
);

listaAlbumSez3.forEach((albumId) => {
    fetch(searchUrl + albumId)
        .then((response) => response.json())
        .then((data) => {
            console.log("Dati ricevuti:", data);

            if (!data || !data.cover_big) {
                console.error("Errore: dati non validi per albumId", albumId);
                return;
            }

            const col2 = document.createElement("div");
            col2.classList.add("px-2");

            col2.innerHTML = `
    <div class="col p-2 border border-1 border-dark rounded-2 bg-dark" style="height: auto;">
        <div class="row flex-md-column">
            <div class="col w-100">
                <img class="rounded-2" src="${data.cover_big}" 
                    style="object-fit: cover; width: 100%; height: 100%;" 
                    alt="${data.title}">
            </div>
            <div class="col text-light mt-3">
                <h6>${data.title}</h6>
                <p style="font-size: 13px;" class="overflow-hidden">
                    ${data.genres.data[0].name}
                </p>
            </div>
        </div>

        <!-- Sezione icone per mobile -->
        <div class="row d-md-none mt-2 align-items-center justify-content-between">
            <!-- Icone a sinistra -->
            <div class="col-5 d-flex justify-content-start gap-2">
                <i id="heart-icon" class="bi bi-heart text-success fs-2"></i>
                <i class="bi bi-three-dots-vertical text-light fs-2"></i>
            </div>

            <!-- Numero tracce -->
            <div class="col-2 d-flex justify-content-center">
                <p class="text-light fs-6 fw-bold m-0">
                    ${getNumberOfTracksString(data)}
                </p>
            </div>

            <!-- Pulsante Play -->
            <div class="col-2 d-flex justify-content-center">
                <button class="btn btn-outline-light p-0 border-0">
                    <i class="bi bi-play-circle fs-3 fw-bold"></i>
                </button>
            </div>
        </div>
    </div>
`;

            container2.appendChild(col2);

            const heartIcon = col2.querySelector("#heart-icon");

            // Gestione del clic sul cuore
            heartIcon.addEventListener("click", () => {
                if (heartIcon.classList.contains("bi-heart")) {
                    // Se è vuoto, lo colora
                    heartIcon.classList.replace("bi-heart", "bi-heart-fill");
                    heartIcon.classList.add("text-success");
                } else {
                    // Se è già colorato, lo svuota
                    heartIcon.classList.replace("bi-heart-fill", "bi-heart");
                    heartIcon.classList.remove("bi-heart-fill");
                }
            });
        })
        .catch((error) => console.error("Errore nel recupero dei dati:", error));
});

// codice per recuperare numero dei brani da inserire nelle card della "sezione3" versione mobile
function getNumberOfTracksString(album) {
    const numBrani = album.nb_tracks;

    if (numBrani > 1) {
        return numBrani + " brani";
    }
    else {
        return numBrani + " brano";
    }
}





