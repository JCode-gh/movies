<template>
  <div v-if="movie" class="movie-details">
    <!-- Hero Section with Backdrop -->
    <div class="relative min-h-screen">
      <!-- Backdrop Image -->
      <div 
        class="absolute inset-0 z-0"
        :style="backdropStyle"
      >
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/30"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 pt-8 pb-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Back Button -->
          <button
            @click="goBack"
            class="mb-6 flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeftIcon class="w-5 h-5" />
            <span>Back</span>
          </button>

          <!-- Movie Header -->
          <div class="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <!-- Poster -->
            <div class="lg:col-span-1">
              <div class="sticky top-24">
                <div class="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                  <img
                    v-if="movie.poster_path"
                    :src="posterUrl"
                    :alt="movie.title"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full bg-slate-700 flex items-center justify-center">
                    <svg class="w-16 h-16 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="mt-6 space-y-3">
                  <button
                    @click="toggleFavorite"
                    class="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200"
                    :class="isFavorite ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'"
                  >
                    <HeartIcon class="w-5 h-5" :class="{ 'fill-current': isFavorite }" />
                    <span>{{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}</span>
                  </button>

                  <button
                    v-if="movie.homepage && movie.homepage.includes('netflix')"
                    @click="openWebsite"
                    class="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-200"
                  >
                    <PlayIcon class="w-5 h-5" />
                    <span>Watch on Netflix</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Movie Info -->
            <div class="lg:col-span-2">
              <div class="space-y-6">
                <!-- Title and Basic Info -->
                <div>
                  <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 text-shadow">
                    {{ movie.title }}
                  </h1>
                  
                  <div class="flex flex-wrap items-center gap-4 text-slate-300 mb-4">
                    <div class="flex items-center space-x-1">
                      <CalendarIcon class="w-4 h-4" />
                      <span>{{ formatDate(movie.release_date) }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <ClockIcon class="w-4 h-4" />
                      <span>{{ movie.runtime ? movie.runtime + ' min' : 'N/A' }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <StarIcon class="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{{ formatRating(movie.vote_average) }}/5</span>
                      <span class="text-slate-400">({{ movie.vote_count?.toLocaleString() || 0 }} votes)</span>
                    </div>
                  </div>

                  <!-- Genres -->
                  <div v-if="movie.genres && movie.genres.length > 0" class="flex flex-wrap gap-2 mb-6">
                    <span
                      v-for="genre in movie.genres"
                      :key="genre.id"
                      class="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                    >
                      {{ genre.name }}
                    </span>
                  </div>

                  <!-- Overview -->
                  <div class="mb-8">
                    <h2 class="text-xl font-semibold text-white mb-3">Overview</h2>
                    <p class="text-slate-300 leading-relaxed text-lg">
                      {{ movie.overview || 'No overview available.' }}
                    </p>
                  </div>

                  <!-- Additional Details -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div v-if="movie.budget" class="space-y-2">
                      <h3 class="text-sm font-medium text-slate-400 uppercase tracking-wide">Budget</h3>
                      <p class="text-white font-semibold">${{ formatCurrency(movie.budget) }}</p>
                    </div>
                    
                    <div v-if="movie.revenue" class="space-y-2">
                      <h3 class="text-sm font-medium text-slate-400 uppercase tracking-wide">Revenue</h3>
                      <p class="text-white font-semibold">${{ formatCurrency(movie.revenue) }}</p>
                    </div>
                    
                    <div v-if="movie.production_companies && movie.production_companies.length > 0" class="space-y-2">
                      <h3 class="text-sm font-medium text-slate-400 uppercase tracking-wide">Production</h3>
                      <p class="text-white">{{ movie.production_companies.map(c => c.name).join(', ') }}</p>
                    </div>
                    
                    <div v-if="movie.spoken_languages && movie.spoken_languages.length > 0" class="space-y-2">
                      <h3 class="text-sm font-medium text-slate-400 uppercase tracking-wide">Languages</h3>
                      <p class="text-white">{{ movie.spoken_languages.map(l => l.english_name || l.name).join(', ') }}</p>
                    </div>
                  </div>

                  <!-- Star Rating -->
                  <div class="mb-8">
                    <star-rating
                      :rating="movie.vote_average / 2"
                      :increment="0.2"
                      :read-only="true"
                      :show-rating="false"
                      :star-size="24"
                      active-color="#fbbf24"
                      inactive-color="#475569"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Trailer Section -->
          <div v-if="trailerKey" class="mt-16">
            <div class="max-w-4xl mx-auto">
              <h2 class="text-2xl font-bold text-white mb-6 text-center">Trailer</h2>
              <div class="aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                <iframe
                  :src="`https://www.youtube.com/embed/${trailerKey}`"
                  title="Movie Trailer"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  class="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>

          <!-- Collection Movies -->
          <div v-if="collectionMovies.length > 0" class="mt-16">
            <h2 class="text-2xl font-bold text-white mb-6">More from this Collection</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <MovieCard
                v-for="collectionMovie in collectionMovies"
                :key="collectionMovie.id"
                :movie="collectionMovie"
                :lazy-load="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text="Loading movie details..." />
  </div>
</template>

<script>
import MovieCard from '../ui/MovieCard.vue'
import LoadingSpinner from '../ui/LoadingSpinner.vue'
import {
  ArrowLeftIcon,
  HeartIcon,
  PlayIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'MovieDetails',
  components: {
    MovieCard,
    LoadingSpinner,
    ArrowLeftIcon,
    HeartIcon,
    PlayIcon,
    CalendarIcon,
    ClockIcon,
    StarIcon
  },
  data() {
    return {
      movie: null,
      trailerKey: null,
      collectionMovies: []
    }
  },
  computed: {
    isFavorite() {
      if (!this.movie) return false
      const favorites = this.$store.state.favoriteMovies || []
      return favorites.some(fav => fav.id === this.movie.id)
    },
    posterUrl() {
      if (!this.movie?.poster_path) return ''
      return `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`
    },
    backdropStyle() {
      if (!this.movie?.backdrop_path) {
        return {
          backgroundColor: '#1e293b'
        }
      }
      return {
        backgroundImage: `url(https://image.tmdb.org/t/p/w1280${this.movie.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    }
  },
  async created() {
    await this.loadMovieDetails()
  },
  methods: {
    async loadMovieDetails() {
      const queryString = window.location.search
      const movieId = queryString.split("?")[1]

      if (!movieId) {
        this.$router.push('/')
        return
      }

      this.$store.commit('SET_LOADING', true)

      try {
        // Fetch movie details
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${this.$store.state.apiKey}&language=en-US`
        )
        this.movie = await response.json()

        // Fetch trailer
        this.fetchTrailer(movieId)

        // Fetch collection movies if movie is part of a collection
        if (this.movie.belongs_to_collection) {
          this.fetchCollectionMovies(this.movie.original_title)
        }

      } catch (error) {
        console.error('Error loading movie details:', error)
        this.$router.push('/')
      } finally {
        this.$store.commit('SET_LOADING', false)
      }
    },

    async fetchTrailer(movieId) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${this.$store.state.apiKey}&language=en-US`
        )
        const data = await response.json()
        
        if (data.results && data.results.length > 0) {
          // Find first trailer or teaser
          const trailer = data.results.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
          ) || data.results.find(video => 
            video.type === 'Teaser' && video.site === 'YouTube'
          ) || data.results[0]
          
          if (trailer) {
            this.trailerKey = trailer.key
          }
        }
      } catch (error) {
        console.error('Error fetching trailer:', error)
      }
    },

    async fetchCollectionMovies(originalTitle) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/collection?api_key=${this.$store.state.apiKey}&language=en-US&query=${encodeURIComponent(originalTitle)}`
        )
        const data = await response.json()
        
        if (data.results && data.results.length > 0) {
          // Get first 6 collection movies, excluding current movie
          this.collectionMovies = data.results
            .filter(movie => movie.id !== this.movie.id)
            .slice(0, 6)
        }
      } catch (error) {
        console.error('Error fetching collection movies:', error)
      }
    },

    async toggleFavorite() {
      if (!this.movie) return
      
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

    openWebsite() {
      if (this.movie?.homepage) {
        window.open(this.movie.homepage, '_blank', 'noopener,noreferrer')
      }
    },

    async addToPlexServer() {
      if (!this.movie?.title) return
      
      try {
        const response = await fetch('http://192.168.0.136:3000/download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.movie.title,
          }),
        })
        
        const data = await response.json()
        alert(data.message || 'Request sent to Plex server')
        
      } catch (error) {
        console.error('Error adding to Plex:', error)
        alert('Error connecting to Plex server')
      }
    },

    goBack() {
      if (window.history.length > 1) {
        this.$router.go(-1)
      } else {
        this.$router.push('/')
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'Unknown'
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch {
        return 'Unknown'
      }
    },

    formatRating(rating) {
      if (!rating) return 'N/A'
      return (rating / 2).toFixed(1)
    },

    formatCurrency(amount) {
      if (!amount) return 'N/A'
      return amount.toLocaleString()
    }
  }
}
</script>

<style scoped>
.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* Ensure proper line height for overview text */
.leading-relaxed {
  line-height: 1.75;
}
</style> 