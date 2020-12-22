import {
  getChart, getArrData, getDailyDataAbs, getDataPer100k,
} from './chart';
import getDataObject from '../data/data';

const list = document.querySelector('.table2 > ul');
const tableBody = document.querySelector('.table > .body');
const controlTitle = document.querySelector('.graph > .control > .control-title');
const cancel = document.querySelector('.cancel');
const buttons = ['cumulative', 'daily', 'cumulative per100k', 'daily per100k'];
const globalDataCases = ['cases', 'deaths', 'recovered'];
const colors = ['rgb(255, 45, 45)', 'rgb(70, 70, 194)', 'rgb(85, 147, 85)'];
let dataCountry = 0;
let countryCode = 0;
let localPopulation = 0;
let isGlobal = true;

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

function getGlobalData(data, predicate, i, population = 7594000000) {
  let globalData = 0;

  if (predicate < 3) {
    globalData = getArrData(Object.entries(data[globalDataCases[i]]));
  } else if ((predicate > 2) && (predicate < 6)) {
    globalData = getDailyDataAbs(Object.entries(data[globalDataCases[i]]));
  } else if (predicate > 5 && predicate < 9) {
    globalData = getDataPer100k(Object.entries(data[globalDataCases[i]]), population);
  } else {
    globalData = getDataPer100k(Object.entries(data[globalDataCases[i]]), population, 'daily');
  }
  return globalData;
}

function getDataCountry(country) {
  return fetch(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=all`);
}

export function updateChart(predicate, country) {
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
  } else if (countryCode !== country) {
    getDataCountry(country).then((result) => result.json())
      .then((res) => {
        if (res) {
          const i = predicate % 3;
          countryCode = country;
          dataCountry = res.timeline;
          chart.data.datasets[0].label = globalDataCases[i];
          chart.data.datasets[0].backgroundColor = colors[i];
          chart.data.datasets[0].data = getGlobalData(dataCountry, predicate, i, localPopulation);
          chart.update();
          chart.update();
        }
      }).catch(() => alert('Country not found or doesn\'t have any historical data'));
  } else {
    const i = predicate % 3;
    chart.data.datasets[0].label = globalDataCases[i];
    chart.data.datasets[0].backgroundColor = colors[i];
    chart.data.datasets[0].data = getGlobalData(dataCountry, predicate, i, localPopulation);
    chart.update();
    chart.update();
  }
}

function changeChart(e) {
  if (e.target.classList.contains('material-icons')) {
    const predicate = changePredicate(e);
    updateChart(predicate, countryCode);
  }
}

function getCodeCountry(itemTarget, tableTarget) {
  if (itemTarget) {
    return itemTarget.getAttribute('iso3');
  }
  return tableTarget.getAttribute('iso3');
}

function getChartCountry(e) {
  countryCode = 0;
  const data = getDataObject();
  isGlobal = false;
  const itemTarget = e.target.closest('li');
  const tableTarget = e.target.closest('.item');
  const codeCountry = getCodeCountry(itemTarget, tableTarget);
  const element = data.propForCoords.find((obj) => obj.countryInfo.iso3 === codeCountry);
  const predicate = +controlTitle.getAttribute('predicate');
  localPopulation = element.population;
  updateChart(predicate, codeCountry, localPopulation);
}

export default function changeCharFromMap(localPop, codeCountry) {
  countryCode = 0;
  isGlobal = false;
  localPopulation = localPop;
  const predicate = +controlTitle.getAttribute('predicate');
  updateChart(predicate, codeCountry, localPopulation);
}

function resetChartCountry() {
  countryCode = 0;
  isGlobal = true;
  localPopulation = 0;
  const predicate = +controlTitle.getAttribute('predicate');
  updateChart(predicate, countryCode);
}

document.querySelector('.graph > .control').addEventListener('click', changeChart);
list.addEventListener('click', getChartCountry);
tableBody.addEventListener('click', getChartCountry);
cancel.addEventListener('click', resetChartCountry);
