<template>
  <div class="container mx-auto p-2 sm:p-4 lg:px-8 min-h-screen w-full md:max-w-2xl lg:max-w-5xl shadow-md my-0 sm:my-6 rounded-lg bg-gray-50">
    <AppHeader></AppHeader>
    <main class="my-0 sm:my-6">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
// Link to Google Fonts
useHead({
  link: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter&display=swap",
      crossorigin: "",
    },
  ],
});
</script>

<style>
body {
  font-family: "Inter", sans-serif;
}
</style>

