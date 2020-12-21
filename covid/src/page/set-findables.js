const findables = document.querySelectorAll('[extensible]');

findables.forEach((elem) => {
  const extendBtn = document.createElement('div');
  const materialIcon = document.createElement('i');

  extendBtn.classList.add('search');
  materialIcon.classList.add('material-icons');
  materialIcon.textContent = 'search';

  extendBtn.append(materialIcon);
  elem.append(extendBtn);
});
