<template>
  <div class="flex justify-center items-center min-h-fit w-full">
    <div class="chart-container">
      <Line v-if="options" :data="data" :options="options" />
    </div>
  </div>
</template>

<script setup>
  import { Line } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
  ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

  const props = defineProps({
    data: Object,
  });

  // Filter out undefined values and find the maximum y value
  const options = ref(null);

  watch(() => props.data, (newData) => {
    if (newData && newData.datasets) {
      // Find the maximum y value from all datasets and add a margin
      const allDataValues = newData.datasets.flatMap(dataset => dataset.data);
      const maxYValue = Math.max(...allDataValues) * 1.2;
      // Round stepSize to the nearest hundred
      const stepSize = Math.ceil(maxYValue / 10 / 100) * 100;

      options.value = {
        responsive: true,
        fullSize: true,
        plugins: {
          legend: {
            position: 'right',
            align: 'center',
            usePointStyle: false,
            labels: {
              boxWidth: 20,
              boxHeight: 10,
              font: {
                size: 12
              },
              padding: 10,
            },
            maxWidth: 100,
          },
          title: {
            display: true,
            text: 'Transaction Trends',
            font: {
                size: 16
              },
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
            },
          },
          y: {
            beginAtZero: true,
            suggestedMax: maxYValue, // Set the max value for the y-axis
            ticks: {
              stepSize: stepSize, // Adjust this value to control the spacing between y-axis ticks
            },
          },
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 20,
            bottom: 20
          }
        },
      };
    }
  }, { immediate: true });
</script>

<style scoped>
  .chart-container {
    position: relative;
  }
  .chart-container canvas {
    width: 100% !important;
    height: 100% !important;
  }
</style>