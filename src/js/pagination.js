const numberPagination = 6

function setNewPagination(id, arrayFilted, toTableListComponents) {

    const oldPagination = document.querySelector("#paginationSelected");
    const newPagination = document.querySelector(id);

    oldPagination.removeAttribute('id')
    newPagination.setAttribute('id', 'paginationSelected');

    applyPagination(arrayFilted, toTableListComponents)
}

function applyPagination(arrayResult, arrayToTableListHTML) {

    const paginationSelected = document.querySelector("#paginationSelected");

    let start = (parseInt(paginationSelected.value) - 1) * numberPagination
    let newArray = arrayResult.slice(start, start + numberPagination)

    arrayToTableListHTML(newArray);
}

function createButtonsPagiantion(arrayFilted, toTableListComponents) {

    const number = arrayFilted.length
    let limit = 1;
    const divPagination = document.querySelector("#divPagination");

    if (number % numberPagination != 0)
        limit = Math.floor(number / numberPagination) + 1
    else
        limit = number / numberPagination

    divPagination.innerHTML = '';

    for (let cont = 1; cont <= limit; cont++) {

        let newButton = document.createElement('button');

        newButton.innerText = cont
        newButton.setAttribute('value', cont);
        newButton.setAttribute('class', 'buttonPagination');
        newButton.setAttribute('class', 'id' + cont);
        newButton.addEventListener('click', () => { setNewPagination('.id' + cont, arrayFilted, toTableListComponents) });

        if (cont == 1)
            newButton.setAttribute('id', 'paginationSelected');

        divPagination.appendChild(newButton);
    }
}
