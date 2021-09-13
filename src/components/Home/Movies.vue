<template>
<div class="fullMovieContainer">

  <div class="d-flex flex-wrap justify-content-center" v-if="$store.state.searchedResult.length > 0">
    <div class="card" style="width: 18rem; margin: 20px" v-for="movie in $store.state.searchedResult">
      <router-link :to="'/movieinfo'+`?${movie.id}`">
        <img :src="'https://image.tmdb.org/t/p/w1280/'+movie.poster_path" class="card-img-top" :alt="movie.title">
      </router-link>
      <div class="card-body">
        <router-link :to="'/movieinfo'+`?${movie.id}`">
          <h5 class="card-title">{{ movie.title }}</h5>
        </router-link>
      </div>
    </div>
  </div>


</div>


</template>

<script>
export default {
  name: "TopMovies",
  computed : {

  },
  methods : {

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
  }
}
</script>

<style scoped>
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
  color: #42b983;
}
.card-body {
  justify-content: center !important;
  margin: auto !important;
  flex: none;
}
</style>