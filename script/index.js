const searchUrl = " https://striveschool-api.herokuapp.com/api/deezer/album/"
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

let listaAlbumSez3 = [52845302, 341061, 1399087, 301050827, 87722792]

const container2 = document.getElementById("sezione3")
container2.classList.add(
    "row",
    "g-3",
    "d-flex",
    "justify-content-around",
    "flex-wrap"
)

listaAlbumSez3.forEach((albumId) => {
    fetch(searchUrl + albumId)
        .then((response) => response.json())
        .then((data) => {
            console.log("Dati ricevuti:", data)

            if (!data || !data.cover_big) {
                console.error("Errore: dati non validi per albumId", albumId)
                return
            }

            const col2 = document.createElement("div")
            col2.classList.add("col-12", "col-md-2", "p-1")

            col2.innerHTML = `
            <div class="card mb-3" style="height: 350px; width:180px; background-color:#2c2c2c">
                <img src="${data.cover_big}" class="card-img-top" alt="${data.title}">
                <div class="card-body">
                    <h4 class="text-light">${data.title}</h4>
                    <p class="text-light"style="height: 100px; overflow: hidden;">"${data.type}"</p>
                </div>
            </div>
        `

            container2.appendChild(col2)
        })
        .catch((error) => console.error("Errore nel recupero dei dati:", error))
})
