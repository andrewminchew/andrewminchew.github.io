const disclaimer = document.getElementById('disclaimer');
const inputField = document.getElementById('input-field');
const submitBtn = document.getElementById('submit-btn');
const outputContainer = document.getElementById('output-container');
const dismissBtn = document.getElementById('dismiss-disclaimer');
const clearBtn = document.getElementById('clear-btn');

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
    itemsArray.push({ text: inputValue, timestamp });
    localStorage.setItem('items', JSON.stringify(itemsArray));
    inputField.value = '';
    renderItems();
  }
}

function renderItems() {
  let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
  outputContainer.innerHTML = '';
  if (itemsArray.length) {
    itemsArray.forEach((item) => {
      const itemElement = document.createElement('div');
      itemElement.innerHTML = `<span class="timestamp">${item.timestamp}</span>${item.text}`;
      outputContainer.appendChild(itemElement);
    });
    outputContainer.scrollTop = outputContainer.scrollHeight;
  } else {
    outputContainer.innerHTML = 'Looks like you have not logged any entries. What&rsquo;s on your mind?';
  }
  inputField.focus();
}

renderItems();

let windowHeight = window.innerHeight;
window.addEventListener('resize', () => {
  if (windowHeight > window.innerHeight) {
    // Keyboard is displayed
    document.body.style.height = 'auto';
    document.body.style.overflow = 'hidden';
    const height = window.innerHeight + 'px';
    document.body.style.height = height;
  } else {
    // Keyboard is hidden
    document.body.style.height = 'auto';
    document.body.style.overflow = 'auto';
  }
  windowHeight = window.innerHeight;
});
