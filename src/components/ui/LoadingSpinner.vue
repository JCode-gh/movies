<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <!-- Pulse Loader -->
    <div v-if="variant === 'pulse'" class="flex space-x-1">
      <div
        v-for="i in 3"
        :key="i"
        class="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
        :style="{ animationDelay: `${i * 0.2}s` }"
      ></div>
    </div>

    <!-- Spinner -->
    <div
      v-else-if="variant === 'spinner'"
      class="animate-spin rounded-full border-b-2"
      :class="[
        size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-12 w-12' : 'h-8 w-8',
        `border-${color}-500`
      ]"
    ></div>

    <!-- Dots -->
    <div v-else-if="variant === 'dots'" class="flex space-x-1">
      <div
        v-for="i in 3"
        :key="i"
        class="w-3 h-3 rounded-full animate-bounce"
        :class="`bg-${color}-500`"
        :style="{ animationDelay: `${i * 0.1}s` }"
      ></div>
    </div>

    <!-- Skeleton Bars -->
    <div v-else-if="variant === 'skeleton'" class="space-y-3 w-full">
      <div class="skeleton h-4 w-3/4"></div>
      <div class="skeleton h-4 w-1/2"></div>
      <div class="skeleton h-4 w-5/6"></div>
    </div>

    <!-- Movie Card Skeleton -->
    <div v-else-if="variant === 'movie-card'" class="movie-card p-0 overflow-hidden">
      <div class="skeleton aspect-[2/3] w-full"></div>
      <div class="p-4 space-y-3">
        <div class="skeleton h-4 w-3/4"></div>
        <div class="skeleton h-3 w-1/2"></div>
      </div>
    </div>

    <!-- Grid Skeleton -->
    <div v-else-if="variant === 'grid'" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 w-full">
      <div v-for="i in count" :key="i" class="movie-card p-0 overflow-hidden">
        <div class="skeleton aspect-[2/3] w-full"></div>
        <div class="p-4 space-y-3">
          <div class="skeleton h-4 w-3/4"></div>
          <div class="skeleton h-3 w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Default spinner with text -->
    <div v-else class="text-center">
      <div
        class="animate-spin rounded-full border-b-2 mx-auto mb-4"
        :class="[
          size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-12 w-12' : 'h-8 w-8',
          `border-${color}-500`
        ]"
      ></div>
      <p v-if="text" class="text-white/70 font-medium">{{ text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'spinner', 'pulse', 'dots', 'skeleton', 'movie-card', 'grid'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    color: {
      type: String,
      default: 'purple'
    },
    text: {
      type: String,
      default: ''
    },
    count: {
      type: Number,
      default: 12
    }
  },
  computed: {
    containerClass() {
      if (this.variant === 'grid') {
        return 'w-full'
      }
      return this.size === 'sm' ? 'p-2' : this.size === 'lg' ? 'p-8' : 'p-4'
    }
  }
}
</script>

<style scoped>
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out;
}

/* Stagger animation for dots */
.animate-bounce:nth-child(1) {
  animation-delay: -0.32s;
}

.animate-bounce:nth-child(2) {
  animation-delay: -0.16s;
}
</style> 