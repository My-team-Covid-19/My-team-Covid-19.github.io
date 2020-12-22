import {
  getChart, getArrData, getDailyDataAbs, getDataPer100k,
} from './chart';
import getDataObject from '../data/data';

const controlTitle = document.querySelector('.graph > .control > .control-title');
const buttons = ['cumulative', 'daily', 'cumulative per100k', 'daily per100k'];
const globalDataCases = ['cases', 'deaths', 'recovered'];
const colors = ['red', 'blue', 'green'];
const isGlobal = true;

(function initTitle() {
  const initPredicate = 0;
  controlTitle.setAttribute('predicate', initPredicate);
  controlTitle.textContent = buttons[initPredicate];
}());

function changePredicate(e) {
  const val = e.target.classList.contains('left') ? -1 : 1;
  const predicate = (+controlTitle.getAttribute('predicate') + val + 12) % 12;
  const i = Math.trunc(predicate / 3);
  controlTitle.textContent = buttons[i];
  controlTitle.setAttribute('predicate', predicate);
  return predicate;
}

function getGlobalData(data, predicate, i) {
  let globalData = 0;

  if (predicate < 3) {
    globalData = getArrData(Object.entries(data[globalDataCases[i]]));
  } else if ((predicate > 2) && (predicate < 6)) {
    globalData = getDailyDataAbs(Object.entries(data[globalDataCases[i]]));
  } else if (predicate > 5 && predicate < 9) {
    globalData = getDataPer100k(Object.entries(data[globalDataCases[i]]));
  } else {
    globalData = getDataPer100k(Object.entries(data[globalDataCases[i]]), 'daily');
  }
  return globalData;
}

function getDataCountry(country = 'russia') {
  return fetch(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=all`);
}

function updateChart(predicate) {
  const data = getDataObject();
  const chart = getChart();

  if (isGlobal) {
    const i = predicate % 3;

    chart.data.datasets[0].label = globalDataCases[i];
    chart.data.datasets[0].backgroundColor = colors[i];
    chart.data.datasets[0].data = getGlobalData(data.totalCases, predicate, i);
    // i don't know why but it works only in this case
    chart.update();
    chart.update();
  } else {
    getDataCountry().then((result) => result.json()).then((res) => {
      const i = predicate % 3;

      chart.data.datasets[0].label = globalDataCases[i];
      chart.data.datasets[0].backgroundColor = colors[i];
      chart.data.datasets[0].data = getGlobalData(res.timeline, predicate, i);
      chart.update();
      chart.update();
    });
  }
}

function changeChart(e) {
  if (e.target.classList.contains('material-icons')) {
    const predicate = changePredicate(e);
    updateChart(predicate);
  }
}

document.querySelector('.graph > .control').addEventListener('click', changeChart);
