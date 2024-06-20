<template>
  <!-- py mean padding for all directions -->
  <div class="grid grid-cols-2 py-2 border-b border-gray-200 text-gray-900 font-bold">
    <div class="flex items-center justify-between">{{ date }}</div>
    <div class="flex items-center justify-end mr-10">{{ formatCurrency(sum) }}</div>
  </div>
</template>

<script setup>

const props = defineProps({
  date: String,
  transactions: Array,
});

// caclculate total amount of all transactions
const sum = computed(() => {
  return props.transactions.reduce((total, transaction) => {
    return total + (transaction.type_id === 1 ? transaction.amount : -transaction.amount);
  }, 0);
});

</script>


