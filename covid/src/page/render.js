import getDefaultMap from '../map/map';
import dataRebase from '../table/data-rebase';
import showList from '../list/data-to-list';
import showTable from '../table/data-to-table';

export default function getPage(data) {
  getDefaultMap(data);
  showList(data);
  showTable(dataRebase(data));
  // console.log(data.globalData.NewConfirmed);
  // for (let i = 0; i < data.countriesData.length; i += 1) {
  //   console.log(data.countriesData[i].TotalDeaths);
  // }
  // for (let i = 0; i < data.flagsAndPopulations.length; i += 1) {
  //   console.log(data.flagsAndPopulations[i].name);
  //   console.log(data.flagsAndPopulations[i].population);
  // }
}
