export default function showTable(rebased, data) {
  const container = document.querySelector('.table1');
  const tableBody = document.querySelector('.table > .body');
  const populationBtn = document.querySelector('.population.button');
  const dateBtn = document.querySelector('.date.button');
  const dataSelector = [
    ['totalCases', 'totalDeaths', 'totalRecovered'],
    ['todayCases', 'todayDeaths', 'todayRecovered'],
    ['casesPer100k', 'deathsPer100k', 'recoveredPer100k'],
    ['todayCasesPer100k', 'todayDeathsPer100k', 'todayRecoveredPer100k'],
  ];
  const rebasedData = rebased.slice();
  const setHeight = () => {
    tableBody.style = `height: ${container.offsetHeight - 153}px`;
  };
  const updateTable = (selectorIndex) => {
    tableBody.innerHTML = '';
    rebasedData.forEach((obj) => {
      const row = document.createElement('div');
      const cellCountry = document.createElement('div');
      const cellCases = document.createElement('div');
      const cellDeaths = document.createElement('div');
      const cellRecovered = document.createElement('div');

      row.classList.add('item');
      cellCountry.classList.add('name', 'td');
      [cellCases, cellDeaths, cellRecovered].forEach((elem, i) => {
        elem.classList.add('count', 'td');
        elem.textContent = obj[`${dataSelector[selectorIndex][i]}`];
      });

      cellCountry.textContent = obj.country;
      row.append(cellCountry, cellCases, cellDeaths, cellRecovered);
      tableBody.append(row);
    });
  };
  const setGlobal = () => {
    const globalRecoverElem = document.querySelector('.recover > .subtitle');
    const globalDeathElem = document.querySelector('.death > .subtitle');

    globalRecoverElem.textContent = data.globalData.TotalRecovered.toLocaleString('ru');
    globalDeathElem.textContent = data.globalData.TotalDeaths.toLocaleString('ru');
  };

  window.addEventListener('resize', setHeight);
  populationBtn.addEventListener('click', () => {
    const currentDateMode = parseFloat(dateBtn.getAttribute('mode'));
    const currentPopMode = parseFloat(populationBtn.getAttribute('mode'));

    populationBtn.setAttribute('mode', (currentPopMode ? 0 : 1));
    populationBtn.querySelector('span').textContent = currentPopMode ? 'All Cases' : 'per 100k';

    updateTable(+currentDateMode + +populationBtn.getAttribute('mode') * 2);
  });
  dateBtn.addEventListener('click', () => {
    const currentDateMode = parseFloat(dateBtn.getAttribute('mode'));
    const currentPopMode = parseFloat(populationBtn.getAttribute('mode'));

    dateBtn.setAttribute('mode', (currentDateMode ? 0 : 1));
    dateBtn.querySelector('span').textContent = currentDateMode ? 'All Time' : 'Last Day';

    updateTable(+dateBtn.getAttribute('mode') + +currentPopMode * 2);
  });

  setHeight();

  updateTable(0);
  setGlobal();
}
