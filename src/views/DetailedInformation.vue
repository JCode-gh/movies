<template>
<div>
  <MovieInfo/>
</div>
</template>

<script>
import MovieInfo from "../components/DetailedInformation/MovieInfo";
import Nav from "../components/Home/Nav";
export default {
  name: "DetailedInformation",
  components: {Nav, MovieInfo}
}
</script>

<style scoped>
#navbarSupportedContent {
  display: none;
}
</style>