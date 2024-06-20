import {
    Chart as ChartJS,
    LineElement,
    BarElement,
    PointElement,
    LineController,
    BarController,
    CategoryScale,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import 'chartjs-adapter-date-fns';
  
  ChartJS.register(
    LineElement,
    BarElement,
    PointElement,
    LineController,
    BarController,
    CategoryScale,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend
  );
  
  export function useChart() {
    return { ChartJS };
  }
  