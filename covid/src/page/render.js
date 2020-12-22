import dataRebase from '../table/data-rebase';
import lastUpdate from './setUpateTime';
import showList from '../list/data-to-list';
import showTable from '../table/data-to-table';
import getDefaultMap from '../map/map';
import getDefaultChart from '../chart/chart';

export default function getPage(data) {
  const rebased = dataRebase(data);
  getDefaultMap(data);
  getDefaultChart(data);
  lastUpdate(data);
  showList(rebased, data);
  showTable(rebased, data);
}
