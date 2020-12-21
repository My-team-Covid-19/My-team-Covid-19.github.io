import { getChart, getArrData } from './chart';
import getDataObject from '../data/data';

const btn = document.querySelector('.test-btn');

function changeChart() {
  const data = getDataObject();
  const chart = getChart();

  chart.data.datasets[0].label = 'Recovered';
  chart.data.datasets[0].backgroundColor = 'green';
  chart.data.datasets[0].data = getArrData(Object.entries(data.totalCases.recovered));
  // i don't know why but it works only in this case
  chart.update();
  chart.update();
}

btn.addEventListener('click', changeChart);
