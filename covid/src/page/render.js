export default function getPage(data) {
  console.log(data.globalData.NewConfirmed);
  for (let i = 0; i < data.countriesData.length; i += 1) {
    console.log(data.countriesData[i].TotalDeaths);
  }
  for (let i = 0; i < data.flagsAndPopulations.length; i += 1) {
    console.log(data.flagsAndPopulations[i].name);
    console.log(data.flagsAndPopulations[i].population);
  }
}
