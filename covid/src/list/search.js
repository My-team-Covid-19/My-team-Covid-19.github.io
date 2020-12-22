const input = document.querySelector('.search-input');
const cancelBtn = document.querySelector('.cancel');
const check = (items) => {
  items.forEach((elem) => {
    const country = elem.querySelector('.name').textContent;
    if (!country.includes(input.value)) {
      elem.classList.add('hidden');
    } else {
      elem.classList.remove('hidden');
    }
  });
};

input.addEventListener('input', () => check([...document.querySelectorAll('.country-list-item')]));
cancelBtn.addEventListener('click', () => {
  input.value = '';
  check([...document.querySelectorAll('.country-list-item')]);
});
