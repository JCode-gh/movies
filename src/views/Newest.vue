<template>
<div>
  <Nav/>
  <NewestMovies/>
</div>
</template>

<script>
import NewestMovies from "../components/Newest/NewestMovies";
import Movies from "../components/Home/Movies";
import Nav from "../components/Home/Nav";
import LoadingSpinner from "../components/LoadingAnimation/LoadingSpinner";
export default {
  name: "Newest",
  components: {Nav, NewestMovies, Movies, LoadingSpinner}
}
</script>

<style scoped>

</style>