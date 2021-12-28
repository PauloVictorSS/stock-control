function setNewPagination(id) {

    const oldPagination = document.querySelector("#paginationSelected");
    const newPagination = document.querySelector(id);

    oldPagination.removeAttribute('id')
    newPagination.setAttribute('id', 'paginationSelected');

    applyPagination(arrayFilted)
}

function applyPagination(arrayResult) {

    const paginationSelected = document.querySelector("#paginationSelected");

    let start = (parseInt(paginationSelected.value) - 1) * numberPagination
    let newArray = arrayResult.slice(start, start + numberPagination)

    arrayToTableListHTML(newArray);
}

function createButtonsPagiantion(number) {
    const divPagination = document.querySelector("#pagination");
    let limit = Math.floor(number / (numberPagination + 1)) + 1

    for (let cont = 1; cont <= limit; cont++) {

        let newButton = document.createElement('button');

        newButton.innerText = cont
        newButton.setAttribute('value', cont);
        newButton.setAttribute('class', 'buttonPagination');
        newButton.setAttribute('class', 'id' + cont);
        newButton.addEventListener('click', () => { setNewPagination('.id' + cont) });

        if (cont == 1)
            newButton.setAttribute('id', 'paginationSelected');

        divPagination.appendChild(newButton);
    }
}
