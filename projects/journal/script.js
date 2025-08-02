const disclaimer = document.getElementById('disclaimer');
const inputField = document.getElementById('input-field');
const submitBtn = document.getElementById('submit-btn');
const outputContainer = document.getElementById('output-container');
const dismissBtn = document.getElementById('dismiss-disclaimer');
const clearBtn = document.getElementById('clear-btn');
const reloadBtn = document.getElementById('reload-btn');
const closeSettingsBtn = document.getElementById('close-settings');
const settingsPanel = document.getElementById('settings-panel');
const openSettingsBtn = document.getElementById('open-settings');
const showHideBtn = document.getElementById('showHideBtn');
const deleteEntryBtn = document.getElementById('delete-entry');
const changeDateBtn = document.getElementById('change-date');
const downloadEntriesBtn = document.getElementById('download-csv');

downloadEntriesBtn.addEventListener('click', downloadCsv);

function downloadCsv() {
  const itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
  
  if (!itemsArray.length) {
    alert('There are no items to export.');
    return;
  }
  
  const csvRows = [['id', 'timestamp', 'text']];
  itemsArray.forEach(item => {
    const row = [
      item.id,
      new Date(item.timestamp).toLocaleString(undefined, { timeZoneName: 'short' }),
      `"${item.text.replace(/"/g, '""')}"` // wrap the text value with quotes and escape any existing quotes by doubling them
    ];
    csvRows.push(row);
  });
  
  const csvData = csvRows.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'items.csv');
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/*
supposed to create settings in json and then set settings.privatemode=true 

showHideBtn.addEventListener('click', function () {
  const settings = JSON.parse(localStorage.getItem('settings'));

  // Toggle privatemode setting
  settings.privatemode = !settings.privatemode;

  // Save updated settings to localStorage
  localStorage.setItem('settings', JSON.stringify(settings));

  if (showHideBtn.innerHTML === '<img src="img/hide.svg">') {
    showHideBtn.innerHTML = '<img src="img/show.svg">';
  } else {
    showHideBtn.innerHTML = '<img src="img/hide.svg">';
  }
});
*/

/*
then this was supposed to update the state of the button SVG based on whether the setting was true or false

// retrieve privacymode from local storage settings
const settings = JSON.parse(localStorage.getItem('settings'));
const privatemode = settings && settings.privatemode;

if (privatemode) {
  // showHideBtn is toggled when privatemode is true
  if (showHideBtn.innerHTML === '<img src="img/hide.svg">') {
    showHideBtn.innerHTML = '<img src="img/show.svg">';
  } else {
    showHideBtn.innerHTML = '<img src="img/hide.svg">';
  }
} else {
  // showHideBtn is always set to 'hide' when privatemode is false
  showHideBtn.innerHTML = '<img src="img/hide.svg">';
}
*/

// does this work

const defaultSettings = {
  privatemode: false
};

// Check if settings already exist in localStorage
let settings = localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings')) : {};

// Merge default settings with existing settings (if any)
settings = { ...defaultSettings, ...settings };

// Save settings to localStorage
localStorage.setItem('settings', JSON.stringify(settings));

showHideBtn.addEventListener('click', function () {
  const settings = JSON.parse(localStorage.getItem('settings'));

  // Toggle privatemode setting
  settings.privatemode = !settings.privatemode;

  // Save updated settings to localStorage
  localStorage.setItem('settings', JSON.stringify(settings));

  const privatemode = settings && settings.privatemode;

  if (privatemode) {
    // showHideBtn is toggled when privatemode is true
    if (showHideBtn.innerHTML === '<img src="img/hide.svg">') {
      showHideBtn.innerHTML = '<img src="img/show.svg">';
    } else {
      showHideBtn.innerHTML = '<img src="img/hide.svg">';
    }
  } else {
    // showHideBtn is always set to 'hide' when privatemode is false
    showHideBtn.innerHTML = '<img src="img/hide.svg">';
  }
  renderItems();
  });




/* this is the current, functioning privacy button
showHideBtn.addEventListener('click', function () {
  const textItems = document.querySelectorAll('.text');
  textItems.forEach(function(item) {
    if (item.style.transform === 'scaleY(0)') {
      item.style.transform = 'scaleY(1)';
    } else {
      item.style.transform = 'scaleY(0)';
    }
  });

  if (showHideBtn.innerHTML === '<img src="img/hide.svg">') {
    showHideBtn.innerHTML = '<img src="img/show.svg">';
  } else {
    showHideBtn.innerHTML = '<img src="img/hide.svg">';
  }
});
*/

reloadBtn.addEventListener('click', () => {
  location.reload();
});

closeSettingsBtn.addEventListener('click', () => {
  settingsPanel.style.display = 'none';
});

openSettingsBtn.addEventListener('click', () => {
  settingsPanel.style.display = 'block';
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
  scrollOutputContainer();
  focusOnInput();
});

inputField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitForm();
    scrollOutputContainer();
    focusOnInput();
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

/* removing to break out scroll and input focus, and removing visibility check
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
        itemElement.innerHTML = `<span class="timestamp">${timestamp}</span><div class="text">${item.text}</div><div class="toolbar"><button id="change-date">change&nbsp;date</button><button id="delete-entry">delete</button><button id="hide-entry">hide</button></div>`;
        outputContainer.appendChild(itemElement);
      }
    });
    outputContainer.scrollTop = outputContainer.scrollHeight;
  } else {
    outputContainer.innerHTML = 'Looks like you have not logged any entries. What&rsquo;s on your mind?';
  }
  inputField.focus();
}
*/

function focusOnInput() {
  inputField.focus();
}

function scrollOutputContainer() {
  outputContainer.scrollTop = outputContainer.scrollHeight;
}

function renderItems() {
  const settings = JSON.parse(localStorage.getItem('settings')) || { privatemode: false };
  let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
  outputContainer.innerHTML = '';
  if (itemsArray.length) {
    itemsArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    itemsArray.forEach(function (item) {
      const itemElement = document.createElement('div');
      itemElement.classList.add('entry');
      itemElement.setAttribute('tabindex', '-1');
      itemElement.setAttribute('data-id', `${item.id}`);
      const timestamp = new Date(item.timestamp).toLocaleString(undefined, {timeZoneName: 'short'});
      itemElement.innerHTML = `<span class="timestamp">${timestamp}</span>`;
      if (!settings.privatemode) {
        itemElement.innerHTML += `<div class="text">${item.text}</div>`;
      }
      itemElement.innerHTML += `<div class="toolbar"><button id="change-date">change&nbsp;date</button><button id="delete-entry">delete</button>`;
      outputContainer.appendChild(itemElement);
    });
  } else {
    outputContainer.innerHTML = 'Looks like you have not logged any entries. What&rsquo;s on your mind?';
  }
}

scrollOutputContainer();
focusOnInput();
renderItems();

