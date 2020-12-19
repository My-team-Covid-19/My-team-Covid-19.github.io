import Chart from 'chart.js';

class OneDay {
  constructor(date, value) {
    this.x = new Date(date);
    this.y = value;
  }
}

function getConfirmed(obj) {
  const result = [];
  for (let i = 0; i < obj.length; i += 1) {
    result.push(new OneDay(obj[i].date, obj[i].confirmed));
  }
  return result;
}

export default function getDefaultChart(data) {
  const ctx = document.getElementById('chart').getContext('2d');
  const chartConfig = {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Total confirmed',
        backgroundColor: '#7d1111',
        borderColor: '#7d1111',
        borderWidth: 2,
        fill: false,
        data: getConfirmed(data.globalOneDay),
      }],
    },
    options: {
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

  const chart = new Chart(ctx, chartConfig);
  chart.update();
}
