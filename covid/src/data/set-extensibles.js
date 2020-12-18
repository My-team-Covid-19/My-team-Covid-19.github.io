const extensibleElems = document.querySelectorAll('[extensible]');

extensibleElems.forEach((elem) => {
  const extendBtn = document.createElement('div');
  const materialIcon = document.createElement('i');

  extendBtn.classList.add('extend');
  materialIcon.classList.add('material-icons');
  materialIcon.textContent = 'fullscreen';

  extendBtn.append(materialIcon);
  elem.append(extendBtn);
});

document.querySelector('body').addEventListener('click', (e) => {
  const extendBtn = e.target.closest('.extend');

  if (extendBtn) {
    const currentEx = extendBtn.closest('[extensible]');
    const otherExArr = ([...extensibleElems].filter((elem) => elem !== currentEx));

    if (document.body.hasAttribute('extended')) {
      currentEx.querySelector('.extend > i').textContent = 'fullscreen';
      otherExArr.forEach((ex) => ex.classList.remove('hidden'));
      document.body.classList.remove(`${currentEx.className}-full`);
      document.body.removeAttribute('extended');
    } else {
      currentEx.querySelector('.extend > i').textContent = 'fullscreen_exit';
      otherExArr.forEach((ex) => ex.classList.add('hidden'));
      document.body.classList.add(`${currentEx.className}-full`);
      document.body.setAttribute('extended', `${currentEx.className}`);
    }
  }
});
