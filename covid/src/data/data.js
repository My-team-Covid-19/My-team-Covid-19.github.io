import getPage from '../page/render';
import * as globalOneDay from './globalOneDay.json';

const urls = [
  'https://api.covid19api.com/summary',
  'https://restcountries.eu/rest/v2/all?fields=name;population;flag',
  'https://corona.lmao.ninja/v2/countries',
];

const requests = urls.map((url) => fetch(url));

const data = {
  globalData: '',
  countriesData: '',
  flagsAndPopulations: '',
  propForCoords: '',
  globalOneDay: '',
};

Promise.all(requests)
  .then((responses) => {
    const results = responses.map((el) => el.json());
    return Promise.all(results).then((values) => {
      data.globalData = values[0].Global;
      data.countriesData = values[0].Countries;
      [data.flagsAndPopulations] = [values[1]];
      [data.propForCoords] = [values[2]];
      data.globalOneDay = globalOneDay;
      return data;
    });
  }).then((obj) => getPage(obj));

export default function getDataObject() {
  return data;
}
