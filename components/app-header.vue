<template>
  <!-- flex: flexible & responsible layouts, addjusting to different screen size -->
  <header class="flex justify-between items-center mt-2 sm:pl-4 pr-4 sm:pr-8">
    <nav class="p-4 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <NuxtLink to="/" class="text-xl text-gray-900 font-bold hidden sm:block">
          Tracking Your Finance
        </NuxtLink>
        <NuxtLink to="/" class="text-xl text-gray-900 font-bold sm:hidden">
          <i class="i-heroicons-home h-6 w-6"></i>
        </NuxtLink>
      </div>
      <div class="flex space-x-6 ml-6 sm:mt-1">
        <NuxtLink
          to="/"
          class="text-gray-900 hover:text-green-600 transition-colors"
        >
          Summary
        </NuxtLink>
        <NuxtLink
          to="/report"
          class="text-gray-900 hover:text-green-600 transition-colors"
        >
          Report
        </NuxtLink>
      </div>
    </nav>
    <div>
      <UDropdown
        :items="items"
        :ui="{ 
          item: { disabled: 'cursor-text select-text' }, 
          width: 'w-64',
          background: 'bg-gray-100',
          base: 'hover:bg-gray-50'
          }"
        v-if="user"
      >
        <UAvatar 
          chip-color="primary"
          chip-text=""
          chip-position="top-right"
          :src="url" 
          alt="Avatar"> 
        </UAvatar>
        <template #account="{ item }">
          <div class="text-left">
            <p>Signed in as</p>
            <p class="font-medium text-gray-900">
              {{ user.email }}
            </p>
          </div>
        </template>

        <template #item="{ item }">
          <span class="truncate">{{ item.label }}</span>
          <UIcon
            :name="item.icon"
            class="flex-shrink-0 h-4 w-4 text-gray-400 ms-auto"
          />
        </template>
      </UDropdown>
    </div>
  </header>
</template>
<script setup>

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const { url } = useAvatarUrl();
const items = [
  [
    {
      // label: user.value?.email,
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Settings",
      icon: "i-heroicons-cog-8-tooth",
      click: () => navigateTo("/profileSetting"),
    },
    {
      label: "Sign out",
      icon: "i-heroicons-arrow-left-on-rectangle",
      click: async () => {
        console.log("singed out");
        await supabase.auth.signOut();
        return navigateTo("/login");
      },
    },
  ],
];
</script>