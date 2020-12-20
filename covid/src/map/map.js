import * as L from 'leaflet';
import data from '../countries.json';

let activeLayer = '';
let arrData = [];
const markers = [];
const mapOptions = {
  center: [17.385044, 78.486671],
  zoom: 2,
  minZoom: 2,
  maxBounds: ([[-90, -180], [90, 180]]),
  maxBoundsViscosity: 1,
};

const map = new L.Map('map', mapOptions);
const layerMain = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
map.addLayer(layerMain);

const info = L.control();

info.onAdd = function createDiv() {
  this.div = L.DomUtil.create('div', 'info');
  this.update();
  return this.div;
};

info.update = function updateDiv(props) {
  this.div.innerHTML = `<h4>${props
    ? `<b>${props.country}</b><br/>Total</h4>tests: ${props.tests}<br/>confirmed: ${props.cases}
    <br/>active: ${props.active}<br/>deaths: ${props.deaths}<br/>recovered: ${props.recovered}`
    : 'Hover over a country'}`;
};

info.addTo(map);

const legend = L.control({ position: 'bottomright' });

legend.onAdd = () => {
  const div = L.DomUtil.create('div', 'info legend');
  const colors = [];

  colors.push('<div><i style="background: red"></i><span>confirmed</span></div>');
  colors.push('<div><i style="background: green"></i><span>recovered</span></div>');
  colors.push('<div><i style="background: blue"></i><span>deaths</span></div>');
  div.innerHTML = colors.join('');
  return div;
};

legend.addTo(map);

function getTooltip(layer, propIso3) {
  // markers.forEach((marker) => map.removeLayer(marker));
  if (arrData.propForCoords) {
    const element = arrData.propForCoords.find((el) => el.countryInfo.iso3 === propIso3);
    if (element) {
      layer.bindTooltip(`${element.country}, confirmed: ${element.cases}`).openTooltip();
      info.update(element);
    }
  }
}

function style() {
  return {
    fillColor: '#4a4a4a;',
    weight: 2,
    opacity: 1,
    color: 'gray',
    dashArray: '3',
    fillOpacity: 0.7,
  };
}

function styleHover() {
  return {
    fillColor: 'black',
    dashArray: '',
    fillOpacity: 0.8,
  };
}

function highlightFeature(e) {
  const layer = e.target;

  layer.setStyle(styleHover());

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
  getTooltip(layer, layer.feature.properties.ISO_A3);
  markers.forEach((marker) => marker.bringToFront());
}

let geojson;

function resetHighlight(e) {
  const layer = e.target;
  if (layer !== activeLayer) {
    geojson.resetStyle(e.target);
    layer.bringToBack();
  }
  info.update();
}

function changeStyles(layer) {
  if (activeLayer) {
    activeLayer.setStyle(style());
  }
  activeLayer = layer;
  layer.setStyle(styleHover());
}

function changeCenterMap(propIso3) {
  if (arrData.propForCoords) {
    const element = arrData.propForCoords.find((el) => el.countryInfo.iso3 === propIso3);
    if (element) {
      map.setView([element.countryInfo.lat, element.countryInfo.long]);
    }
  }
}

function changeMap(layer) { // for future
  const propIso3 = layer.feature.properties.ISO_A3;
  changeCenterMap(propIso3);
  changeStyles(layer);
  // console.log(propIso3);
}

function getCountryFromMap(e) {
  const layer = e.target;
  changeMap(layer);
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: getCountryFromMap,
  });
}

geojson = L.geoJson(data, {
  style,
  onEachFeature,
}).addTo(map);

function findLayer(latLong) {
  const element = arrData.propForCoords
    .find((el) => (el.countryInfo.lat === latLong.lat) && (el.countryInfo.long === latLong.lng));
  info.update(element);
  const layers = geojson.getLayers();
  return layers.find((el) => el.feature.properties.ISO_A3 === element.countryInfo.iso3);
}

function getHoverCountry(e) {
  const latLong = e.target.getLatLng();
  const layer = findLayer(latLong);
  layer.setStyle(styleHover());
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
  markers.forEach((marker) => marker.bringToFront());
}

function resetHoverCountry(e) {
  const latLong = e.target.getLatLng();
  const layer = findLayer(latLong);
  geojson.resetStyle(layer);
  layer.bringToBack();
  info.update();
}

function clickCircle(e) {
  const latLong = e.target.getLatLng();
  const layer = findLayer(latLong);
  changeMap(layer);
}

function getCircleCases(obj) {
  const circleOptions = {
    color: 'red',
    fillColor: 'red',
    clickable: true,
    sticky: true,
    fillOpacity: 0.8,
  };
  for (let i = 0; i < obj.propForCoords.length; i += 1) {
    const circleCenter = [
      obj.propForCoords[i].countryInfo.lat,
      obj.propForCoords[i].countryInfo.long,
    ];
    const jusCoefficient = 200;
    const radius = Math.sqrt(obj.propForCoords[i].cases) * jusCoefficient;
    const circle = L.circle(circleCenter, radius, circleOptions);
    markers.push(circle);
    circle.on({
      mouseover: getHoverCountry,
      mouseout: resetHoverCountry,
      click: clickCircle,
    });
    circle.addTo(map)
      .bindTooltip(`${obj.propForCoords[i].country}, confirmed: ${obj.propForCoords[i].cases}`);
  }
}

export default function getDefaultMap(obj) {
  getCircleCases(obj);
  arrData = obj;
}

export function getMap() {
  return map;
}
