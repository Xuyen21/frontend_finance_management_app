<template>
    <SummaryHeader title="Report" @view-change="handleViewChange" />
    <div>
      <section class="mb-8 bg-white rounded-lg shadow min-h-fit">
        <LineChart :data="lineChartData" />
      </section>
      <section class="mb-6 p-4 bg-white rounded-lg shadow min-h-fit">
        <DoughnutChart :data="doughnutChartData" />
      </section>
    </div>
  </template>
  
  <script setup>
  useChart();
  const { viewSelected } = useSharedState();
  const { transactions } = useTransactions(viewSelected);
  const transactionTypes = ['Income', 'Expense', 'Saving', 'Investment'];
  
  const doughnutChartData = computed(() => {
    const typeSums = transactionTypes.map((type) =>
      transactions.value
        .filter((t) => t.type_name === type)
        .reduce((sum, t) => sum + t.amount, 0)
    );
    return {
      labels: transactionTypes,
      datasets: [
        {
          data: typeSums,
          backgroundColor: ['#4CAF50', '#FF5722', '#2196F3', '#9C27B0'],
        },
      ],
    };
  });
  
  const lineChartData = computed(() => {
    const groupedByDate = {};
    transactions.value.forEach((t) => {
      const date = t.created_at.split('T')[0];
      if (!groupedByDate[date]) {
        groupedByDate[date] = { Income: 0, Expense: 0, Saving: 0, Investment: 0 };
      }
      groupedByDate[date][t.type_name] += t.amount;
    });
  
    const labels = Object.keys(groupedByDate);
    const datasets = transactionTypes.map((type, index) => ({
      label: type,
      data: labels.map((date) => groupedByDate[date][type]),
      borderColor: ['#4CAF50', '#FF5722', '#2196F3', '#9C27B0'][index],
      fill: false,
    }));
  
    return {
      labels,
      datasets,
    };
  });
  
  const handleViewChange = (newValue) => {
    viewSelected.value = newValue;
  };

</script>
  