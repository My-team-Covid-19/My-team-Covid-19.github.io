export default function showTable(rebased, data) {
  const tableContainer = document.querySelector('.table1');
  const listContainer = document.querySelector('.table2');
  const list = document.querySelector('ul');
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
    tableBody.style = `height: ${tableContainer.offsetHeight - 163}px`;
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
        const text = document.createTextNode(obj[`${dataSelector[selectorIndex][i]}`]);
        elem.classList.add('count', 'td');
        elem.append(text);
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
  const sortList = () => {
    const select = (elem) => +elem.querySelector('.count').textContent;
    const elems = [...list.querySelectorAll('li')];
    list.append(...elems.sort((a, b) => select(b) - select(a)));
  };
  const updateList = (num) => {
    const currentSelector = dataSelector[num][0];
    const title = document.querySelector('.cases.container > .title');
    const subtitle = document.querySelector('.cases.container > .subtitle');
    const controlTitle = document.querySelector('.control-title');

    list.innerHTML = '';
    rebased.forEach((obj) => {
      const li = document.createElement('li');
      const country = document.createElement('div');
      const name = document.createElement('span');
      const count = document.createElement('span');
      const flag = new Image(20, 14);

      country.classList.add('country');
      flag.src = obj.flag;
      li.classList.add('country-list-item');
      li.setAttribute('iso3', obj.iso3);
      name.classList.add('name');
      name.textContent = obj.country;
      count.classList.add('count');
      count.textContent = obj[`${currentSelector}`];
      country.append(flag, name);
      li.append(country, count);
      list.append(li);
    });

    title.textContent = 'GlobalCases'.replace(/([A-Z])/g, ' $1').trim();
    subtitle.textContent = data.globalData.cases.toLocaleString('ru');
    controlTitle.textContent = currentSelector.replace(/([A-Z])/g, ' $1').trim();

    sortList();
  };
  setGlobal();
  setHeight();
  updateTable(0);

  window.addEventListener('resize', setHeight);

  populationBtn.addEventListener('click', () => {
    const currentDateMode = parseFloat(dateBtn.getAttribute('mode'));
    const currentPopMode = parseFloat(populationBtn.getAttribute('mode'));

    populationBtn.setAttribute('mode', (currentPopMode ? 0 : 1));
    populationBtn.querySelector('span').textContent = currentPopMode ? 'All Cases' : 'per 100k';

    updateTable(+currentDateMode + +populationBtn.getAttribute('mode') * 2);
    // updateList(+populationBtn.getAttribute('mode') * 2 + +currentDateMode);
  });

  dateBtn.addEventListener('click', () => {
    const currentDateMode = parseFloat(dateBtn.getAttribute('mode'));
    const currentPopMode = parseFloat(populationBtn.getAttribute('mode'));

    dateBtn.setAttribute('mode', (currentDateMode ? 0 : 1));
    dateBtn.querySelector('span').textContent = currentDateMode ? 'All Time' : 'Last Day';

    updateTable(+dateBtn.getAttribute('mode') + +currentPopMode * 2);
    // updateList(+currentPopMode * 2 + +dateBtn.getAttribute('mode'));
  });

  tableBody.addEventListener('click', (e) => {
    const tableTarget = e.target.closest('.item');
    const name = tableTarget.querySelector('.name').textContent;
    const countryStat = rebased.find((obj) => obj.country === name);
    const countryListItems = listContainer.querySelectorAll('li');

    tableBody.querySelectorAll('.item').forEach((elem) => {
      if (elem === tableTarget) {
        elem.classList.add('active');
      } else {
        elem.classList.remove('active');
      }
    });

    const listTarget = [...countryListItems]
      .find((elem) => elem.querySelector('.name').textContent === name);
    countryListItems.forEach((elem) => elem.classList.remove('active'));
    listTarget.classList.add('active');
    listTarget.scrollIntoView();

    return countryStat;
  });
}
