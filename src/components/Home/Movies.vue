<template>
<div class="fullMovieContainer">
  <div v-if="$store.state.hasResults === false">
    <h1>No results</h1>
  </div>
  <div class="d-flex flex-wrap justify-content-center" v-if="$store.state.searchedResult.length > 0">
    <div class="card" style="width: 18rem; margin: 20px"
         v-for="(movie,index) in $store.state.searchedResult">
      <router-link :to="'/movieinfo'+`?${movie.id}`">
        <img :src="'https://image.tmdb.org/t/p/w1280/'+movie.poster_path" class="card-img-top" :alt="movie.title"/>
      </router-link>
      <div class="card-body">
        <router-link :to="'/movieinfo'+`?${movie.id}`">
          <h5 class="card-title">{{ movie.title }}</h5>
        </router-link>
        <a @click="addToFavorites(movie, index)"><font-awesome-icon class="faicons" :icon="['far', 'heart']" /></a>
        <!--<input type="button" @click="addToFavorites(movie)" value="Add To Favorites">-->
      </div>
    </div>
  </div>
</div>


</template>

<script>
import ImageLoader from "../../Image-Loader";
export default {
  name: "TopMovies",
  components: {ImageLoader},
  data(){
    return {
      isAdded : Boolean
    }
  },
  computed : {
  },
  methods : {
    addToFavorites(movie, index){
      if (localStorage.getItem("favoriteMovies") !== ""){
        this.$store.state.favoriteMovies.push(movie);
        localStorage.setItem("favoriteMovies",JSON.stringify(this.$store.state.favoriteMovies));
      }
      else {
        this.$store.state.favoriteMovies.push(movie);
        this.$store.state.favoriteMovies = [...new Map(this.$store.state.favoriteMovies.map(item => [item["id"], item])).values()]
        localStorage.setItem("favoriteMovies",JSON.stringify(this.$store.state.favoriteMovies));
      }
      document.querySelectorAll(".faicons")[index].style.color = "red";
      document.querySelectorAll(".card")[index].style.border = "3px solid red";

        //TODO: RETURN ARRAY WITHOUT DUPLICATES


      //this.$store.state.favoriteMovies = this.$store.state.favoriteMovies.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i)
    },
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
  color: red;
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