// get the items data from local storage
const items = JSON.parse(localStorage.getItem('items')) || [];

// sort the items array by timestamp, from earliest to latest
items.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

// find the entries container
const entriesContainer = document.querySelector('.entries');

// loop through each item and draw it on the calendar
items.forEach(item => {
  const dayOfWeek = new Date(item.timestamp).getDay();
  const entryElement = document.createElement('div');
  entryElement.classList.add('entry');

  // create a span element for the time, formatted to the device timezone
  const timeElement = document.createElement('span');
  timeElement.classList.add('time');
  const localTime = new Date(item.timestamp).toLocaleTimeString();
  timeElement.textContent = localTime;

  // create a span element for the text
  const textElement = document.createElement('span');
  textElement.classList.add('text');
  textElement.textContent = item.text;

  // append the time and text elements to the entry element
  entryElement.appendChild(timeElement);
  entryElement.appendChild(textElement);

  // append the entry element to the correct day in the calendar
  entriesContainer.children[dayOfWeek].appendChild(entryElement);
});
