<template>
  <div 
    class="group relative bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-600/30 hover:border-purple-500/50 transition-all duration-300"
  >
    <!-- Poster Image -->
    <router-link :to="`/movieinfo?${movie.id}`" class="block aspect-[2/3]">
      <img
        v-if="movie.poster_path"
        :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`"
        :alt="movie.title"
        class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
      />
      <div v-else class="w-full h-full bg-slate-700 flex items-center justify-center">
        <svg class="w-12 h-12 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
        </svg>
      </div>
    </router-link>

    <!-- Movie Info -->
    <div class="p-4">
      <router-link :to="`/movieinfo?${movie.id}`">
        <h3 class="text-base sm:text-lg font-semibold text-white mb-2 line-clamp-2 hover:text-purple-400 transition-colors">
          {{ movie.title }}
        </h3>
      </router-link>
      
      <div class="flex items-center justify-between text-sm mb-3">
        <span class="text-slate-400">
          {{ movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A' }}
        </span>
        <div class="flex items-center space-x-1">
          <StarIcon class="w-4 h-4 text-yellow-400 fill-current" />
          <span class="text-white font-medium">{{ formatRating(movie.vote_average) }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-between mt-3">
        <button
          @click="toggleFavorite"
          class="p-2.5 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
          :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
        >
          <HeartIcon
            class="w-5 h-5 transition-colors"
            :class="isFavorite ? 'text-red-500 fill-current' : 'text-slate-400'"
          />
        </button>
        <router-link
          :to="`/movieinfo?${movie.id}`"
          class="btn-secondary text-sm px-4 py-2"
        >
          Details
        </router-link>
      </div>
    </div>

    <!-- Watched Badge -->
    <div 
      v-if="isWatched"
      class="absolute top-2 right-2 bg-green-500/90 text-white px-2 py-0.5 rounded-full text-sm font-medium shadow-lg"
    >
      Watched
    </div>
  </div>
</template>

<script>
import {
  HeartIcon,
  StarIcon,
  PlayIcon,
  UserGroupIcon,
  EyeIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'MovieCard',
  components: {
    HeartIcon,
    StarIcon,
    PlayIcon,
    UserGroupIcon,
    EyeIcon,
    CheckCircleIcon
  },
  props: {
    movie: {
      type: Object,
      required: true
    },
    showOverview: {
      type: Boolean,
      default: false
    },
    showWatchButton: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentImageSize: 'w342'
    }
  },
  computed: {
    isFavorite() {
      if (!this.movie) return false
      const favorites = this.$store.state.favoriteMovies || []
      return favorites.some(fav => fav.id === this.movie.id)
    },
    isWatched() {
      return this.$store.getters.isMovieWatched(this.movie.id)
    },
    watchedDate() {
      return this.$store.getters.getWatchedDate(this.movie.id)
    },
    posterUrl() {
      if (!this.movie.poster_path) return '/assets/placeholder.png'
      return `https://image.tmdb.org/t/p/${this.currentImageSize}${this.movie.poster_path}`
    }
  },
  methods: {
    handleImageError() {
      // Try larger image size if current one fails
      if (this.currentImageSize === 'w342') {
        this.currentImageSize = 'w500'
      } else if (this.currentImageSize === 'w500') {
        this.currentImageSize = 'original'
      }
    },
    async toggleFavorite() {
      try {
        if (this.isFavorite) {
          await this.$store.commit('REMOVE_FAVMOVIE', this.movie)
        } else {
          await this.$store.commit('SET_FAVMOVIES', this.movie)
        }
      } catch (error) {
        console.error('Error toggling favorite:', error)
      }
    },
    toggleWatched() {
      this.$store.commit('TOGGLE_WATCHED_MOVIE', this.movie)
    },
    openHomepage() {
      if (this.movie.homepage) {
        window.open(this.movie.homepage, '_blank', 'noopener,noreferrer')
      }
    },
    formatRating(rating) {
      if (!rating) return 'N/A'
      return (rating / 2).toFixed(1)
    },
    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString()
    },
    formatPopularity(popularity) {
      if (!popularity) return '0'
      return popularity > 1000 
        ? `${(popularity / 1000).toFixed(1)}k`
        : Math.round(popularity)
    }
  }
}
</script>

<style scoped>
.movie-card {
  @apply rounded-2xl overflow-hidden transition-all duration-300;
}

.card-hover {
  @apply hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300;
}

.favorite {
  @apply ring-2 ring-purple-500/50;
}

.watched {
  @apply ring-2 ring-green-500/50;
}
</style> 