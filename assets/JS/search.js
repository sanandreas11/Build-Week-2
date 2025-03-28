// Facciamo partire la funzione search alla pressione del tasto o con il tasto Enter
document.getElementById("search-button").addEventListener("click", search);
document.getElementById("search-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") search();
});

function search() {
  //Prendiamo il valore della query ed eliminiamo eventuali spazi vuoti
  const query = document.getElementById("search-input").value.trim();
  if (!query) return; //Se il campo di ricerca è vuoto non parte la funzione

  fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${query}`)
    .then((response) => response.json()) // Trasforma la risposta in formato JSON
    .then((data) => {
      const resultsDiv = document.getElementById("results"); //Recupero il div dove andranno i risultati
      resultsDiv.innerHTML = ""; //Svuoto il div da eventuali contenuti
      data.data.forEach((track) => {
        const trackElement = document.createElement("div"); //creo il div row
        trackElement.className =
          "row pt-3 justify-content-center justify-content-md-evenly justify-content-xl-center";
        //Qui andrà la creazione e  la struttura dei risultati
        trackElement.innerHTML = `
          <a href="album.html?albumId=${track.album.id}" class="col col-2 col-md-1">
            <img src="${track.album.cover_small}" alt="${track.title}">
          </a>
          <a href="album.html?albumId=${track.album.id}" class="col col-8 col-md-4 text-decoration-none">
            <p class="text-light mb-0">${track.title}</p>
            <p class="text-white-50">${track.type} • ${track.artist.name}</p>
          </a>
          <div class="col col-2 col-md-2 d-flex justify-content-center align-items-center">
            <i class="bi bi-plus-circle text-white"></i>
          </div>
        `;
        resultsDiv.appendChild(trackElement); // Appendo i risultati al div row
      });
    })
    .catch((error) => {
      console.log("Errore nella ricerca:", error);
    });
}
