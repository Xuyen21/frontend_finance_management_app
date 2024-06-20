<template>
  <div class="flex flex-col lg:flex-row gap-8 p-6 bg-white rounded-lg shadow-lg">
    <!-- Sidebar Navigation -->
    <div class="w-full lg:w-2/5">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Settings</h2>
        <p class="text-gray-600">Manage your profile and preferences</p>
      </div>
      <ul>
        <li
          v-for="link in links"
          :key="link.name"
          @click="selectedSetting = link.name"
          class="flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-200 text-gray-800"
          :class="{ 'bg-gray-200': selectedSetting === link.name }"
        >
          <i :class="link.icon" class="h-5 w-5 text-gray-700"></i>
          <span>{{ link.label }}</span>
        </li>
      </ul>
    </div>
    <!-- Main Content -->
    <div class="w-full lg:w-3/5">
      <SettingsProfile v-if="selectedSetting === 'Profile'" />
      <SettingsAvatar v-if="selectedSetting === 'Avatar'" />
      <SettingsGeneral v-if="selectedSetting === 'Settings'" />
    </div>
  </div>
</template>

<script setup>
const selectedSetting = ref('Profile');
const links = [
  {
    name: 'Profile',
    label: 'Profile',
    icon: 'i-heroicons-user',
  },
  {
    name: 'Avatar',
    label: 'Avatar',
    icon: 'i-heroicons-camera',
  },
  {
    name: 'Settings',
    label: 'Default View',
    icon: 'i-heroicons-cog',
  },
];
</script>

<style scoped>
/* */
</style>
