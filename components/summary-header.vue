<template>
  <section class="flex flex-wrap sm:flex-nowrap items-center justify-between mb-6 sm:mb-10 p-4 bg-white rounded-lg shadow">
    <h2 class="text-xl sm:text-3xl font-extrabold text-green-600 mb-1 sm:mb-0">{{ title }}</h2>
    <div class="w-auto bg-white">
      <USelectMenu v-model="viewSelected" :options="transactionViewOptions" @change="handleViewChange" />
    </div>
  </section>
</template>
  
<script setup>
import { transactionViewOptions } from '~/constants';
const props = defineProps({
  title: {
    type: String,
    required: true
  }
});

const { viewSelected } = useSharedState();

const emit = defineEmits(['view-change']);

const handleViewChange = (newValue) => {
  emit('view-change', newValue);
};
</script>

  