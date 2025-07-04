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
            My Favorites
          </h1>
          <p class="text-slate-400 text-lg">
            Your collection of favorite movies ({{ $store.state.favoriteMovies.length }})
          </p>
        </div>

        <!-- Empty State -->
        <div v-if="$store.state.favoriteMovies.length === 0" class="text-center py-20">
          <div class="w-24 h-24 mx-auto mb-6 text-slate-400">
            <HeartIcon class="w-full h-full" />
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">No Favorites Yet</h2>
          <p class="text-slate-400 mb-6">Start adding movies to your favorites to see them here.</p>
          <router-link to="/" class="btn-primary">
            Discover Movies
          </router-link>
        </div>

        <!-- Favorites Grid -->
        <div v-else class="space-y-6">
          <!-- Actions -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button
                @click="viewMode = 'grid'"
                class="p-2 rounded-lg transition-colors"
                :class="viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'"
                aria-label="Grid view"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                @click="viewMode = 'list'"
                class="p-2 rounded-lg transition-colors"
                :class="viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'"
                aria-label="List view"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            
            <button
              @click="clearAllFavorites"
              class="flex items-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg border border-red-500/30 transition-all duration-200"
            >
              <TrashIcon class="w-4 h-4" />
              <span class="text-sm font-medium">Clear All</span>
            </button>
          </div>

          <!-- Grid View -->
          <div
            v-if="viewMode === 'grid'"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6"
          >
            <MovieCard
              v-for="(movie, index) in $store.state.favoriteMovies"
              :key="movie.id"
              :movie="movie"
              :lazy-load="false"
              class="fade-in"
              :style="{ animationDelay: `${Math.min(index * 0.05, 1)}s` }"
            />
          </div>

          <!-- List View -->
          <div v-else class="space-y-4">
            <div
              v-for="(movie, index) in $store.state.favoriteMovies"
              :key="movie.id"
              class="flex bg-slate-800/50 rounded-xl overflow-hidden border border-red-500/30 hover:border-red-500/50 transition-all duration-300 fade-in"
              :style="{ animationDelay: `${Math.min(index * 0.02, 0.5)}s` }"
            >
              <router-link :to="`/movieinfo?${movie.id}`" class="block w-20 sm:w-24 flex-shrink-0">
                <img
                  v-if="movie.poster_path"
                  :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`"
                  :alt="movie.title"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-slate-700 flex items-center justify-center">
                  <svg class="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                  </svg>
                </div>
              </router-link>
              
              <div class="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between">
                <div class="flex-1">
                  <router-link :to="`/movieinfo?${movie.id}`">
                    <h3 class="text-white font-semibold mb-1 hover:text-purple-400 transition-colors">
                      {{ movie.title }}
                    </h3>
                  </router-link>
                  <p class="text-slate-400 text-sm mb-2 line-clamp-2">{{ movie.overview }}</p>
                  <div class="flex items-center space-x-4 text-xs text-slate-500">
                    <span>{{ movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A' }}</span>
                    <div class="flex items-center space-x-1">
                      <StarIcon class="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{{ formatRating(movie.vote_average) }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2 mt-3 sm:mt-0">
                  <button
                    @click="removeFavorite(movie)"
                    class="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 transition-colors"
                    aria-label="Remove from favorites"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                  <router-link
                    :to="`/movieinfo?${movie.id}`"
                    class="btn-secondary text-xs px-3 py-2"
                  >
                    Details
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import AppNavbar from '../components/layout/AppNavbar.vue'
import MovieCard from '../components/ui/MovieCard.vue'
import { HeartIcon, TrashIcon, StarIcon } from '@heroicons/vue/24/outline'

export default {
  name: "Favorites",
  components: {
    AppNavbar,
    MovieCard,
    HeartIcon,
    TrashIcon,
    StarIcon
  },
  data() {
    return {
      viewMode: 'grid' // 'grid' or 'list'
    }
  },
  created() {
    // Load favorites from localStorage if they exist
    if (this.$store.state.favoriteMovies.length === 0) {
      const favorites = localStorage.getItem("favoriteMovies")
      if (favorites) {
        try {
          const parsedFavorites = JSON.parse(favorites)
          this.$store.commit('INIT_FAVMOVIES', parsedFavorites)
        } catch (error) {
          console.error('Error parsing favorites:', error)
        }
      }
    }
    
    // Load saved view mode
    const savedViewMode = localStorage.getItem('favoriteViewMode')
    if (savedViewMode) {
      this.viewMode = savedViewMode
    }
  },
  mounted() {
    // Redirect to home if no favorites
    if (this.$store.state.favoriteMovies.length === 0) {
      this.$router.push("/")
    }
  },
  watch: {
    viewMode(newMode) {
      localStorage.setItem('favoriteViewMode', newMode)
    }
  },
  methods: {
    async removeFavorite(movie) {
      try {
        await this.$store.commit('REMOVE_FAVMOVIE', movie)
        
        // Redirect to home if no more favorites
        if (this.$store.state.favoriteMovies.length === 0) {
          this.$router.push("/")
        }
      } catch (error) {
        console.error('Error removing favorite:', error)
      }
    },

    async clearAllFavorites() {
      if (confirm('Are you sure you want to remove all movies from your favorites?')) {
        try {
          localStorage.setItem("favoriteMovies", "")
          this.$store.state.favoriteMovies = []
          this.$router.push('/')
        } catch (error) {
          console.error('Error clearing favorites:', error)
        }
      }
    },

    formatRating(rating) {
      if (!rating) return 'N/A'
      return (rating / 2).toFixed(1)
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}
</style>