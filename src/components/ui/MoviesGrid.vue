<template>
  <div class="movies-grid">
    <!-- No Results State -->
    <div v-if="!isLoading && !hasResults" class="no-results">
      <div class="text-center py-20">
        <div class="w-24 h-24 mx-auto mb-6 text-slate-400">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clip-rule="evenodd" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">No Movies Found</h2>
        <p class="text-slate-400 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
        <button
          @click="$emit('clear-filters')"
          class="btn-primary"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Movies Grid -->
    <div v-else-if="movies.length > 0" class="space-y-6">
      <!-- Results Count and Controls -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p class="text-slate-400 text-sm">
          {{ totalResults ? `${totalResults.toLocaleString()} movies found` : `${movies.length} movies` }}
        </p>
        <div class="flex items-center gap-4">
          <!-- Sort Controls -->
          <div class="flex items-center gap-2">
            <select 
              v-model="sortBy" 
              class="bg-slate-800 text-white border border-slate-600 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-purple-500"
              @change="handleSort"
            >
              <option value="popularity">Sort by</option>
              <option value="vote_average">Rating</option>
              <option value="release_date">Release Date</option>
              <option value="title">Title</option>
              <option value="popularity">Popularity</option>
            </select>
            <button 
              @click="toggleSortDirection" 
              class="p-2 rounded-lg bg-slate-800 border border-slate-600 hover:bg-slate-700 transition-colors"
              :aria-label="sortDirection === 'desc' ? 'Sort ascending' : 'Sort descending'"
            >
              <svg 
                class="w-4 h-4 text-white"
                :class="{ 'rotate-180': sortDirection === 'asc' }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <!-- View Mode Toggles -->
          <div class="flex items-center space-x-2">
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
        </div>
      </div>

      <!-- Grid View -->
      <div
        v-if="viewMode === 'grid'"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6"
      >
        <MovieCard
          v-for="(movie, index) in displayMovies"
          :key="`${movie.id}-${index}`"
          :movie="movie"
          class="fade-in"
          :style="{ animationDelay: `${Math.min(index * 0.05, 1)}s` }"
        />
      </div>

      <!-- List View -->
      <div v-else class="space-y-4">
        <div
          v-for="(movie, index) in displayMovies"
          :key="movie.id"
          class="flex bg-slate-800/50 rounded-xl overflow-hidden border border-slate-600/30 hover:border-purple-500/50 transition-all duration-300 fade-in"
          :style="{ animationDelay: `${Math.min(index * 0.02, 0.5)}s` }"
        >
          <router-link :to="`/movieinfo?${movie.id}`" class="block w-24 sm:w-36 flex-shrink-0">
            <img
              v-if="movie.poster_path"
              :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`"
              :alt="movie.title"
              class="w-full h-full object-cover"
              :loading="index > 6 ? 'lazy' : 'eager'"
            />
            <div v-else class="w-full h-full bg-slate-700 flex items-center justify-center">
              <svg class="w-10 h-10 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
              </svg>
            </div>
          </router-link>
          
          <div class="flex-1 p-5 flex flex-col sm:flex-row sm:items-center justify-between">
            <div class="flex-1">
              <router-link :to="`/movieinfo?${movie.id}`">
                <h3 class="text-lg sm:text-xl text-white font-semibold mb-2 hover:text-purple-400 transition-colors">
                  {{ movie.title }}
                </h3>
              </router-link>
              <p class="text-slate-400 text-sm sm:text-base mb-3 line-clamp-2">{{ movie.overview }}</p>
              <div class="flex items-center space-x-4 text-sm text-slate-500">
                <span>{{ movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A' }}</span>
                <div class="flex items-center space-x-1">
                  <StarIcon class="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{{ formatRating(movie.vote_average) }}</span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-2 mt-4 sm:mt-0">
              <button
                @click="toggleFavorite(movie)"
                class="p-2.5 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
                :aria-label="isFavorite(movie) ? 'Remove from favorites' : 'Add to favorites'"
              >
                <HeartIcon
                  class="w-5 h-5 transition-colors"
                  :class="isFavorite(movie) ? 'text-red-500 fill-current' : 'text-slate-400'"
                />
              </button>
              <router-link
                :to="`/movieinfo?${movie.id}`"
                class="btn-secondary text-sm px-5 py-2.5"
              >
                Details
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading More Indicator -->
      <div v-if="isLoadingMore" class="flex justify-center py-8">
        <div class="flex items-center space-x-2 text-slate-400">
          <div class="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Loading more movies...</span>
        </div>
      </div>

      <!-- Infinite Scroll Sentinel -->
      <div ref="sentinel" class="h-20 -mt-20"></div>
    </div>

    <!-- Initial Loading State -->
    <div v-else-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      <div v-for="n in 12" :key="n" class="aspect-[2/3] rounded-2xl bg-slate-800/50 animate-pulse"></div>
    </div>
  </div>
</template>

<script>
import MovieCard from './MovieCard.vue'
import LoadingSpinner from './LoadingSpinner.vue'
import { HeartIcon, StarIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'MoviesGrid',
  components: {
    MovieCard,
    LoadingSpinner,
    HeartIcon,
    StarIcon
  },
  props: {
    movies: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isLoadingMore: {
      type: Boolean,
      default: false
    },
    hasResults: {
      type: Boolean,
      default: true
    },
    canLoadMore: {
      type: Boolean,
      default: false
    },
    totalResults: {
      type: Number,
      default: null
    },
    enableInfiniteScroll: {
      type: Boolean,
      default: true
    }
  },
  emits: ['load-more', 'clear-filters'],
  data() {
    return {
      viewMode: 'grid',
      observer: null,
      sortBy: 'popularity',
      sortDirection: 'desc',
      sortedMovies: []
    }
  },
  computed: {
    displayMovies() {
      return this.sortedMovies.length > 0 ? this.sortedMovies : this.movies
    }
  },
  mounted() {
    this.setupInfiniteScroll()
  },
  beforeUnmount() {
    this.cleanupInfiniteScroll()
  },
  activated() {
    // Re-setup infinite scroll when component is re-activated (for keep-alive)
    this.setupInfiniteScroll()
  },
  deactivated() {
    // Cleanup when component is deactivated (for keep-alive)
    this.cleanupInfiniteScroll()
  },
  methods: {
    cleanupInfiniteScroll() {
      if (this.observer) {
        this.observer.disconnect()
        this.observer = null
      }
    },
    setupInfiniteScroll() {
      // Clean up any existing observer
      this.cleanupInfiniteScroll()

      // Create intersection observer for infinite scroll
      this.observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry.isIntersecting && this.canLoadMore && !this.isLoadingMore) {
            this.$emit('load-more')
          }
        },
        {
          rootMargin: '200px', // Start loading before reaching the end
          threshold: 0.1
        }
      )

      // Start observing the sentinel element
      this.$nextTick(() => {
        const sentinel = this.$refs.sentinel
        if (sentinel) {
          this.observer.observe(sentinel)
        }
      })
    },
    formatRating(rating) {
      if (!rating) return 'N/A'
      return (rating / 2).toFixed(1)
    },
    isFavorite(movie) {
      return this.$store.state.favoriteMovies.some(fav => fav.id === movie.id)
    },
    toggleFavorite(movie) {
      if (this.isFavorite(movie)) {
        this.$store.commit('REMOVE_FAVMOVIE', movie)
      } else {
        this.$store.commit('SET_FAVMOVIES', movie)
      }
    },
    handleSort() {
      this.sortMovies(this.movies)
    },
    toggleSortDirection() {
      this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc'
      this.sortMovies(this.movies)
    },
    sortMovies(movies) {
      if (!movies.length) return

      // If we're not sorting by anything specific, just use the original array
      if (this.sortBy === 'popularity' && this.sortDirection === 'desc') {
        this.sortedMovies = []
        return
      }

      const sorted = [...movies].sort((a, b) => {
        let valueA, valueB

        switch (this.sortBy) {
          case 'vote_average':
            valueA = a.vote_average || 0
            valueB = b.vote_average || 0
            break
          case 'release_date':
            valueA = a.release_date ? new Date(a.release_date).getTime() : 0
            valueB = b.release_date ? new Date(b.release_date).getTime() : 0
            break
          case 'title':
            valueA = a.title.toLowerCase()
            valueB = b.title.toLowerCase()
            break
          case 'popularity':
          default:
            valueA = a.popularity || 0
            valueB = b.popularity || 0
            break
        }

        if (this.sortDirection === 'asc') {
          return valueA > valueB ? 1 : -1
        } else {
          return valueA < valueB ? 1 : -1
        }
      })

      this.sortedMovies = sorted
    }
  },
  watch: {
    movies: {
      immediate: true,
      handler(newMovies) {
        // Only sort if we have a custom sort active
        if (this.sortBy !== 'popularity' || this.sortDirection !== 'desc') {
          this.sortMovies(newMovies)
        } else {
          this.sortedMovies = []
        }
        // Reinitialize infinite scroll when movies change
        this.$nextTick(() => {
          this.setupInfiniteScroll()
        })
      }
    },
    enableInfiniteScroll: {
      handler(newValue) {
        if (newValue) {
          this.$nextTick(() => {
            this.setupInfiniteScroll()
          })
        } else {
          this.cleanupInfiniteScroll()
        }
      }
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