<template>
<div>
  <div class="fullMovieContainer">
    <div>
      <h1 id="noresults">No results</h1>
    </div>
    <div class="d-flex flex-wrap justify-content-center" v-if="$store.state.newestMovies.length > 0">
      <div class="card" style="width: 18rem; margin: 20px"
           v-for="(movie,index) in $store.state.newestMovies"
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
    <div v-else-if="$store.state.newestMovies.length <= 0">
      <LoadingSpinner/>
    </div>
  </div>
</div>
</template>

<script>
import LoadingSpinner from "../LoadingAnimation/LoadingSpinner";

export default {
  name: "NewestMovies",
  components : {LoadingSpinner},
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
  async beforeMount() {
    await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${this.$store.state.apiKey}&language=en-US&sort_by=primary_release_date.desc&include_adult=false&include_video=false&page=1&primary_release_year=2021&primary_release_date.gte=2021&with_watch_monetization_types=flatrate`)
        .then(function (response) {
          return response.json();
        })
        .then(topmovies => {
          console.log(topmovies.results);
          this.$store.commit("INSERT_MOVIES_NEWESTMOVIES", topmovies.results);
        })
  },

}
</script>

<style scoped>

</style>