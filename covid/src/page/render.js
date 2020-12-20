import dataRebase from '../table/data-rebase';
import showList from '../list/data-to-list';
import showTable from '../table/data-to-table';
import getDefaultMap from '../map/map';
import getDefaultChart from '../chart/chart';

export default function getPage(data) {
  getDefaultMap(data);
  getDefaultChart(data);
  showList(data);
  showTable(dataRebase(data));
}
