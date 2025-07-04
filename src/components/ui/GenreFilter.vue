<template>
  <div class="genre-filter">
    <!-- Desktop Genre Filter -->
    <div class="hidden md:flex items-center space-x-5 glass-effect rounded-xl p-5 mb-6">
      <h3 class="text-white font-semibold text-base">Filter by Genre:</h3>
      <div class="flex flex-wrap gap-2">
        <button
          @click="selectGenre(null)"
          class="genre-chip text-sm px-5 py-2.5"
          :class="{ 'active': selectedGenre === null }"
        >
          All
        </button>
        <button
          v-for="genre in genres"
          :key="genre.id"
          @click="selectGenre(genre.id)"
          class="genre-chip text-sm px-5 py-2.5"
          :class="{ 'active': selectedGenre === genre.id }"
        >
          {{ genre.name }}
        </button>
      </div>
    </div>

    <!-- Mobile Genre Filter -->
    <div class="md:hidden mb-6">
      <button
        @click="showMobileGenres = !showMobileGenres"
        class="w-full glass-effect rounded-xl p-4 flex items-center justify-between"
      >
        <div class="flex items-center space-x-2">
          <FunnelIcon class="w-5 h-5 text-purple-400" />
          <span class="text-white font-medium text-base">
            {{ selectedGenreName || 'All Genres' }}
          </span>
        </div>
        <ChevronDownIcon 
          class="w-5 h-5 text-slate-400 transition-transform"
          :class="{ 'rotate-180': showMobileGenres }"
        />
      </button>

      <!-- Mobile Genre Dropdown -->
      <div
        v-if="showMobileGenres"
        class="mt-2 glass-effect rounded-xl p-4 space-y-2 animate-slide-down"
      >
        <button
          @click="selectGenre(null)"
          class="mobile-genre-item text-base py-3"
          :class="{ 'active': selectedGenre === null }"
        >
          All Genres
        </button>
        <button
          v-for="genre in genres"
          :key="genre.id"
          @click="selectGenre(genre.id)"
          class="mobile-genre-item text-base py-3"
          :class="{ 'active': selectedGenre === genre.id }"
        >
          {{ genre.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { FunnelIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'GenreFilter',
  components: {
    FunnelIcon,
    ChevronDownIcon
  },
  emits: ['genre-selected'],
  data() {
    return {
      genres: [],
      selectedGenre: null,
      showMobileGenres: false,
      isLoading: false
    }
  },
  computed: {
    selectedGenreName() {
      if (!this.selectedGenre) return null
      const genre = this.genres.find(g => g.id === this.selectedGenre)
      return genre ? genre.name : null
    }
  },
  async mounted() {
    await this.fetchGenres()
    
    // Check for saved genre selection
    const savedGenreId = localStorage.getItem('genreIdSelected')
    if (savedGenreId) {
      this.selectedGenre = parseInt(savedGenreId)
    }
  },
  methods: {
    async fetchGenres() {
      this.isLoading = true
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.$store.state.apiKey}&language=en-US`
        )
        const data = await response.json()
        this.genres = data.genres || []
      } catch (error) {
        console.error('Error fetching genres:', error)
      } finally {
        this.isLoading = false
      }
    },

    async selectGenre(genreId) {
      this.selectedGenre = genreId
      this.showMobileGenres = false
      
      // Save selection to localStorage
      if (genreId) {
        localStorage.setItem('genreIdSelected', genreId.toString())
      } else {
        localStorage.removeItem('genreIdSelected')
      }
      
      // Emit the selection
      this.$emit('genre-selected', genreId)
    }
  }
}
</script>

<style scoped>
.genre-chip {
  @apply px-4 py-2 rounded-full text-sm font-medium transition-all duration-200;
  @apply bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white;
  @apply border border-slate-600/30 hover:border-slate-500/50;
}

.genre-chip.active {
  @apply bg-gradient-to-r from-purple-600 to-blue-600 text-white;
  @apply border-purple-500/50 shadow-lg shadow-purple-500/25;
}

.mobile-genre-item {
  @apply w-full text-left px-4 py-3 rounded-lg text-slate-300 hover:text-white;
  @apply hover:bg-slate-700/50 transition-all duration-200 font-medium;
}

.mobile-genre-item.active {
  @apply bg-gradient-to-r from-purple-600 to-blue-600 text-white;
  @apply shadow-lg shadow-purple-500/25;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-down {
  animation: slideDown 0.2s ease-out;
}
</style> 