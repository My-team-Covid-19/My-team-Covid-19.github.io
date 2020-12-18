import * as L from 'leaflet';
import data from '../countries.json';
import getDataObject from '../data/data';

const markers = [];
const mapOptions = {
  center: [17.385044, 78.486671],
  zoom: 2,
};

const map = new L.Map('map', mapOptions);
const layerMain = new L.TileLayer('http://{s}.tiles.wmflabs.org/мт-Mapnik/{г}/{х}/{у}.png');
map.addLayer(layerMain);

const info = L.control();

info.onAdd = function createDiv() {
  this.div = L.DomUtil.create('div', 'info');
  this.update();
  return this.div;
};

info.update = function updateDiv(props) {
  this.div.innerHTML = `<h4>${props
    ? `<b>${props.country}</b></h4>tests: ${props.tests}<br/>cases: ${props.cases}
    <br/>active: ${props.active}<br/>deaths: ${props.deaths}<br/>recovered: ${props.recovered}`
    : 'Hover over a country'}`;
};

info.addTo(map);

const legend = L.control({ position: 'bottomright' });

legend.onAdd = () => {
  const div = L.DomUtil.create('div', 'info legend');
  const colors = [];

  colors.push('<div><i style="background: red"></i><span>cases</span></div>');
  colors.push('<div><i style="background: green"></i><span>recovered</span></div>');
  colors.push('<div><i style="background: blue"></i><span>deaths</span></div>');
  div.innerHTML = colors.join('');
  return div;
};

legend.addTo(map);

function getTooltip(layer, propIso3) {
  // markers.forEach((marker) => map.removeLayer(marker));
  markers.forEach((marker) => marker.bringToFront());
  const objData = getDataObject();
  if (objData.propForCoords) {
    const element = objData.propForCoords.find((el) => el.countryInfo.iso3 === propIso3);
    if (element) {
      layer.bindTooltip(`${element.country}, cases: ${element.cases}`).openTooltip();
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

function highlightFeature(e) {
  const layer = e.target;

  layer.setStyle({
    fillColor: 'black',
    dashArray: '',
    fillOpacity: 0.8,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
  getTooltip(layer, layer.feature.properties.ISO_A3);
}

let geojson;

function resetHighlight(e) {
  const layer = e.target;
  geojson.resetStyle(e.target);
  layer.bringToBack();
  info.update();
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
  });
}

geojson = L.geoJson(data, {
  style,
  onEachFeature,
}).addTo(map);

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
    circle.addTo(map);
  }
}

export default function getDefaultMap(obj) {
  getCircleCases(obj);
}
