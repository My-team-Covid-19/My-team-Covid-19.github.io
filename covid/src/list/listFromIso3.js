export default function findFromMap(iso3) {
  const items = document.querySelectorAll('[iso3]');

  items.forEach((item) => item.classList.remove('active'));
  [...items].filter((elem) => elem.getAttribute('iso3') === iso3).forEach((elem) => {
    elem.classList.add('active');
    elem.scrollIntoView();
  });
}
