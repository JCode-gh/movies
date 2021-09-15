<template>
  <div class="fullMovieContainer">
    <div v-if="$store.state.hasResults === false">
      <h1>No results</h1>
    </div>
    <div class="d-flex flex-wrap justify-content-center" v-if="$store.state.searchedResult.length > 0">
      <div class="card" style="width: 18rem; margin: 20px"
           v-for="(movie,index) in $store.state.searchedResult"
           :style="{borderColor: isActive(movie) ? 'red' : 'black'}" >
        <router-link :to="'/movieinfo'+`?${movie.id}`">
          <img class="card-img-top" :src="'https://image.tmdb.org/t/p/w1280/'+movie.poster_path" :alt="movie.title"/>
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
  components: {LoadingSpinner},
  data(){
    return {
      isAdded : Boolean
    }
  },
  computed : {
  },
  methods : {
    isActive(movie) {
      console.log('movie', movie);
      if(!movie) return false
      const storeData = this.$store.state.favoriteMovies || []
      return storeData.some(obj => obj.id === movie.id)
    },
    async addToFavorites(movie, index) {
      this.$store.commit('SET_MOVIES', movie);
      document.querySelectorAll('.faicons')[index].style.color = 'red';
      document.querySelectorAll('.card')[index].style.border = '3px solid red';
      await this.$store.commit('SET_MOVIES', movie);
    }
  },
  beforeMount() {
    this.$store.state.searchedResult = [];
    let apiKey = "ec8fb4c97f4c101a7e63dc22213b4106";

    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`)
        .then(function (response) {
          return response.json();
        })
        .then(movies => {
          this.$store.state.searchedResult = movies.results;
          console.log(this.$store.state.searchedResult);
        })

    if (localStorage.getItem("favoriteMovies") !== ""){
      this.$store.state.favoriteMovies =  JSON.parse(localStorage.getItem("favoriteMovies"));
    }
  }
}
</script>

<style scoped>
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
  border: 3px solid black;
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
