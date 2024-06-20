<template>
  <SummaryHeader title="Summary" @view-change="handleViewChange" />
  <section class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-10">
    <Trend :amount="incomeTotal" title="Income" :priorAmount="priorIncomeTotal" :loading="isLoading" color="text-green-800" bgColor="bg-green-200"></Trend>
    <Trend :amount="expenseTotal" title="Expense" :priorAmount="priorExpenseTotal" :loading="isLoading" color="text-red-800" bgColor="bg-red-200"></Trend>
    <Trend :amount="savingTotal" title="Saving" :priorAmount="priorSavingTotal" :loading="isLoading" color="text-blue-800" bgColor="bg-blue-200"></Trend>
    <Trend :amount="investmentTotal" title="Investment" :priorAmount="priorInvestmentTotal" :loading="isLoading" color="text-purple-800" bgColor="bg-purple-200"></Trend>
  </section>
  <section class="flex justify-between mb-4 sm:mb-10">
    <div>
      <h2 class="text-lg sm:text-2xl text-gray-900 font-extrabold">Transaction</h2>
      <div class="text-sm sm:text-lg text-gray-800">
        You have {{ incomeCount }} incomes, {{ expenseCount }} expenses, {{ savingCount }} savings, and {{ investmentCount }} investments within this period.
      </div>
    </div>
    <div>
      <UButton @click="isOpen = true" icon="i-heroicons-plus-circle">Add</UButton>
      <ModalTransaction v-model="isOpen" @saved="refresh"></ModalTransaction>
    </div>
  </section>
  <section v-if="!isLoading">
    <div v-for="(transactionsOnDay, date) in transactionsGroupedByDate" :key="date" class="mb-4">
      <DailyTransaction :date="date" :transactions="transactionsOnDay"></DailyTransaction>
      <Transaction v-for="transaction in transactionsOnDay" :key="transaction.id" :transaction="transaction" @edited="refresh" @deleted="refresh"></Transaction>
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 5" :key="i"></USkeleton>
  </section>
</template>

<script setup>
  const { viewSelected } = useSharedState();
  const isOpen = ref(false);

  const {
    isLoading,
    incomeCount,
    expenseCount,
    savingCount,
    investmentCount,
    incomeTotal,
    expenseTotal,
    savingTotal,
    investmentTotal,
    priorIncomeTotal,
    priorExpenseTotal,
    priorSavingTotal,
    priorInvestmentTotal,
    transactionsGroupedByDate,
    refresh,
  } = useTransactions(viewSelected);

  const handleViewChange = (newValue) => {
    viewSelected.value = newValue;
  };

</script>
