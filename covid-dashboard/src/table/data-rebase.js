export default function dataRebase(data) {
  const rebasedData = data.propForCoords.reduce((res, obj) => {
    res.push({
      country: obj.country,
      totalCases: obj.cases,
      totalDeaths: obj.deaths,
      totalRecovered: obj.recovered,
      todayCases: obj.todayCases,
      todayDeaths: obj.todayDeaths,
      todayRecovered: obj.todayRecovered,
      casesPer100k: +(obj.casesPerOneMillion / 10).toFixed(1),
      deathsPer100k: +(obj.deathsPerOneMillion / 10).toFixed(1),
      recoveredPer100k: +(obj.recoveredPerOneMillion / 10).toFixed(1),
      todayCasesPer100k: +((obj.todayCases / obj.population) * 100000).toFixed(3),
      todayDeathsPer100k: +((obj.todayDeaths / obj.population) * 100000).toFixed(3),
      todayRecoveredPer100k: +((obj.todayRecovered / obj.population) * 100000).toFixed(3),
      flag: obj.countryInfo.flag,
      iso3: obj.countryInfo.iso3,
    });
    return res;
  }, []);
  return rebasedData;
}
