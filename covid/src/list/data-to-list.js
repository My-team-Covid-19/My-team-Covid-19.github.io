export default function showList(rebased, data) {
  const list = document.querySelector('.table2 > ul');
  const title = document.querySelector('.cases.container > .title');
  const controlTitle = document.querySelector('.control-title');
  const subtitle = document.querySelector('.cases.container > .subtitle');
  const rebasedSelector = [
    ['totalCases', 'totalDeaths', 'totalRecovered'],
    ['todayCases', 'todayDeaths', 'todayRecovered'],
    ['casesPer100k', 'deathsPer100k', 'recoveredPer100k'],
    ['todayCasesPer100k', 'todayDeathsPer100k', 'todayRecoveredPer100k'],
  ];
  const digitSpread = () => {
    list.querySelectorAll('li').forEach((elem) => {
      const text = elem.querySelector('.count').textContent.toLocaleString('ru');
      // eslint-disable-next-line no-param-reassign
      elem.querySelector('.count').textContent = text;
    });
  };
  const sortList = () => {
    const select = (elem) => +elem.querySelector('.count').textContent;
    const elems = [...list.querySelectorAll('li')];
    list.append(...elems.sort((a, b) => select(b) - select(a)));
  };
  const updateList = (num) => {
    // selector calc
    const i = Math.floor(num / 3);
    const j = num % 3;
    const currentSelector = rebasedSelector[i][j];

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

      title.textContent = 'GlobalCases'.replace(/([A-Z])/g, ' $1').trim();
      subtitle.textContent = data.globalData.cases.toLocaleString('ru');
      controlTitle.textContent = currentSelector.replace(/([A-Z])/g, ' $1').trim();
    });
    sortList();
    digitSpread();
  };
  updateList(0);

  // left\right arrows lesteners
  document.querySelector('.table2 > .control').addEventListener('click', (e) => {
    if (e.target.classList.contains('material-icons')) {
      const val = e.target.classList.contains('left') ? -1 : 1; // calc direction
      const predicate = (+controlTitle.getAttribute('predicate') + val + 12) % 12; // predicate calc
      controlTitle.setAttribute('predicate', predicate);
      updateList(predicate);
    }
  });

  // select
  list.addEventListener('click', (e) => {
    const itemTarget = e.target.closest('li');
    const name = itemTarget.querySelector('.name').textContent;
    const countryStat = rebased.find((obj) => obj.country === name);
    const tableListitems = document.querySelectorAll('.body > .item');

    // visual selection in table
    list.querySelectorAll('li').forEach((elem) => {
      if (elem === itemTarget) {
        elem.classList.add('active');
      } else {
        elem.classList.remove('active');
      }
    });
    // visual selection in list
    const listTarget = [...tableListitems]
      .find((elem) => elem.querySelector('.name').textContent === name);
    tableListitems.forEach((elem) => elem.classList.remove('active'));
    listTarget.classList.add('active');
    listTarget.scrollIntoView();

    return countryStat;
  });
}
