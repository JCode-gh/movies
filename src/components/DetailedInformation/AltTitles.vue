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
      <a @click="addToFavorites(movie, index)"><font-awesome-icon class="faicons" :icon="['far', 'heart']" :style="{color: isActive(movie) ? 'red' : 'black'}" /></a>
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
    isActive(movie) {
      console.log('movie', movie);
      if(!movie) return false
      const storeData = this.$store.state.favoriteMovies || []
      return storeData.some(obj => obj.id === movie.id)
    },
    async addToFavorites(movie){
      await this.$store.commit('SET_MOVIES', movie);
    },
  },
  mounted() {
    //console.log(this.altTitles);
  }
}
</script>

<style scoped>

</style>
