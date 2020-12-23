import getDataObject from '../data/data';
import { getCircleCases, removeMarkers } from './map';

let count = 0;

const btn = document.querySelector('.test-btn');
const circleOptionsConfirmed = {
  color: 'red',
  fillColor: 'red',
  clickable: true,
  sticky: true,
  fillOpacity: 0.8,
};
const circleOptionsRecovered = {
  color: 'green',
  fillColor: 'green',
  clickable: true,
  sticky: true,
  fillOpacity: 0.8,
};
const circleOptionsDeaths = {
  color: 'blue',
  fillColor: 'blue',
  clickable: true,
  sticky: true,
  fillOpacity: 0.8,
};

function changeMap() {
  removeMarkers();
  count += 1;
  let circleOptions = circleOptionsConfirmed;
  let status = 'confirmed';

  if (count === 1) {
    circleOptions = circleOptionsRecovered;
    status = 'recovered';
  } else if (count === 2) {
    circleOptions = circleOptionsDeaths;
    status = 'deaths';
  }

  const obj = getDataObject();

  getCircleCases(obj, circleOptions, status);
}

// btn.addEventListener('click', changeMap);
