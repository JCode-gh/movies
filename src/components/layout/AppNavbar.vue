<template>
  <nav 
    class="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50"
    role="navigation"
    aria-label="Main navigation"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center space-x-4">
          <router-link to="/" class="flex items-center space-x-2 group">
            <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
              </svg>
            </div>
            <span class="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
              CineHub
            </span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-6">
          <router-link
            to="/"
            class="nav-link"
            :class="{ 'active': $route.path === '/' }"
          >
            <HomeIcon class="w-4 h-4" />
            <span>Home</span>
          </router-link>
          
          <router-link
            to="/newestmovies"
            class="nav-link"
            :class="{ 'active': $route.path === '/newestmovies' }"
          >
            <SparklesIcon class="w-4 h-4" />
            <span>Latest</span>
          </router-link>
          
          <router-link
            v-if="$store.state.favoriteMovies.length > 0"
            to="/favorites"
            class="nav-link relative"
            :class="{ 'active': $route.path === '/favorites' }"
          >
            <HeartIcon class="w-4 h-4" />
            <span>Favorites</span>
            <span class="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ $store.state.favoriteMovies.length }}
            </span>
          </router-link>
        </div>

        <!-- Search Bar -->
        <div class="hidden sm:block flex-1 max-w-md mx-6">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              v-model="searchQuery"
              @keypress="handleKeyPress"
              placeholder="Search movies..."
              class="input-field pl-10 pr-4 py-2 w-full"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <XMarkIcon class="h-5 w-5 text-slate-400 hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        <!-- Right Side Controls -->
        <div class="flex items-center space-x-4">
          <!-- Mobile Search Toggle -->
          <button
            @click="showMobileSearch = !showMobileSearch"
            class="sm:hidden p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            aria-label="Toggle search"
          >
            <MagnifyingGlassIcon class="w-5 h-5 text-white" />
          </button>

          <!-- Mobile Menu Toggle -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            aria-label="Toggle menu"
          >
            <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6 text-white" />
            <XMarkIcon v-else class="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <!-- Mobile Search Bar -->
      <div v-if="showMobileSearch" class="sm:hidden pb-4 animate-slide-down">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            v-model="searchQuery"
            @keypress="handleKeyPress"
            placeholder="Search movies..."
            class="input-field pl-10 pr-4 py-3 w-full"
          />
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <XMarkIcon class="h-5 w-5 text-slate-400 hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden bg-slate-800/95 backdrop-blur-md border-t border-slate-700/50 animate-slide-down"
    >
      <div class="px-4 py-4 space-y-3">
        <router-link
          to="/"
          @click="mobileMenuOpen = false"
          class="mobile-nav-link"
          :class="{ 'active': $route.path === '/' }"
        >
          <HomeIcon class="w-5 h-5" />
          <span>Home</span>
        </router-link>
        
        <router-link
          to="/newestmovies"
          @click="mobileMenuOpen = false"
          class="mobile-nav-link"
          :class="{ 'active': $route.path === '/newestmovies' }"
        >
          <SparklesIcon class="w-5 h-5" />
          <span>Latest Movies</span>
        </router-link>
        
        <router-link
          v-if="$store.state.favoriteMovies.length > 0"
          to="/favorites"
          @click="mobileMenuOpen = false"
          class="mobile-nav-link relative"
          :class="{ 'active': $route.path === '/favorites' }"
        >
          <HeartIcon class="w-5 h-5" />
          <span>Favorites ({{ $store.state.favoriteMovies.length }})</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import {
  HomeIcon,
  HeartIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/vue/24/outline'
import debounce from 'lodash.debounce'

export default {
  name: 'AppNavbar',
  components: {
    HomeIcon,
    HeartIcon,
    SparklesIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    Bars3Icon,
  },
  data() {
    return {
      searchQuery: '',
      mobileMenuOpen: false,
      showMobileSearch: false
    }
  },
  watch: {
    searchQuery(newValue) {
      this.debouncedSearch(newValue);
    },
    $route() {
      // Close mobile menu when route changes
      this.mobileMenuOpen = false;
      this.showMobileSearch = false;
    }
  },
  created() {
    // Create debounced search function
    this.debouncedSearch = debounce(this.performSearch, 300)
  },
  methods: {
    async performSearch() {
      if (!this.searchQuery.trim()) {
        await this.showPopularMovies()
        return
      }

      if (this.searchQuery === this.$store.state.userinput) return

      this.$store.commit('SET_LOADING', true)
      this.$store.state.userinput = this.searchQuery
      this.$store.commit('CLEAR_SEARCHEDRESULT')

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${this.$store.state.apiKey}&language=en-US&query=${encodeURIComponent(this.searchQuery)}&page=1&include_adult=false`
        )
        const movies = await response.json()
        this.$store.commit('MAKE_UNIQUE_SEARCHEDRESULT', movies.results)
        this.$store.commit('SET_PAGINATION', {
          currentPage: movies.page,
          totalPages: movies.total_pages
        })
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        this.$store.commit('SET_LOADING', false)
      }
    },

    async showPopularMovies() {
      this.$store.commit('SET_LOADING', true)
      localStorage.removeItem('genreIndexSelected')
      localStorage.removeItem('genreIdSelected')
      this.$store.commit('CLEAR_USERINPUT')
      this.$store.commit('SET_HASRESULTS_TRUE')
      this.$store.commit('CLEAR_SEARCHEDRESULT')

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${this.$store.state.apiKey}&language=en-US&page=1`
        )
        const movies = await response.json()
        this.$store.commit('INSERT_MOVIES_SEARCHEDRESULT', movies.results)
        this.$store.commit('SET_PAGINATION', {
          currentPage: movies.page,
          totalPages: movies.total_pages
        })
      } catch (error) {
        console.error('Error loading popular movies:', error)
      } finally {
        this.$store.commit('SET_LOADING', false)
      }
    },

    handleKeyPress(e) {
      if (e.key === 'Enter') {
        this.performSearch()
      }
    },

    clearSearch() {
      this.searchQuery = ''
      this.showPopularMovies()
    },

    skipToContent(event) {
      event.preventDefault()
      const mainContent = document.getElementById('main-content')
      if (mainContent) {
        mainContent.focus()
        mainContent.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
}
</script>

<style scoped>
.nav-link {
  @apply flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 font-medium;
}

.nav-link.active {
  @apply text-white bg-purple-600/20 border border-purple-500/30;
}

.mobile-nav-link {
  @apply flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 font-medium;
}

.mobile-nav-link.active {
  @apply text-white bg-purple-600/20 border border-purple-500/30;
}

/* Custom animations */
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