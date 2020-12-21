const input = document.querySelector('.search-input');

input.addEventListener('input', () => {
  const items = [...document.querySelectorAll('.country-list-item')];
  const inputVal = input.value;

  items.forEach((elem) => {
    const country = elem.querySelector('.name').textContent;
    if (!country.includes(inputVal)) {
      elem.classList.add('hidden');
    } else {
      elem.classList.remove('hidden');
    }
  });
});
