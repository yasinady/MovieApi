const search = document.getElementById('search');
const searchList = document.getElementById('search-list');
const result = document.getElementById('result-grid');

async function loadMovies(searchTerm){
    const URL = `http://www.omdbapi.com/?s=${searchTerm}&apikey=b27f4ae9`;
    const res = await fetch(`${URL}`);
    const data = await res.json()
    // console.log(data.search);
    if(data.Response == 'True') displayMovieList(data.Search)
}

function findMovies(){
    let searchTerm = (search.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list')
        loadMovies(searchTerm);
    }else {
        searchList.classList.add('hide-search-list')
    }
}

function displayMovieList(movies){
    searchList.innerHTML = '';
    for(let index = 0; index < movies.length; index++){
        let movieListItem = document.createElement('div')
        movieListItem.dataset.id = movies[index].imdbID
        movieListItem.classList.add('search-item')
        if(movies[index].Poster != 'N/A')
            moviePoster = movies[index].Poster;
        else 
        moviePoster = 'image_not_found.png'

        movieListItem.innerHTML = `
            <div class="search-thumbnail">
                <img
                  src="${moviePoster}"
                  
                />
              </div>
              <div class="item-info">
                <h3>${movies[index].Title}</h3>
                <p>${movies[index].Year}</p>
              </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails()
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-item');
    searchListMovies.forEach(movie => {
          movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            search.value = '';
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=b27f4ae9`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails)
          })
    })

}

function displayMovieDetails(details){
    result.innerHTML = `
    <div class="movie-poster">
        <img
        src="${(details.Poster != 'N/A') ? details.Poster : 'image_not_found.png' } "
        alt="movie poster"
        />
    </div>
    <div class="movie-info">
        <h3 class="movie-title">${details.Title}</h3>
        <ul class="movie-misc-info">
            <li class="year">Year: ${details.Year}</li>
            <li class="rated">Ratings: ${details.Rated}</li>
            <li class="released">Released: ${details.Released}</li>
        </ul>
        <p class="genre"><b>Genre:</b> ${details.Genre}</p>
        <p class="writer">
        <b>Writer:</b> ${details.Writer}
        </p>
        <p class="actors">
        <b>Actors:</b> ${details.Actors}
        </p>
        <p class="plot">
        <b>Plot:</b> ${details.Plot}
        </p>
        <p class="language"><b>Language:</b> ${details.Language}</p>
        <p class="awards">
        <b><i class="fas fa-award"></i></b>
        ${details.Awards}
        </p>
    </div>
    `;
}

window.addEventListener('click', (event) => {
    if(event.target.className != 'form-control'){
        searchList.classList.add('hide-search-list')
    }
})