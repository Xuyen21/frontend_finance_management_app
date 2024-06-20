<template>
    <div class="flex justify-center items-center h-full">
      <div class="chart-container">
        <Doughnut :data="data" :options="options" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { Doughnut } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
  ChartJS.register(Title, Tooltip, Legend, ArcElement);
  
  const props = defineProps({
    data: Object,
  });
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,// Do not maintain aspect ratio
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Transaction Distribution',
        font: {
          size: 16
        },
      },
    },
  };
  </script>

<style scoped>
  .chart-container {
    position: relative;
    width: 450px; /* Set the desired width */
    height: 450px; /* Set the desired height */
  }
  @media (max-width: 640px) {
    .chart-container {
      width: 300px; /* Smaller width for mobile devices */
      height: 300px; /* Smaller height for mobile devices */
    }
  }
  .chart-container canvas {
    width: 100% !important;
    height: 100% !important;
  }
</style>
  