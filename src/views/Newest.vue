<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <AppNavbar />
    
    <!-- Main Content -->
    <main id="main-content" class="pt-20 pb-8" tabindex="-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl sm:text-4xl font-bold text-white mb-2 text-shadow">
            Latest Movies
          </h1>
          <p class="text-slate-400 text-lg">
            Discover the newest movies released this year
          </p>
        </div>

        <!-- Movies Grid -->
        <MoviesGrid
          :movies="$store.state.newestMovies"
          :is-loading="isLoading"
          :has-results="hasResults"
          :enable-infinite-scroll="false"
        />
      </div>
    </main>
  </div>
</template>

<script>
import AppNavbar from '../components/layout/AppNavbar.vue'
import MoviesGrid from '../components/ui/MoviesGrid.vue'

export default {
  name: "Newest",
  components: {
    AppNavbar,
    MoviesGrid
  },
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    hasResults() {
      return this.$store.state.newestMovies.length > 0
    }
  },
  async created() {
    await this.loadNewestMovies()
  },
  methods: {
    async loadNewestMovies() {
      this.isLoading = true
      
      try {
        // Get current year
        const currentYear = new Date().getFullYear()
        
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${this.$store.state.apiKey}&language=en-US&sort_by=primary_release_date.desc&include_adult=false&include_video=false&page=1&primary_release_year=${currentYear}&primary_release_date.gte=${currentYear}&with_watch_monetization_types=flatrate`
        )
        
        const data = await response.json()
        this.$store.commit('INSERT_MOVIES_NEWESTMOVIES', data.results)
        
      } catch (error) {
        console.error('Error loading newest movies:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>