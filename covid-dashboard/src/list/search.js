const input = document.querySelector('.search-input');
const cancelBtn = document.querySelector('.cancel');
const list = document.querySelector('ul');
const table = document.querySelector('.table > .body');
const check = (items) => {
  items.forEach((elem) => {
    const country = elem.querySelector('.name').textContent.toLowerCase();;
    if (!country.includes(input.value)) {
      elem.classList.add('hidden');
    } else {
      elem.classList.remove('hidden');
    }
  });
};

input.addEventListener('input', () => check([...list.children]));
cancelBtn.addEventListener('click', () => {
  list.scroll(0, 0);
  table.scroll(0, 0);
  input.value = '';
  document.querySelectorAll('[iso3]').forEach((elem) => elem.classList.remove('active'));
  check([...list.children]);
});
