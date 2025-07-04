<template>
  <div 
    class="lazy-image-container" 
    :class="containerClass"
    :style="{ aspectRatio: aspectRatio }"
  >
    <!-- Loading State -->
    <div
      v-if="!loaded && !error"
      class="absolute inset-0 flex items-center justify-center bg-slate-700/50 animate-pulse"
      :aria-label="loadingLabel"
    >
      <div class="w-8 h-8 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="absolute inset-0 flex flex-col items-center justify-center bg-slate-700/50 text-slate-400"
      :aria-label="errorLabel"
    >
      <svg class="w-12 h-12 mb-2" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
      </svg>
      <span class="text-xs text-center px-2">{{ errorText }}</span>
    </div>

    <!-- Actual Image -->
    <img
      ref="image"
      :src="shouldLoad ? currentImageSrc : ''"
      :alt="alt"
      :loading="lazyLoad ? 'lazy' : 'eager'"
      :class="imageClass"
      :style="imageStyle"
      @load="onLoad"
      @error="onError"
      v-show="loaded && !error"
    />

    <!-- Blur Placeholder -->
    <div
      v-if="blurPlaceholder && !loaded"
      class="absolute inset-0 bg-center bg-cover filter blur-sm"
      :style="{ backgroundImage: `url(${blurPlaceholder})` }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'LazyImage',
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    },
    aspectRatio: {
      type: String,
      default: 'auto'
    },
    lazyLoad: {
      type: Boolean,
      default: true
    },
    rootMargin: {
      type: String,
      default: '50px'
    },
    blurPlaceholder: {
      type: String,
      default: ''
    },
    containerClass: {
      type: String,
      default: 'relative overflow-hidden'
    },
    imageClass: {
      type: String,
      default: 'w-full h-full object-cover'
    },
    imageStyle: {
      type: Object,
      default: () => ({})
    },
    errorText: {
      type: String,
      default: 'Failed to load image'
    },
    loadingLabel: {
      type: String,
      default: 'Loading image...'
    },
    errorLabel: {
      type: String,
      default: 'Error loading image'
    }
  },
  data() {
    return {
      loaded: false,
      error: false,
      inView: false,
      observer: null,
      currentSrcIndex: 0,
      fallbackSizes: ['w342', 'w500', 'original']
    }
  },
  computed: {
    shouldLoad() {
      return !this.lazyLoad || this.inView
    },
    currentImageSrc() {
      if (!this.src) return '/assets/placeholder.png'
      
      // If it's a TMDB URL, try different sizes
      if (this.src.includes('image.tmdb.org')) {
        const basePath = this.src.split('/').pop()
        const size = this.fallbackSizes[this.currentSrcIndex]
        return `https://image.tmdb.org/t/p/${size}/${basePath}`
      }
      
      return this.src
    }
  },
  watch: {
    src: {
      immediate: true,
      handler(newSrc) {
        if (newSrc) {
          this.error = false
          this.loaded = false
          this.currentSrcIndex = 0
          this.setupIntersectionObserver()
        }
      }
    }
  },
  mounted() {
    this.setupIntersectionObserver()
  },
  beforeUnmount() {
    this.cleanup()
  },
  methods: {
    cleanup() {
      if (this.observer) {
        this.observer.disconnect()
        this.observer = null
      }
    },
    setupIntersectionObserver() {
      if (!this.lazyLoad) {
        this.inView = true
        return
      }

      this.cleanup()

      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(
          (entries) => {
            const entry = entries[0]
            if (entry.isIntersecting) {
              this.inView = true
              // Keep observing in case the image needs to be reloaded
              if (!this.loaded && !this.error) {
                this.retryWithCurrentSize()
              }
            }
          },
          {
            rootMargin: this.rootMargin,
            threshold: 0.01
          }
        )
        
        this.$nextTick(() => {
          if (this.$el) {
            this.observer.observe(this.$el)
          }
        })
      } else {
        this.inView = true
      }
    },

    onLoad() {
      this.loaded = true
      this.error = false
      this.$emit('load')
    },

    onError() {
      // Try next image size if available
      if (this.src.includes('image.tmdb.org') && this.currentSrcIndex < this.fallbackSizes.length - 1) {
        this.currentSrcIndex++
        this.retryWithCurrentSize()
      } else {
        this.loaded = false
        this.error = true
        this.$emit('error')
      }
    },

    retryWithCurrentSize() {
      if (this.$refs.image) {
        const img = this.$refs.image
        img.src = this.currentImageSrc
      }
    },

    retry() {
      this.loaded = false
      this.error = false
      this.currentSrcIndex = 0
      this.setupIntersectionObserver()
    }
  }
}
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  background-color: #334155; /* slate-700 */
}

/* Smooth transition when image loads */
img {
  transition: opacity 0.3s ease-in-out;
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  img {
    transition: none;
  }
  
  .animate-spin {
    animation: none;
  }
  
  .animate-pulse {
    animation: none;
  }
}
</style> 