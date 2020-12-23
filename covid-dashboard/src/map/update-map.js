import getDataObject from '../data/data';
import { getCircleCases, removeMarkers } from './map';

const controlTitle = document.querySelector('.map-wrapper > .controls > .control .control-title');
const control = document.querySelector('.map-wrapper > .controls > .control');
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
