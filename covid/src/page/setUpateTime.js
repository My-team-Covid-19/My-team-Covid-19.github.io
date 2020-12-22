export default function lastUpdate(data) {
  const dateElem = document.querySelector('.date');
  const date = new Date(data.globalData.updated);
  dateElem.textContent = `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}`;
}