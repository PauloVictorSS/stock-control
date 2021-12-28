const exampleComponents = [
    {
        id: "ID1",
        name: "componente 2",
        qtd: 32,
        local: "local 2",
        description: "descrição geral do componente",
        lastUpdate: new Date()
    },
    {
        id: "ID2",
        name: "componente 1",
        qtd: 8,
        local: "local 1",
        description: "descrição geral do componente",
        lastUpdate: new Date()
    },
    {
        id: "ID3",
        name: "TIP 41C",
        qtd: 4,
        local: "local 4",
        description: "descrição geral do componente",
        lastUpdate: new Date()
    },
    {
        id: "ID4",
        name: "componente 3",
        qtd: 9,
        local: "local 3",
        description: "descrição geral do componente",
        lastUpdate: new Date()
    },
    {
        id: "ID1",
        name: "componente 2",
        qtd: 32,
        local: "local 2",
        description: "descrição geral do componente",
        lastUpdate: new Date()
    },
    {
        id: "ID2",
        name: "componente 1",
        qtd: 8,
        local: "local 1",
        description: "descrição geral do componente",
        lastUpdate: new Date()
    },
    {
        id: "ID3",
        name: "TIP 42C",
        qtd: 4,
        local: "local 4",
        description: "descrição geral do componente",
        lastUpdate: new Date()
    },
    {
        id: "ID4",
        name: "componente 3",
        qtd: 9,
        local: "local 3",
        description: "descrição geral do componente",
        lastUpdate: new Date()
    }
]

const numberPagination = 3
let arrayFilted = []

function arrayToTableListHTML(arrayResult) {

    const tbody = document.querySelector("#tbody");
    let newTBody = document.createElement('tbody');
    newTBody.setAttribute('id', 'tbody');

    for (let i = 0; i < arrayResult.length; i++) {

        let tr = newTBody.insertRow();

        for (const key in arrayResult[i]) {

            let td = tr.insertCell()

            if (key != 'lastUpdate')
                td.innerText = arrayResult[i][key];
            else
                td.innerText = arrayResult[i][key].toLocaleString();
        }

        let td = tr.insertCell();
        let buttonEdit = document.createElement('button');
        let buttonDelete = document.createElement('button');

        buttonEdit.innerText = "Editar"
        buttonDelete.innerText = "Deletar"

        td.setAttribute('class', 'buttonTD');
        buttonEdit.setAttribute('class', 'buttonGreen');
        buttonDelete.setAttribute('class', 'buttonRed');

        buttonEdit.addEventListener('click', () => { editComponent(arrayResult[i].id) });
        buttonDelete.addEventListener('click', () => { deleteComponent(arrayResult[i].id) });

        td.appendChild(buttonEdit);
        td.appendChild(buttonDelete);
    }

    tbody.parentNode.replaceChild(newTBody, tbody)
}

function applyFilter() {

    const searchName = document.querySelector("#nameComponent");
    const orderBySelector = document.querySelector("#orderBySelect");

    const result = exampleComponents.filter((component) => {

        return component.name.toLowerCase().includes(searchName.value.toLowerCase());
    })

    result.sort((a, b) => {
        if (a[orderBySelector.value] < b[orderBySelector.value])
            return -1;
        else
            return true;
    });

    arrayFilted = result;

    createButtonsPagiantion(arrayFilted.length)

    const oldPagination = document.querySelector("#paginationSelected");
    const newPagination = document.querySelector(".id1");

    oldPagination.removeAttribute('id')
    newPagination.setAttribute('id', 'paginationSelected');

    applyPagination(arrayFilted);
}

function editComponent(id) {

    console.log(`Editei: ${id}`);
}

function deleteComponent(id) {

    console.log(`Deletei: ${id}`);
}

applyFilter()