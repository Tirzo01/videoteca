const GET = async (BASE_URL) => {
  const res = await fetch(BASE_URL);
  return await res.json();
};

const c = (nameEl) => {
  return document.createElement(nameEl);
};

/**Global */
const heroEl = document.querySelector(".hero");
const posterEl = document.querySelector(".poster");
const titleEl = document.getElementById("title");
const yearEl = document.getElementById("year");
const categoriesEl = document.getElementById("categories");
const runtimeEl = document.getElementById("runtime");
const imdbEl = document.getElementById("imdb");
const storyLineEl = document.getElementById("storyline");
const searchEl = document.getElementById("search");
const main_containerEl = document.querySelector(".main_container");
const movieContainerEl = document.querySelector(".container");

const watchTrailer_btn_el = document.querySelector(".watch__trailer-btn");
const modalEl = document.querySelector(".modal");
const youtubeEl = document.querySelector("iframe");

const all_filterEl = document.getElementById("all_filter");
const action_filterEl = document.getElementById("action_filter");
const adventure_filterEl = document.getElementById("adventure_filter");
const comic_filterEl = document.getElementById("comic_filter");

let selected_category = document.getElementById("all_filter");

let movies = [];
let start = 0;
let limit = 10;

const createMovieCard = (movie) => {
  const cardEl = c("div");
  const imgEl = c("img");
  const titleEl = c("h3");

  cardEl.classList = "card";

  imgEl.setAttribute("src", movie.poster);
  titleEl.textContent = movie.title;

  cardEl.append(imgEl, titleEl);
  movieContainerEl.append(cardEl);

  imgEl.addEventListener("click", (e) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setHero(movie);
  });
};

const populateCards = (moviesArray) => {
  for (let i = start; i < limit; i++) {
    if (moviesArray[i] == undefined) return;
    createMovieCard(moviesArray[i]);
  }
  createLastContainerElements(
    moviesArray
  ); /**Come parametro va messo anche l'array filtrato così quando si clicca il bottone carica i film dell'array filtrato */
  start = limit;
  limit += 10;
};

const createLastContainerElements = (moviesArray) => {
  const last_containerEl = c("div");
  const lineEl = c("div");
  const load_more_btn_El = c("button");
  last_containerEl.classList = "last_container";
  lineEl.classList = "line";
  load_more_btn_El.classList = "load_more-btn";
  load_more_btn_El.textContent = "Carica ancora";

  load_more_btn_El.addEventListener("click", (e) => {
    e.preventDefault();
    main_containerEl.removeChild(last_containerEl);
    populateCards(moviesArray);
  });
  last_containerEl.append(lineEl, load_more_btn_El);
  main_containerEl.append(last_containerEl);
};

const newRandomMovie = () => {
  return movies[Math.floor(Math.random() * movies.length)];
};

const setHero = (movie) => {
  heroEl.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)),url(${movie.background})`;
  posterEl.setAttribute("src", movie.poster);
  yearEl.textContent = movie.year;
  titleEl.textContent = movie.title;
  categoriesEl.textContent = "";
  for (let i = 0; i < movie.categories.length; i++) {
    let categoryLi = document.createElement("li");
    categoryLi.textContent = movie.categories[i];
    categoriesEl.append(categoryLi);
    if (i < movie.categories.length - 1) {
      let point = document.createElement("li");
      point.textContent = "●";
      categoriesEl.append(point);
    }
  }
  runtimeEl.textContent = movie.runtime + " min.";
  imdbEl.textContent = "Imdb: " + movie.imdb + "/10";
  storyLineEl.textContent = movie.storyline;

  youtubeEl.setAttribute("src", movie.trailer);
  watchTrailer_btn_el.addEventListener("click", (e) => {
    modalEl.style.display = "block";
    document.body.style.overflow = "hidden";
  });
};

/**
 * Eventi
 */
window.onload = () => {
  GET("http://www.localhost:3000/movies").then((response) => {
    movies = response.map((element) => {
      // createMovieCard(element);
      return element;
    });
    populateCards(movies);
    const randomMovie = newRandomMovie();
    setHero(randomMovie);
    /**Bottone ricerca */
    searchEl.addEventListener("input", (e) => {
      movieContainerEl.textContent = "";
      movies.filter((movie) => {
        movie.title.toLowerCase().includes(e.target.value.toLowerCase()) &&
          createMovieCard(movie);
      });
    });
  });
};

modalEl.addEventListener("click", (e) => {
  modalEl.style.display = "none";
  youtubeEl.setAttribute("src", youtubeEl.getAttribute("src"));
  document.body.style.overflowY = "scroll";
});

window.addEventListener("scroll", (e) => {
  if (window.pageYOffset > document.querySelector("nav").offsetHeight) {
    document.querySelector("nav").classList.add("sticky");
  } else {
    document.querySelector("nav").classList.remove("sticky");
  }
});

/**Filtri */
all_filterEl.addEventListener("click", (e) => {
  movieContainerEl.textContent = "";
  selected_category.classList.remove("selected_category");
  all_filterEl.classList.add("selected_category");
  selected_category = all_filterEl;
  start = 0;
  limit = 10;
  if (main_containerEl.childElementCount >= 2)
    main_containerEl.removeChild(main_containerEl.lastChild);
  populateCards(movies);
});

action_filterEl.addEventListener("click", (e) => {
  movieContainerEl.textContent = "";
  selected_category.classList.remove("selected_category");
  action_filterEl.classList.add("selected_category");
  selected_category = action_filterEl;
  filtered_movies = movies.filter((movie) =>
    movie.categories.includes("Azione")
  );
  start = 0;
  limit = 10;
  if (main_containerEl.childElementCount >= 2)
    main_containerEl.removeChild(main_containerEl.lastChild);
  populateCards(filtered_movies);
});

adventure_filterEl.addEventListener("click", (e) => {
  movieContainerEl.textContent = "";
  selected_category.classList.remove("selected_category");
  adventure_filterEl.classList.add("selected_category");
  selected_category = adventure_filterEl;
  filtered_movies = movies.filter((movie) =>
    movie.categories.includes("Avventura")
  );
  start = 0;
  limit = 10;
  if (main_containerEl.childElementCount >= 2)
    main_containerEl.removeChild(main_containerEl.lastChild);
  populateCards(filtered_movies);
});

comic_filterEl.addEventListener("click", (e) => {
  movieContainerEl.textContent = "";
  selected_category.classList.remove("selected_category");
  comic_filterEl.classList.add("selected_category");
  selected_category = comic_filterEl;
  filtered_movies = movies.filter((movie) =>
    movie.categories.includes("Comico")
  );
  start = 0;
  limit = 10;
  if (main_containerEl.childElementCount >= 2)
    main_containerEl.removeChild(main_containerEl.lastChild);
  populateCards(filtered_movies);
});
