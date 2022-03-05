const { database } = require("../../config/firebase.js")

let allPartsAndEquipaments = []
let arrayFilted = []

async function getAllPartsAndEquipaments() {

    const data = await database.collection("partsAndEquipaments").get();
    allPartsAndEquipaments = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}

function toTableListComponents(arrayWithPaginations) {

    const tbody = document.querySelector('#tbody');
    let newTBody = document.createElement('tbody');

    newTBody.setAttribute('id', 'tbody')

    for (let i = 0; i < arrayWithPaginations.length; i++) {

        const component = arrayWithPaginations[i];
        const properties = ['type', 'brand', 'model', 'qtd', 'application'];

        let tr = newTBody.insertRow();
        tr.setAttribute('id', component.id);

        properties.forEach(property => {
            let td = tr.insertCell()

            td.setAttribute('id', property + '_' + component.id)
            td.innerText = component[property];
        });

        let td = tr.insertCell();
        td.setAttribute('class', 'buttonTD');

        let buttonEdit = document.createElement('button');
        let buttonDelete = document.createElement('button');

        buttonEdit.innerText = "Visualizar"
        buttonDelete.innerText = "Deletar"

        buttonEdit.setAttribute('class', 'buttonGreen');
        buttonDelete.setAttribute('class', 'buttonRed');

        buttonEdit.addEventListener('click', () => { toEditEquipament(component) });
        buttonDelete.addEventListener('click', () => { deleteComponent(component.id) });

        td.appendChild(buttonEdit);
        td.appendChild(buttonDelete);
    }

    tbody.parentNode.replaceChild(newTBody, tbody)
}

function applyFilter() {

    const search = document.querySelector("#searchInput");

    if (search.value != "") {

        const table = document.querySelector("table");
        const divPagination = document.querySelector("div#divPagination");
        table.setAttribute("class", "");
        divPagination.setAttribute("class", "");

        let result = allPartsAndEquipaments.filter((equipament) => {

            let searchValue = search.value.toLowerCase();

            let hasACorrectType = equipament.type.toLowerCase().includes(searchValue);
            let hasACorrectBrand = equipament.brand.toLowerCase().includes(searchValue);
            let hasACorrectModel = equipament.model.toLowerCase().includes(searchValue);

            return hasACorrectType || hasACorrectBrand || hasACorrectModel;
        })

        result.sort((a, b) => (
            (a.type.toLowerCase() < b.type.toLowerCase()) ? -1 : true
        ));

        arrayFilted = result;

        createButtonsPagiantion(arrayFilted, toTableListComponents)

        if (arrayFilted.length > 0) {
            const oldPagination = document.querySelector("#paginationSelected");
            const newPagination = document.querySelector(".id1");

            oldPagination.removeAttribute('id')
            newPagination.setAttribute('id', 'paginationSelected');

            applyPagination(arrayFilted, toTableListComponents);
        }
        else {
            toTableListComponents(arrayFilted);
        }
    }
    else {

        const table = document.querySelector("table");
        const divPagination = document.querySelector("div#divPagination");
        table.setAttribute("class", "none");
        divPagination.setAttribute("class", "none");
    }
}

function changeStatusModal(modal) {

    const modalDocument = document.querySelector(modal);

    let classes = modalDocument.className;

    if (classes.indexOf('show') != -1)
        modalDocument.setAttribute('class', 'modal');
    else
        modalDocument.setAttribute('class', 'modal show');
}

function toAddNewEquipament() {

    document.querySelector("#titleCardComponent").innerText = "NOVA PEÇA/EQUIPAMENTO"
    let allInputs = document.querySelectorAll("div#addNewEquipament input, div#addNewEquipament textarea");

    allInputs.forEach(input => {
        input.value = "";
    });

    document.querySelector("#addButton").setAttribute('class', 'buttonGreen');
    document.querySelector("#editButton").setAttribute('class', 'buttonGreen none');

    changeStatusModal('#addNewEquipament')
}

function toEditEquipament(component) {

    document.querySelector("#titleCardComponent").innerText = "EDITAR PEÇA/EQUIPAMENTO"
    const allInputs = document.querySelectorAll("div#addNewEquipament input, div#addNewEquipament textarea");

    allInputs.forEach(input => {
        input.value = component[input.id];
    });

    document.querySelector("#editButton").setAttribute('class', 'buttonGreen');
    document.querySelector("#addButton").setAttribute('class', 'buttonGreen none');

    document.querySelector("#editButton").value = component.id;

    changeStatusModal('#addNewEquipament')
}

async function addNewEquipament() {

    const allInputs = document.querySelectorAll("div#addNewEquipament input, div#addNewEquipament textarea");

    let newEquipament = {};

    allInputs.forEach(input => {
        newEquipament[input.id] = input.value;
    });

    await database.collection("partsAndEquipaments").add(newEquipament);

    applyFilter();
    window.location.reload();
}

async function editComponent() {

    const id = document.querySelector("#editButton").value
    const allInputs = document.querySelectorAll("div#addNewEquipament input, div#addNewEquipament textarea");

    let newEquipament = {};

    allInputs.forEach(input => {
        newEquipament[input.id] = input.value;
    });

    await database.collection("partsAndEquipaments").doc(id).set(newEquipament);

    applyFilter();
    window.location.reload();
}

async function deleteComponent(id) {


    await database.collection("partsAndEquipaments").doc(id).delete();
    window.location.reload();
}

function setAllEventsListeners() {

    //Setando o litener referente ao campo de pesquisa
    const inputNameSearched = document.querySelector('#searchInput');
    inputNameSearched.addEventListener('change', applyFilter);

    //Setando o litener do botão de abrir o modal de adicionar uma peça ou um equipamento
    const toAddNewEquipamentButton = document.querySelector('#toAddNewEquipament');
    toAddNewEquipamentButton.addEventListener('click', toAddNewEquipament);

    //Setando os liteners dos botões de adicionar e editar determinado uma peça ou um equipamento
    const addButton = document.querySelector('#addButton');
    const editButton = document.querySelector('#editButton');

    addButton.addEventListener('click', addNewEquipament);
    editButton.addEventListener('click', editComponent);

    //Setando os liteners dos botões de abrir/fechar o modal
    const closeFirstModalButton = document.querySelector('#closeFirstModal');
    closeFirstModalButton.addEventListener('click', () => { changeStatusModal('#addNewEquipament') });
}

getAllPartsAndEquipaments()
setAllEventsListeners()