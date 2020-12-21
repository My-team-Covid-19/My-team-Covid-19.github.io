import Chart from 'chart.js';

let chart = '';

class OneDay {
  constructor(date, value) {
    this.x = new Date(date);
    this.y = value;
  }
}

export function getArrData(arr) {
  const result = [];

  for (let i = 0; i < arr.length; i += 1) {
    result.push(new OneDay(arr[i][0], +arr[i][1]));
  }
  return result;
}

export default function getDefaultChart(data) {
  const ctx = document.getElementById('chart').getContext('2d');
  const chartConfig = {
    type: 'bar',
    data: {
      datasets: [{
        label: 'Total confirmed',
        backgroundColor: '#7d1111',
        data: getArrData(Object.entries(data.totalCases.cases)),
      }],
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        labels: {
          fontColor: 'rgba(255, 255, 255, 0.8)',
          fontSize: 20,
        },
      },
      scales: {
        yAxes: [{
          gridLines: {
            color: 'rgba(255, 255, 255, 0.2)',
          },
          ticks: {
            beginAtZero: true,
            fontColor: 'rgba(255, 255, 255, 0.6)',
          },
        }],
        xAxes: [{
          ticks: {
            fontColor: 'rgba(255, 255, 255, 0.6)',
          },
          gridLines: {
            color: 'rgba(255, 255, 255, 0.2)',
          },
          type: 'time',
          time: {
            displayFormats: {
              month: 'MMM',
            },
          },
        }],
      },
    },
  };

  chart = new Chart(ctx, chartConfig);
  chart.update();
}

export function getChart() {
  return chart;
}
