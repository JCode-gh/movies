<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <AppNavbar />
    
    <!-- Main Content -->
    <main id="main-content" class="pt-20 pb-10" tabindex="-1">
      <div class="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-10">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 text-shadow">
            Discover Movies
          </h1>
          <p class="text-slate-400 text-lg lg:text-xl">
            Find your next favorite movie from our extensive collection
          </p>
        </div>

        <!-- Genre Filter -->
        <div class="mb-10">
          <GenreFilter @genre-selected="handleGenreSelected" />
        </div>

        <!-- Movies Grid -->
        <MoviesGrid
          :movies="$store.state.searchedResult"
          :is-loading="$store.state.isLoading"
          :is-loading-more="isLoadingMore"
          :has-results="$store.state.hasResults"
          :can-load-more="canLoadMore"
          :total-results="totalResults"
          @load-more="loadMoreMovies"
          @clear-filters="clearFilters"
        />
      </div>
    </main>
  </div>
</template>

<script>
import AppNavbar from '../components/layout/AppNavbar.vue'
import GenreFilter from '../components/ui/GenreFilter.vue'
import MoviesGrid from '../components/ui/MoviesGrid.vue'

export default {
  name: 'Home',
  components: {
    AppNavbar,
    GenreFilter,
    MoviesGrid
  },
  data() {
    return {
      isLoadingMore: false,
      currentPage: 1,
      totalResults: null,
      selectedGenre: null
    }
  },
  computed: {
    canLoadMore() {
      return this.currentPage < this.$store.state.totalPages && !this.isLoadingMore
    }
  },
  async created() {
    // Initialize favorites storage
    if (!localStorage.getItem("favoriteMovies")) {
      localStorage.setItem('favoriteMovies', "")
    }

    // Load initial movies
    await this.loadInitialMovies()
  },
  methods: {
    async loadInitialMovies() {
      // Reset pagination state
      this.currentPage = 1
      this.totalResults = null
      this.$store.commit('SET_PAGINATION', {
        currentPage: 1,
        totalPages: 1
      })
      
      this.$store.commit('SET_LOADING', true)
      
      try {
        // Check if we have a saved genre selection
        const savedGenreId = localStorage.getItem('genreIdSelected')
        
        let apiUrl
        if (savedGenreId) {
          this.selectedGenre = parseInt(savedGenreId)
          apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${this.$store.state.apiKey}&with_genres=${savedGenreId}&page=1&sort_by=popularity.desc`
        } else {
          apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${this.$store.state.apiKey}&language=en-US&page=1`
        }

        const response = await fetch(apiUrl)
        const data = await response.json()
        
        this.$store.commit('CLEAR_SEARCHEDRESULT')
        this.$store.commit('INSERT_MOVIES_SEARCHEDRESULT', data.results)
        this.$store.commit('SET_PAGINATION', {
          currentPage: data.page,
          totalPages: data.total_pages
        })
        
        this.currentPage = data.page
        this.totalResults = data.total_results
        
      } catch (error) {
        console.error('Error loading movies:', error)
      } finally {
        this.$store.commit('SET_LOADING', false)
      }
    },

    async loadMoreMovies() {
      if (this.isLoadingMore || !this.canLoadMore) return
      
      this.isLoadingMore = true
      const nextPage = this.currentPage + 1
      
      try {
        let apiUrl
        if (this.selectedGenre) {
          apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${this.$store.state.apiKey}&with_genres=${this.selectedGenre}&page=${nextPage}&sort_by=popularity.desc`
        } else {
          apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${this.$store.state.apiKey}&language=en-US&page=${nextPage}`
        }

        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        
        if (data.results && data.results.length > 0) {
          // Update store with new movies
          this.$store.commit('INSERT_MOVIES_SEARCHEDRESULT', data.results)
          
          // Update pagination state
          this.currentPage = data.page
          this.$store.commit('SET_PAGINATION', {
            currentPage: data.page,
            totalPages: data.total_pages
          })
          
          // Update total results if needed
          if (!this.totalResults) {
            this.totalResults = data.total_results
          }
        }
      } catch (error) {
        console.error('Error loading more movies:', error)
      } finally {
        setTimeout(() => {
          this.isLoadingMore = false
        }, 500) // Add a small delay to prevent rapid consecutive loads
      }
    },

    async handleGenreSelected(genreId) {
      // Reset pagination state
      this.currentPage = 1
      this.totalResults = null
      this.$store.commit('SET_PAGINATION', {
        currentPage: 1,
        totalPages: 1
      })
      
      this.$store.commit('SET_LOADING', true)
      this.$store.commit('CLEAR_SEARCHEDRESULT')
      
      try {
        let apiUrl
        if (genreId) {
          apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${this.$store.state.apiKey}&with_genres=${genreId}&page=1&sort_by=popularity.desc`
          localStorage.setItem('genreIdSelected', genreId.toString())
        } else {
          apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${this.$store.state.apiKey}&language=en-US&page=1`
          localStorage.removeItem('genreIdSelected')
        }

        const response = await fetch(apiUrl)
        const data = await response.json()
        
        // Update store with new data
        this.$store.commit('INSERT_MOVIES_SEARCHEDRESULT', data.results)
        this.$store.commit('SET_PAGINATION', {
          currentPage: data.page,
          totalPages: data.total_pages
        })
        
        this.currentPage = data.page
        this.totalResults = data.total_results
        this.selectedGenre = genreId
        
      } catch (error) {
        console.error('Error loading movies by genre:', error)
      } finally {
        this.$store.commit('SET_LOADING', false)
      }
    },

    async clearFilters() {
      // Reset pagination state
      this.currentPage = 1
      this.totalResults = null
      this.$store.commit('SET_PAGINATION', {
        currentPage: 1,
        totalPages: 1
      })
      
      this.selectedGenre = null
      localStorage.removeItem('genreIdSelected')
      await this.loadInitialMovies()
    }
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
