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

showHideBtn.innerHTML = '<img src="img/hide.svg">';
showHideBtn.addEventListener('click', function() {
  const entryElements = document.querySelectorAll('.entry');
  entryElements.forEach((entry) => {
    if (entry.style.visibility === 'hidden') {
      entry.style.visibility = 'visible';
      showHideBtn.innerHTML = '<img src="img/hide.svg">';
    } else {
      entry.style.visibility = 'hidden';
      showHideBtn.innerHTML = '<img src="img/show.svg">';
    }
  });
});

if (/Mobi/.test(navigator.userAgent)) {
  inputField.addEventListener('focus', () => {
    showHideBtn.style.bottom = '95px';
  });

  inputField.addEventListener('blur', () => {
    showHideBtn.style.bottom = '5px';
  });
}

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
    const timestamp = new Date().toLocaleString();
    let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
    itemsArray.push({ text: inputValue, timestamp, visibility: "show" });
    localStorage.setItem('items', JSON.stringify(itemsArray));
    inputField.value = '';
    renderItems();
  }
}


function renderItems() {
  let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
  outputContainer.innerHTML = '';
  if (itemsArray.length) {
    itemsArray.forEach(function (item) {
      if (item.visibility !== "hide") {
        const itemElement = document.createElement('div');
        itemElement.classList.add('entry');
        itemElement.setAttribute('tabindex', '-1');
        itemElement.innerHTML = `<span class="timestamp">${item.timestamp}</span>${item.text}`;
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

