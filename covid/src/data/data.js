import getPage from '../page/render';

const urls = [
  'https://api.covid19api.com/summary',
  'https://restcountries.eu/rest/v2/all?fields=name;population;flag',
];

const requests = urls.map((url) => fetch(url));

const data = {
  globalData: '',
  countriesData: '',
  flagsAndPopulations: '',
};

Promise.all(requests)
  .then((responses) => {
    const results = responses.map((el) => el.json());
    return Promise.all(results).then((values) => {
      data.globalData = values[0].Global;
      data.countriesData = values[0].Countries;
      [data.flagsAndPopulations] = [values[1]];
      return data;
    });
  }).then((obj) => getPage(obj));

export default function getDataObject() {
  return data;
}
