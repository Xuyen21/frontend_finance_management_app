<template>
  <div class="text-center">
    <h1 class="text-4xl font-extrabold text-green-600 mb-4">
      Welcome to
    </h1>
    <h1 class="text-4xl font-extrabold text-green-600 mb-4">
      Finance Management App
    </h1>
    <p class="text-lg text-gray-700 mb-6">
      Track your finances easily and effectively. Sign in with your email to get started!
    </p>
    <UButton v-if="!showLogin" @click="$emit('showLogin')" label="Get Started" />
  </div>
</template>

<script setup>
const props = defineProps({
  showLogin: {
    type: Boolean,
    required: true
  }
});
</script>

<style scoped>
/* */
</style>
