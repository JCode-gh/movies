<template>
<div>
  <div v-for="favorite in $store.state.favoriteMovies">
    <h1>{{favorite.title}}</h1>
  </div>
</div>
</template>

<script>
export default {
  name: "ListOfFavorites",
  beforeMount() {
    this.$store.state.favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies"));
  }
}
</script>

<style scoped>

</style>