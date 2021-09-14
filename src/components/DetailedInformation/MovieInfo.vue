<template>
  <div class="card mb-3">
    <div v-if="movie" class="row g-0">
      <div class="col-md-4 image">
        <img :src="'https://image.tmdb.org/t/p/w1280/'+movie.poster_path" :alt="movie.title" class="img-fluid rounded-start"/>
      </div>
      <div class="col-md-8 m-auto">
        <div class="card-body">
          <h5 class="card-title">{{ movie.title }}</h5>
          <p class="card-text">{{ movie.overview }}</p>
          <p class="card-text"><small class="text-muted" style="margin-right: 2rem" v-for="genre in movie.genres">{{genre.name}}</small></p>
          <div class="d-flex flex-column" >
            <a @click="addToFavorites(movie, index)">
              <font-awesome-icon id="faicon" class="faicons" :icon="['far', 'heart']" />
            </a>
            <div class="hello">

              <div>
                <input v-if="movie.homepage !== '' && !movie.homepage.includes('netflix')"
                       type="button" id="website" value="Visit Website"
                       @click="openWebsite(movie)">

                <input v-if="movie.homepage !== '' && movie.homepage.includes('netflix')" type="button" value="Watch on Netflix"
                       @click="openWebsite(movie)">

              </div>
            </div>





            <input type="button" id="goBack" value="Go back"
                   @click="$router.push('/');">
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="classic-1"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MovieInfo",
  data: function () {
    return {
      movie: null
    }
  },
  methods : {
    openWebsite(movie){
      window.open(`${movie.homepage}`)
    },
    addToFavorites(movie, index){
      if (localStorage.getItem("favoriteMovies") !== ""){
        this.$store.state.favoriteMovies.push(movie);
        localStorage.setItem("favoriteMovies",JSON.stringify(this.$store.state.favoriteMovies));
      }
      else {
        this.$store.state.favoriteMovies.push(movie);
        localStorage.setItem("favoriteMovies",JSON.stringify(this.$store.state.favoriteMovies));
      }

      document.getElementById("faicon").style.color = "red";
      //TODO: Set color of fontawesome Icon to red when pressed.
      //PROBABLY HAVE TO USE INDEX

    },
  },
  beforeMount() {
    const queryString = window.location.search;
    let id = queryString.split('?')[1];
    let apiKey = "ec8fb4c97f4c101a7e63dc22213b4106";

    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`)
        .then(function (response) {
          return response.json();
        })
        .then(movie => {
          this.movie = movie;
          console.log(movie);
        })
  }
}
</script>

<style scoped>
* {
  transition: color 0.3s;
}

.classic-1 {
  font-weight: bold;
  font-family: monospace;
  font-size: 30px;
  display: grid;
}
.classic-1:before,
.classic-1:after {
  content:"Loading...";
  grid-area: 1/1;
  -webkit-mask:linear-gradient(90deg,#000 50%,#0000 0) 0 50%/2ch 100%;
  animation:c1 1s infinite cubic-bezier(0.5,220,0.5,-220);
}
.classic-1:after {
  -webkit-mask-position:1ch 50%;
  --s:-1;
}
@keyframes c1 {100%{transform: translateY(calc(var(--s,1)*0.1%));}}
img {
  width: 300px;
  box-shadow: 0 0 10px -2px black;
}
input:hover  {
  color: red !important;
}
input {
  padding: 10px;
  background: black;
  color: white;
  outline: none;
  border: none;
  width: 100%;
}
.card {
  border: 4px dotted;
}


.image {
  display: flex;
  justify-content: flex-end;
  background: black url("https://thumbs.dreamstime.com/b/abstract-line-background-lines-vector-design-182560517.jpg");
}

ul {
  list-style: none;
}
.faicons {
  font-size: 30px;
}
.faicons:hover,.faicons:focus, .faicons:visited {
  color: red !important;
}
</style>