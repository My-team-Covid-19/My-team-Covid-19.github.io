import getDefaultMap from '../map/map';
import getDefaultChart from '../chart/chart';

export default function getPage(data) {
  getDefaultMap(data);
  getDefaultChart(data);
}
