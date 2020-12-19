import getDefaultMap from '../map/map';
import getDefaultChart from '../chart/chart';

export default function getPage(data) {
  getDefaultMap(data);
  getDefaultChart(data);
  // getRestDates(data);
  // console.log(data.globalData.NewConfirmed);
  // for (let i = 0; i < data.countriesData.length; i += 1) {
  //   console.log(data.countriesData[i].TotalDeaths);
  // }
  // for (let i = 0; i < data.flagsAndPopulations.length; i += 1) {
  //   console.log(data.flagsAndPopulations[i].name);
  //   console.log(data.flagsAndPopulations[i].population);
  // }
}
