<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <AppNavbar />
    
    <!-- Main Content -->
    <main id="main-content" class="pt-16" tabindex="-1">
      <MovieDetails />
    </main>
  </div>
</template>

<script>
import AppNavbar from '../components/layout/AppNavbar.vue'
import MovieDetails from '../components/movie/MovieDetails.vue'

export default {
  name: "DetailedInformation",
  components: {
    AppNavbar,
    MovieDetails
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>