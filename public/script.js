let pointerLineNumber = 1;
const parentNode = document.getElementById('arrow-container');
const childNode = document.getElementById('arrow');
const updateBtn = document.getElementById('edit-btn');

const addChildHelper = function (cursorLineNumber) {
    while (pointerLineNumber < cursorLineNumber) {
        const newDiv = document.createElement('div');
        newDiv.classList.add('dummy');
        newDiv.innerHTML = (pointerLineNumber).toString();
        parentNode.insertBefore(newDiv, childNode);
        pointerLineNumber++;
    }
}

const removeChildHelper = function (cursorLineNumber) {
    while (pointerLineNumber > cursorLineNumber) {
        const prevDiv = childNode.previousSibling;
        parentNode.removeChild(prevDiv);
        pointerLineNumber--;
    }
}

const updateDOM = () => {
    const cursorLineNumber = textarea.value.split('\n').length;
    if (cursorLineNumber > pointerLineNumber) {
        addChildHelper(cursorLineNumber);
    } else if (cursorLineNumber < pointerLineNumber) {
        removeChildHelper(cursorLineNumber);
    }
}

const textarea = document.querySelector('textarea');

textarea.addEventListener('keyup', () => {
    updateDOM();
})

textarea.addEventListener('keydown', () => {
    updateDOM();
})

window.addEventListener("load", () => {
    updateDOM();
});

updateBtn.addEventListener('click', async () => {
    const code = document.querySelector('#value').value;
    const url = window.location.href.split('/')[3];
    const result = await fetch(`/${url}/edit`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
    });
    window.location.href = window.location.href.replace('duplicate', 'new');
});