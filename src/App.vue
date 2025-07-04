<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    
    <!-- Global loading overlay -->
    <div v-if="$store.state.isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="glass-effect rounded-2xl p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p class="text-white font-medium">Loading...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  async created() {
    // Initialize favorites from localStorage
    const favoriteMoviesStorageData = localStorage.getItem("favoriteMovies");
    if (favoriteMoviesStorageData) {
      try {
        const favorites = JSON.parse(favoriteMoviesStorageData);
        await this.$store.commit("INIT_FAVMOVIES", favorites);
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        localStorage.removeItem("favoriteMovies");
      }
    }

    // Initialize watched movies
    this.$store.commit('INIT_WATCHED_MOVIES');
  }
};
</script>

<style>
/* Vue transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

/* Improve tap targets for mobile */
@media (max-width: 768px) {
  button, a, [role="button"] {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Focus styles for accessibility */
*:focus-visible {
  outline: 2px solid theme('colors.purple.500');
  outline-offset: 2px;
}

/* Hide scrollbar but keep functionality */
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
