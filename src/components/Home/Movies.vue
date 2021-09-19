<template>
  <div class="fullMovieContainer">
    <div v-if="$store.state.hasResults === false">
      <h1 id="noresults">No results</h1>
    </div>
    <div class="d-flex flex-wrap justify-content-center" v-if="$store.state.searchedResult.length > 0">
      <div class="card" style="width: 18rem; margin: 20px"
           v-for="(movie,index) in $store.state.searchedResult"
           :style="{borderColor: isActive(movie) ? 'red' : 'darkgray'}" >
        <router-link :to="'/movieinfo'+`?${movie.id}`">
          <img class="image_placeholder card-img-top" :src="'https://image.tmdb.org/t/p/w1280/'+movie.poster_path" :alt="movie.title"/>
        </router-link>
        <div class="card-body">
          <router-link :to="'/movieinfo'+`?${movie.id}`">
            <h5 class="card-title">{{ movie.title }}</h5>
          </router-link>
          <a @click="addToFavorites(movie, index)">
            <font-awesome-icon class="faicons" :icon="['far', 'heart']"
                               :style="{color: isActive(movie) ? 'red' : 'lightgray'}"  />
          </a>
        </div>
      </div>
    </div>
    <div v-else-if="$store.state.hasResults === true && $store.state.searchedResult.length <= 0">
      <LoadingSpinner/>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from "../LoadingAnimation/LoadingSpinner";
export default {
  name: "TopMovies",
  components: {
    LoadingSpinner,
  },
  data(){
    return {
      isAdded : Boolean,
    }
  },
  methods : {
    isActive(movie) {
      if(!movie) return false
      const storeData = this.$store.state.favoriteMovies || []
      return storeData.some(obj => obj.id === movie.id)
    },
    async addToFavorites(movie) {
      if (this.$store.state.favoriteMovies.find(mov => mov.id === movie.id)){
        this.$store.commit("REMOVE_FAVMOVIE", movie);
      }
      else {
        await this.$store.commit('SET_FAVMOVIES', movie);
      }
    },
  },
  beforeMount() {
    this.$store.commit("CLEAR_SEARCH_FAVMOVIES_ARRAYS");
    if (localStorage.getItem("genreIdSelected")){
      let genreId = localStorage.getItem("genreIdSelected");

      fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${this.$store.state.apiKey}&with_genres=${genreId}`)
          .then(function (response) {
            return response.json();
          })
          .then(movies => {
            this.$store.commit("INSERT_MOVIES_SEARCHEDRESULT", movies.results);
          })
    }
    else {
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${this.$store.state.apiKey}&language=en-US&page=1`)
          .then(function (response) {
            return response.json();
          })
          .then(movies => {
            this.$store.commit("INSERT_MOVIES_SEARCHEDRESULT",movies.results)
          })
    }

    if (localStorage.getItem("favoriteMovies")){
      this.$store.commit("GET_FAVMOVIES_FROM_LST");
    }

  },
}
</script>

<style scoped>
#noresults {
  color: white;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100%;
  transform: translate(-50%, -50%);
}
.image_placeholder{
  background: url('../../assets/placeholder.png') no-repeat !important;
}

.fullMovieContainer {
  margin-bottom: 4em;
}
.faicons {
  color: white;
  font-size: 20px;
}
.faicons:hover {
  color: red !important;
}
a {
  text-decoration: none;
  color: white;

}
.card {
  background-color: black;
  border: 3px solid white;
}
img {
  transition: transform .2s;
}
img:hover {
  transform: scale(0.98);
}
h5 {
  font-size: 17px;
}
a:hover {
  color: red;
}
.card-body {
  justify-content: center !important;
  margin: auto !important;
  flex: none;
}
</style>
