<template>
  <div :class="[textColorClass, bgColorClass, 'p-2', 'rounded-lg', 'shadow']">
    <div class="font-bold">{{ title }}</div>
    <div class="text-xl sm:text-2xl font-extrabold text-black mb-2">
      <!-- USkeleton is a loading content placeholder -->
      <USkeleton class="h-8 w-full" v-if="loading"></USkeleton>
      <div v-else>{{ formatCurrency(amount) }}</div>
    </div>
    <div>{{ formatCurrency(priorAmount) }}</div>

    <div>
      <USkeleton class="h-6 w-full" v-if="loading"></USkeleton>
      <div v-else class="flex space-x-1 items-center text-sm">
        <!-- if we wanna use props from vue, we must bind it through the colin -->
        <UIcon
          :name="trend"
          dynamic
          class="w-6 h-6"
          :class="{ green: trendingUp, red: !trendingUp }"
        ></UIcon>
        <div class="text-gray-600">
          {{ percentageTrend }}% vs prior
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  amount: Number,
  priorAmount: Number,
  color: String,
  bgColor: String,
  loading: Boolean,
});

const { amount, priorAmount, color, bgColor } = toRefs(props);

const trendIcon = computed(() => {
  const trendingUp = amount.value >= priorAmount.value;
  const trend = trendingUp ? "i-ph-trend-up-thin" : "i-ph-trend-down-thin";
  return { trendingUp, trend };
});

// Destructure the returned object of the computed function above
let trendingUp = ref(trendIcon.value.trendingUp);
let trend = ref(trendIcon.value.trend);

watch([amount, priorAmount], () => {
  trendingUp.value = trendIcon.value.trendingUp;
  trend.value = trendIcon.value.trend;
});

const percentageTrend = computed(() => {
  if (priorAmount.value === 0) {
    return amount.value > 0 ? '∞' : '0';
  }
  const difference = amount.value - priorAmount.value;
  const ratio = (difference / priorAmount.value) * 100;
  return ratio.toFixed(1); // Returning the percentage with 1 decimal points
});

const textColorClass = computed(() => color.value);
const bgColorClass = computed(() => bgColor.value);
</script>

<style scoped>
.green {
  @apply text-green-600;
}

.red {
  @apply text-red-600;
}
</style>
