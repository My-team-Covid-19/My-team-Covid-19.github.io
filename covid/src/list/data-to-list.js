export default function showList(data) {
  console.log(data);
  // set variables
  const list = document.querySelector('.table2 > ul');
  const title = document.querySelector('.table2 > .title');
  const subtitle = document.querySelector('.table2 > .subtitle');
  const countType = 'cases';
  const titleType = 'TotalConfirmed';
  const preData = data.propForCoords.reduce((res, obj) => {
    res.push({ country: obj.country, count: obj[`${countType}`] });
    return res;
  }, []).sort((objA, objB) => +objB.count - +objA.count);

  // construct list
  title.textContent = titleType.replace(/([A-Z])/g, ' $1').trim();
  subtitle.textContent = data.globalData[`${titleType}`].toLocaleString('ru');
  preData.forEach((elem, i) => {
    const li = document.createElement('li');
    const img = document.createElement('img');
    const name = document.createElement('span');
    const count = document.createElement('span');
    const flag = new Image(20, 14);

    console.log(data.propForCoords[i].countryInfo.flag);
    // flag.src = data.propForCoords[i].countryInfo.flag;
    li.classList.add('country-list-item');
    name.classList.add('name');
    name.textContent = elem.country;
    count.classList.add('count');
    count.textContent = elem.count.toLocaleString('ru');

    li.append(name, count);
    list.append(li);
  });
}
