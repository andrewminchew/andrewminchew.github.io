const chores = [
    "Kitchen: Empty dishwasher",
    "Kitchen: Empty trash",
    "Kitchen: Empty recycling",
    "Guest bathroom toilet",
    "Guest bathroom floor",
    "Guest bathroom mirror",
    "Guest bathroom trashcan",
    "Guest bathroom counter",
    "Upstairs bathroom toilet",
    "Upstairs bathroom floor",
    "Upstairs bathroom trashcan"
];

function loadChores() {
    const choreListElement = document.getElementById('choreList');
    choreListElement.innerHTML = ''; // Clear existing chores

    chores.forEach(chore => {
        const choreElement = document.createElement('div');
        choreElement.className = 'chore';

        const choreName = document.createElement('span');
        choreName.textContent = chore;
        choreElement.appendChild(choreName);

        const lastDoneBy = localStorage.getItem(chore) || 'Not done yet';
        const status = document.createElement('div');
        status.textContent = `Last done by: ${lastDoneBy}`;
        choreElement.appendChild(status);

        const billyButton = document.createElement('button');
        billyButton.textContent = 'Billy did this';
        billyButton.onclick = () => setChoreDoer(chore, 'Billy', status);
        choreElement.appendChild(billyButton);

        const bruceButton = document.createElement('button');
        bruceButton.textContent = 'Bruce did this';
        bruceButton.onclick = () => setChoreDoer(chore, 'Bruce', status);
        choreElement.appendChild(bruceButton);

        choreListElement.appendChild(choreElement);
    });
}

function setChoreDoer(chore, doer, statusElement) {
    localStorage.setItem(chore, doer);
    statusElement.textContent = `Last done by: ${doer}`;
}

// Initial loading of chores
document.addEventListener('DOMContentLoaded', loadChores);
