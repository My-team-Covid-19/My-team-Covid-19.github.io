export default function showTable(rebased, data) {
  const tableContainer = document.querySelector('.table1');
  const listContainer = document.querySelector('.table2');
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
    tableBody.style = `height: ${tableContainer.offsetHeight - 153}px`;
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
      row.setAttribute('iso3', obj.iso3);
      cellCountry.classList.add('name', 'td');
      [cellCases, cellDeaths, cellRecovered].forEach((elem, i) => {
        elem.classList.add('count', 'td');
        // eslint-disable-next-line no-param-reassign
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

    globalRecoverElem.textContent = data.globalData.recovered.toLocaleString('ru');
    globalDeathElem.textContent = data.globalData.deaths.toLocaleString('ru');
  };
  setGlobal();
  setHeight();
  updateTable(0);

  window.addEventListener('resize', setHeight);

  // Event for population
  populationBtn.addEventListener('click', () => {
    // Get current state of buttons
    const currentDateMode = parseFloat(dateBtn.getAttribute('mode')); // 0
    const currentPopMode = parseFloat(populationBtn.getAttribute('mode')); // 0

    populationBtn.setAttribute('mode', (currentPopMode ? 0 : 1)); // mode toggler
    populationBtn.querySelector('span').textContent = currentPopMode ? 'All Cases' : 'per 100k'; // set another text

    updateTable(+currentDateMode + +populationBtn.getAttribute('mode') * 2); // popVal + (dateVal * 2)
  });
  // Event for date
  dateBtn.addEventListener('click', () => {
    const currentDateMode = parseFloat(dateBtn.getAttribute('mode')); // 0
    const currentPopMode = parseFloat(populationBtn.getAttribute('mode')); // 0

    dateBtn.setAttribute('mode', (currentDateMode ? 0 : 1)); // mode toggler
    dateBtn.querySelector('span').textContent = currentDateMode ? 'All Time' : 'Last Day'; // set another text

    updateTable(+dateBtn.getAttribute('mode') + +currentPopMode * 2); // popVal + (dateVal * 2)
  });

  // select
  tableBody.addEventListener('click', (e) => {
    const tableTarget = e.target.closest('.item');
    const name = tableTarget.querySelector('.name').textContent;
    const countryStat = rebased.find((obj) => obj.country === name);
    const countryListItems = listContainer.querySelectorAll('li');
    // visual selection in table
    tableBody.querySelectorAll('.item').forEach((elem) => {
      if (elem === tableTarget) {
        elem.classList.add('active');
      } else {
        elem.classList.remove('active');
      }
    });
    // visual selection in list

    const listTarget = [...countryListItems]
      .find((elem) => elem.querySelector('.name').textContent === name);
    countryListItems.forEach((elem) => elem.classList.remove('active'));
    listTarget.classList.add('active');
    listTarget.scrollIntoView();

    return countryStat;
  });
}
