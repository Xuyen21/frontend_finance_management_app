<template>
  <UCard>
    <template #header>Signing in..</template>
    Just a moment to sign you in..
  </UCard>
</template>

<script setup>
useRedirecting();
definePageMeta({
  layout: 'login',
});
</script>