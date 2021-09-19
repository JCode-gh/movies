<template>
  <transition name="fade">
    <router-view/>
  </transition>
</template>

<script>
export default {
  async created() {
    const favoriteMoviesStorageData = localStorage.getItem('favoriteMovies')
    if(favoriteMoviesStorageData) {
      await this.$store.commit('INIT_FAVMOVIES', JSON.parse(favoriteMoviesStorageData))
    }
  }
}
</script>

<style>
.fade-enter-from,
.fade-leave-to{
  opacity: 0;
}

.fade-enter-active,
.fade-leave-to{
  transition: opacity 0.5s ease-out;
}


* {
  margin: 0;
  padding: 0 ;
  font-family: Poppins, sans-serif;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}




</style>
