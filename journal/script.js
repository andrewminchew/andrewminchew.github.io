const disclaimer = document.getElementById('disclaimer');
const inputField = document.getElementById('input-field');
const submitBtn = document.getElementById('submit-btn');
const outputContainer = document.getElementById('output-container');
const dismissBtn = document.getElementById('dismiss-disclaimer');
const clearBtn = document.getElementById('clear-btn');
const reloadBtn = document.getElementById('reload-btn');
const closeSettingsBtn = document.getElementById('close-settings');
const settings = document.getElementById('settings');
const openSettingsBtn = document.getElementById('open-settings');
const showHideBtn = document.getElementById('showHideBtn');
const deleteEntryBtn = document.getElementById('delete-entry');
const hideEntryBtn = document.getElementById('hide-entry');
const showAllBtn = document.getElementById('show-all-entries');
const changeDateBtn = document.getElementById('change-date');

showAllBtn.addEventListener('click', () => {
  let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
  itemsArray.forEach((item) => {
    item.visibility = 'show';
  });
  localStorage.setItem('items', JSON.stringify(itemsArray));
  renderItems();
});

showHideBtn.addEventListener('click', function () {
  if (document.getElementById('output-container').style.visibility === 'hidden') {
    document.getElementById('output-container').style.visibility = 'visible';
    showHideBtn.innerHTML = '<img src="img/hide.svg">';
  } else {
    document.getElementById('output-container').style.visibility = 'hidden';
    showHideBtn.innerHTML = '<img src="img/show.svg">';
  }
});

reloadBtn.addEventListener('click', () => {
  location.reload();
});

closeSettingsBtn.addEventListener('click', () => {
  settings.style.display = 'none';
});

openSettingsBtn.addEventListener('click', () => {
  settings.style.display = 'block';
});


dismissBtn.addEventListener('click', () => {
  disclaimer.style.display = 'none';
  localStorage.setItem('disclaimerDismissed', 'true');
});

clearBtn.addEventListener('click', () => {
  localStorage.clear();
  renderItems();
});

if (localStorage.getItem('disclaimerDismissed') === 'true') {
  disclaimer.style.display = 'none';
}

submitBtn.addEventListener('click', () => {
  submitForm();
});

inputField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitForm();
  }
});

function submitForm() {
  const inputValue = inputField.value;
  if (inputValue) {
    const timestamp = new Date().toISOString();
    const id = timestamp.replace(/[^\w]/g, ''); // remove all non-alphanumeric characters
    let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
    itemsArray.push({ id, text: inputValue, timestamp, visibility: "show" });
    localStorage.setItem('items', JSON.stringify(itemsArray));
    inputField.value = '';
    renderItems();
  }
}

outputContainer.addEventListener('click', (event) => {
  // Use event delegation to listen for clicks on the delete button
  if (event.target.id === 'delete-entry') {
    // Get the id of the parent element of the clicked delete button
    const id = event.target.closest('.entry').dataset.id;
    let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
    // Remove the entry with the matching id from the items array
    itemsArray = itemsArray.filter(item => item.id !== id);
    localStorage.setItem('items', JSON.stringify(itemsArray));
    renderItems(); // Refresh the view
  }

  // Use event delegation to listen for clicks on the hide button
  if (event.target.id === 'hide-entry') {
    // Get the id of the parent element of the clicked hide button
    const id = event.target.closest('.entry').dataset.id;
    let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
    // Set the visibility of the entry with the matching id to "hide"
    itemsArray.forEach(function (item) {
      if (item.id === id) {
        item.visibility = "hide";
      }
    });
    localStorage.setItem('items', JSON.stringify(itemsArray));
    renderItems(); // Refresh the view
  }

  if (event.target.id === 'change-date') {
    // Get the id of the parent element of the clicked date change button
    const id = event.target.closest('.entry').dataset.id;
    // Show the date picker modal
    const modal = document.getElementById('date-picker-modal');
    modal.style.display = "block";
    const newDatePicker = document.getElementById('new-date-picker');
    const timestamp = event.target.closest('.entry').querySelector('.timestamp').textContent;
    newDatePicker.value = timestamp.split('T')[0]; // Set the initial value of the date picker to the current timestamp
    // Add an event listener to the "Save" button
    const saveBtn = document.getElementById('save-date-btn');
    saveBtn.addEventListener('click', () => {
      const newDate = new Date(newDatePicker.valueAsNumber);
      const newTimestamp = newDate.toISOString();
      let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
      // Update the timestamp of the entry with the matching id
      itemsArray.forEach(function (item) {
        if (item.id === id) {
          item.timestamp = newTimestamp;
        }
      });
      localStorage.setItem('items', JSON.stringify(itemsArray));
      renderItems(); // Refresh the view
      modal.style.display = "none"; // Hide the modal
    });
  }
});


function renderItems() {
  let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
  outputContainer.innerHTML = '';
  if (itemsArray.length) {
    itemsArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    itemsArray.forEach(function (item) {
      if (item.visibility !== "hide") {
        const itemElement = document.createElement('div');
        itemElement.classList.add('entry');
        itemElement.setAttribute('tabindex', '-1');
        itemElement.setAttribute('data-id', `${item.id}`);
        const timestamp = new Date(item.timestamp).toLocaleString(undefined, {timeZoneName: 'short'});
        itemElement.innerHTML = `<div class="text"><span class="timestamp">${timestamp}</span>${item.text}</div><div class="toolbar"><button id="change-date">change&nbsp;date</button><button id="delete-entry">delete</button><button id="hide-entry">hide</button></div>`;
        outputContainer.appendChild(itemElement);
      }
    });
    outputContainer.scrollTop = outputContainer.scrollHeight;
  } else {
    outputContainer.innerHTML = 'Looks like you have not logged any entries. What&rsquo;s on your mind?';
  }
  inputField.focus();
}



renderItems();

