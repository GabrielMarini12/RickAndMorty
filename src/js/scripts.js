const containerCards = document.getElementById("container-cards");
const imageCard = document.getElementById("image-card");
const titleCard = document.getElementById("title-card");
const vivoAndMorto = document.getElementById("vivo-and-morto");
const localizacaoCard = document.getElementById("localizacao-card");

const footer = document.getElementById("footer");
const personagens = document.getElementById("personagens");
const localizacoes = document.getElementById("localizacoes");
const episodios = document.getElementById("episodios");

const prevPage = document.getElementById("prev-page");
const nextPage = document.getElementById("next-page");

let currentPage = 1;
let totalPages = 1;
let totalPersonagens = 0;
let totalLocation = 0;
let totalEpisodios = 0;

async function pegarInfoCard(page) {
  try {
    const params = {
      page: page,
      perPage: 6,
    };

    const response = await api.get("/character", { params });
    const responseLocation = await api.get("/location");
    const responseEpisode = await api.get("/episode");
    const todosPersonagens = response.data.results;
    totalPersonagens = response.data.info.count;
    totalLocation = responseLocation.data.info.count;
    totalEpisodios = responseEpisode.data.info.count;

    totalPages = response.data.info.pages;

    todosPersonagens.forEach((item) => {
      const translatedStatus =
        item.status === "Alive"
          ? "Vivo"
          : item.status === "Dead"
          ? "Morto"
          : "Desconhecido";

      const translatedSpecies =
        item.species === "Human"
          ? "Humano"
          : item.species === "Alien"
          ? "Alienígena"
          : "Desconhecido";

      const statusClass =
        item.status === "Alive"
          ? "status-alive"
          : item.status === "Dead"
          ? "status-dead"
          : "status-unknown";

      const card = document.createElement("div");
      card.classList.add("col-xl-4");
      card.classList.add("col-lg-6");
      card.classList.add("col-sm-12");
      card.classList.add("card-animation");

      card.innerHTML = `
            <div>
              <img
                src="${item.image}"
                alt="Imagem de ${item.name}"
                class="w-100 rounded-top-3 image"
                id="image-card"
              />
            </div>
            <div
              class="d-flex flex-column py-4 px-4 border-success border-bottom border-end border-start rounded-bottom-3 items"
            >
              <p class="fw-bold title-card mb-1" id="title-card">${item.name}</p>
              <p class=" status-card" id="vivo-and-morto"><span class="fw-bold status-circle ${statusClass}"></span>${translatedStatus} - ${translatedSpecies}</p>

              <p class="locale text-secondary fw-bold">Última localização conhecida</p>
              <p class="fw-bold" id="localizacao-card">${item.location.name}</p>

              <button class="mt-2 px-3 py-1 text-white btn-details" onclick="openCharacterModal(${item.id})">Detalhes</button>
            </div>
      `;

      containerCards.appendChild(card);

      if (todosPersonagens.length === 0) {
        console.log("Nenhum recado para mostrar");
      }

      updatePaginationButtons();
    });

    const cardFooter = document.createElement("div");
    cardFooter.classList.add("d-flex");
    cardFooter.classList.add("mt-5");
    cardFooter.classList.add("mb-5");
    cardFooter;
    cardFooter.innerHTML = `
          <p class="px-4 footer-color-escrita">
            Personagens: <span class="text-white" id="personagens">${totalPersonagens}</span>
          </p>
          <p class="px-4 footer-color-escrita">
            Localizações: <span class="text-white" id="localizacoes">${totalLocation}</span>
          </p>
          <p class="px-4 footer-color-escrita">
            Episódios: <span class="text-white" id="episodios">${totalEpisodios}</span>
          </p>
      `;

    footer.appendChild(cardFooter);

    const pFooter = document.createElement("p");
    pFooter.classList.add("d-flex");
    pFooter.classList.add("mt-5");
    pFooter.classList.add("mb-5");
    pFooter.classList.add("footer-color-escrita");
    pFooter.innerHTML = `
       
          Desenvolvido por <span class="text-white px-2">Gabriel Marini</span> em 2024
        
      `;

    footer.appendChild(pFooter);
  } catch (error) {
    console.error("Erro ao buscar personagens.", error);
  }
}

pegarInfoCard(currentPage);

prevPage.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;

    pegarInfoCard(currentPage);
  }
});

nextPage.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;

    pegarInfoCard(currentPage);
  }
});

function updatePaginationButtons() {
  prevPage.disabled = currentPage === 1;
  nextPage.disabled = currentPage === totalPages;
}

async function openCharacterModal(id) {
  try {
    const response = await axios.get(
      `https://rickandmortyapi.com/api/character/${id}`
    );
    const character = response.data;

    const translatedStatus =
      character.status === "Alive"
        ? "Vivo"
        : character.status === "Dead"
        ? "Morto"
        : "Desconhecido";

    const translatedSpecies =
      character.species === "Human"
        ? "Humano"
        : character.species === "Alien"
        ? "Alienígena"
        : "Desconhecido";

    const translatedGender =
      character.gender === "Male"
        ? "Masculino"
        : character.gender === "Female"
        ? "Feminino"
        : character.gender === "Genderless"
        ? "Sem gênero"
        : "Desconhecido";

    const headerModal = document.getElementById("header-modal");
    headerModal.innerText = "Detalhes do personagem" + " " + character.name;

    const imgModal = document.getElementById("img-modal");
    imgModal.src = character.image;

    const nameModal = document.getElementById("name-modal");
    nameModal.innerText = character.name;

    const statusModal = document.getElementById("status-modal");
    statusModal.innerText = "Status: " + translatedStatus;
    const especiaModal = document.getElementById("especie-modal");
    especiaModal.innerText = "Espécie: " + translatedSpecies;
    const generoModal = document.getElementById("genero-modal");
    generoModal.innerText = "Gênero: " + translatedGender;
    const localizacaoModal = document.getElementById("localizacao-modal");
    localizacaoModal.innerText = "Localização: " + character.location.name;

    const modal = new bootstrap.Modal(
      document.getElementById("modal-character")
    );
    modal.show();
  } catch (error) {
    console.error("Erro ao buscar detalhes do personagem.", error);
  }
}
