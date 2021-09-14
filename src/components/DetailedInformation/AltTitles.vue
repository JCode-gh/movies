<template>
  <div class="card" style="width: 18rem; margin: 20px"
       v-for="(movie,index) in collectionTitles">
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
</template>

<script>
export default {
  name: "AltTitles",
  props : {
    collectionTitles : Array
  },
  methods: {
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

    },
  },
  mounted() {
    //console.log(this.altTitles);
  }
}
</script>

<style scoped>

</style>