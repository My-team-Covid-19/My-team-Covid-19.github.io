import getPage from '../page/render';

const urls = [
  'https://disease.sh/v3/covid-19/all?yesterday=true',
  'https://restcountries.eu/rest/v2/all?fields=name;population;flag',
  'https://corona.lmao.ninja/v2/countries',
  'https://corona-api.com/timeline',
  'https://disease.sh/v3/covid-19/historical/all?lastdays=all',
];

const requests = urls.map((url) => fetch(url));

const data = {
  globalData: '',
  countriesData: '',
  flagsAndPopulations: '',
  propForCoords: '',
  globalOneDay: '',
  totalCases: '',
};

Promise.all(requests)
  .then((responses) => {
    const results = responses.map((el) => el.json());
    return Promise.all(results).then((values) => {
      [data.globalData] = [values[0]];
      [data.flagsAndPopulations] = [values[1]];
      [data.propForCoords] = [values[2]];
      data.globalOneDay = [values[3]][0].data;
      [data.totalCases] = [values[4]];
      return data;
    });
  })
  .catch(() => alert('Failed to load resource, please try again later'))
  .then((obj) => getPage(obj));

export default function getDataObject() {
  return data;
}
