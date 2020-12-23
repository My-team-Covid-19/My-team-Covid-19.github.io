import getDataObject from '../data/data';
import { getCircleCases, removeMarkers } from './map';

const controlTitle = document.querySelector('.map-wrapper > .controls > .control .control-title');
const control = document.querySelector('.map-wrapper > .controls > .control');
const icon = document.querySelector('.map-wrapper > .controls > .control > .material-icons');
const populationBtn = document.querySelector('.population.button');
const dateBtn = document.querySelector('.date.button');
const btn = [
  ['total cases', 'total deaths', 'total recovered'],
  ['today cases', 'today deaths', 'today recovered'],
  ['cases per100k', 'deaths per100k', 'recovered per100k'],
  ['today cases per100k', 'today deaths per100k', 'today recovered per100k'],
];
const selector = [
  ['cases', 'deaths', 'recovered'],
  ['todayCases', 'todayDeaths', 'todayRecovered'],
  ['casesPerOneMillion', 'deathsPerOneMillion', 'recoveredPerOneMillion'],
  ['todayCases', 'todayDeaths', 'todayRecovered'],
];

const optionsMap = [
  {
    color: 'rgb(255, 45, 45)',
    fillColor: 'rgb(255, 45, 45)',
    clickable: true,
    sticky: true,
    fillOpacity: 0.8,
  },
  {
    color: 'rgb(70, 70, 194)',
    fillColor: 'rgb(70, 70, 194)',
    clickable: true,
    sticky: true,
    fillOpacity: 0.8,
  },
  {
    color: 'rgb(85, 147, 85)',
    fillColor: 'rgb(85, 147, 85)',
    clickable: true,
    sticky: true,
    fillOpacity: 0.8,
  },
];

function updateMap(predicate) {
  const i = predicate % 3;
  const j = Math.floor(predicate / 3);
  removeMarkers();
  getCircleCases(getDataObject(), optionsMap[i], selector[j][i], predicate);
}

(function initControlTitle() {
  [controlTitle.textContent] = [btn[0][0]];
}());

function changeMap(e) {
  if (e.target.classList.contains('material-icons')) {
    const val = e.target.classList.contains('left') ? -1 : 1;
    const predicate = (+controlTitle.getAttribute('predicate') + val + 12) % 12;
    controlTitle.setAttribute('predicate', predicate);
    const i = Math.floor(predicate / 3);
    const j = predicate % 3;
    controlTitle.textContent = btn[i][j];
    updateMap(predicate);
  }
}

control.addEventListener('click', changeMap);
document.querySelector('.table2 > .control').addEventListener('click', changeMap);
document.querySelector('.graph > .control').addEventListener('click', changeMap);
// populationBtn.addEventListener('click', () => {
//   const currentDateMode = parseFloat(dateBtn.getAttribute('mode'));
//   const currentPopMode = parseFloat(populationBtn.getAttribute('mode'));

//   populationBtn.setAttribute('mode', (currentPopMode ? 0 : 1));
//   populationBtn.querySelector('span').textContent = currentPopMode ? 'All Cases' : 'per 100k';
//   const val = icon.classList.contains('left') ? -1 : 1;
//   const predicate = (+controlTitle.getAttribute('predicate') + val + 12) % 12;
//   controlTitle.setAttribute('predicate', predicate);

//   updateMap((+populationBtn.getAttribute('mode') * 2 + +currentDateMode) * 3);
// });
// dateBtn.addEventListener('click', () => {
//   const currentDateMode = parseFloat(dateBtn.getAttribute('mode'));
//   const currentPopMode = parseFloat(populationBtn.getAttribute('mode'));

//   dateBtn.setAttribute('mode', (currentDateMode ? 0 : 1));
//   dateBtn.querySelector('span').textContent = currentDateMode ? 'All Time' : 'Last Day';
//   const val = icon.classList.contains('left') ? -1 : 1;
//   const predicate = (+controlTitle.getAttribute('predicate') + val + 12) % 12;
//   controlTitle.setAttribute('predicate', predicate);

//   updateMap((+currentPopMode.getAttribute('mode') * 2 + +currentPopMode) * 3);
// });
