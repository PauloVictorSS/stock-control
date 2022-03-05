const { database } = require("../../config/firebase.js")

let allComponents = []
let arrayFilted = []

async function getAllComponents() {

    const data = await database.collection("components").get();
    allComponents = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}

function toTableListComponents(arrayWithPaginations) {

    const tbody = document.querySelector('#tbody');
    let newTBody = document.createElement('tbody');

    newTBody.setAttribute('id', 'tbody')

    for (let i = 0; i < arrayWithPaginations.length; i++) {

        const component = arrayWithPaginations[i];
        const properties = ['name', 'qtd', 'local', 'description', 'lastUpdate'];

        let tr = newTBody.insertRow();
        tr.setAttribute('id', component.id);

        properties.forEach(property => {
            let td = tr.insertCell()
            td.setAttribute('id', property + '_' + component.id)

            td.innerText = (property != 'lastUpdate') ? component[property] : component.lastUpdate.toDate().toLocaleString();
        });

        let td = tr.insertCell();
        td.setAttribute('class', 'buttonTD');

        let buttonEdit = document.createElement('button');
        let buttonDelete = document.createElement('button');

        buttonEdit.innerText = "Visualizar"
        buttonDelete.innerText = "Deletar"

        buttonEdit.setAttribute('class', 'buttonGreen');
        buttonDelete.setAttribute('class', 'buttonRed');

        buttonEdit.addEventListener('click', () => { toEditComponent(component) });
        buttonDelete.addEventListener('click', () => { deleteComponent(component.id) });

        td.appendChild(buttonEdit);
        td.appendChild(buttonDelete);
    }

    tbody.parentNode.replaceChild(newTBody, tbody)
}

function applyFilter() {

    const searchName = document.querySelector("#nameComponent");
    const localName = document.querySelector("#nameLocal");
    const orderBySelector = document.querySelector("#orderBySelect");

    if (searchName.value != "" || localName.value != "") {

        const table = document.querySelector("table");
        const divPagination = document.querySelector("div#divPagination");
        table.setAttribute("class", "");
        divPagination.setAttribute("class", "");

        let result = allComponents.filter((component) => {

            if (searchName.value == "")
                return (component.local.toLowerCase() == localName.value.toLowerCase());
            else if (localName.value == "")
                return (component.name.toLowerCase().includes(searchName.value.toLowerCase()) || component.description.toLowerCase().includes(searchName.value.toLowerCase()));
            else
                return (component.local.toLowerCase().includes(localName.value.toLowerCase())) &&
                    (component.name.toLowerCase().includes(searchName.value.toLowerCase()) || component.description.toLowerCase().includes(searchName.value.toLowerCase()));
        })

        result.sort((a, b) => {
            if (orderBySelector.value == "name") {
                if (a.name.toLowerCase() < b.name.toLowerCase())
                    return -1;
                else
                    return true;
            }
            else {
                if (a[orderBySelector.value] > b[orderBySelector.value])
                    return -1;
                else
                    return true;
            }
        });

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

    const modalAddNewComponent = document.querySelector(modal);

    let classes = modalAddNewComponent.className;

    if (classes.indexOf('show') != -1)
        modalAddNewComponent.setAttribute('class', 'modal');
    else
        modalAddNewComponent.setAttribute('class', 'modal show');
}

function toAddNewComponent() {

    document.querySelector("#titleCardComponent").innerText = "NOVO COMPONENTE"
    let allInputs = document.querySelectorAll("div#addNewComponent input, div#addNewComponent textarea");

    allInputs.forEach(input => {
        input.value = "";
    });

    document.querySelector("#addButton").setAttribute('class', 'buttonGreen');
    document.querySelector("#editButton").setAttribute('class', 'buttonGreen none');

    changeStatusModal('#addNewComponent')
}

function toEditComponent(component) {

    document.querySelector("#titleCardComponent").innerText = "EDITAR COMPONENTE"
    const allInputs = document.querySelectorAll("div#addNewComponent input, div#addNewComponent textarea");

    allInputs.forEach(input => {
        input.value = component[input.id];
    });

    document.querySelector("#editButton").setAttribute('class', 'buttonGreen');
    document.querySelector("#addButton").setAttribute('class', 'buttonGreen none');

    document.querySelector("#editButton").value = component.id;

    changeStatusModal('#addNewComponent')
}

async function addNewComponent() {

    const allInputs = document.querySelectorAll("div#addNewComponent input, div#addNewComponent textarea");

    let newComponent = {};

    allInputs.forEach(input => {
        newComponent[input.id] = input.value;
    });

    newComponent.lastUpdate = new Date()

    await database.collection("components").add(newComponent);

    applyFilter();
    window.location.reload();
}

async function editComponent() {

    const id = document.querySelector("#editButton").value
    const allInputs = document.querySelectorAll("div#addNewComponent input, div#addNewComponent textarea");

    let newComponent = {};

    allInputs.forEach(input => {
        newComponent[input.id] = input.value;
    });

    newComponent.lastUpdate = new Date()

    await database.collection("components").doc(id).set(newComponent);

    applyFilter();
    window.location.reload();
}

async function deleteComponent(id) {

    await database.collection("components").doc(id).delete();
    window.location.reload();
}

function setAllEventsListeners() {

    //Setando os liteners referentes aos campos de pesquisa
    const inputNameComponent = document.querySelector('#nameComponent');
    const inputNameLocal = document.querySelector('#nameLocal');
    const selectOrderBySelect = document.querySelector('#orderBySelect');

    inputNameComponent.addEventListener('change', applyFilter);
    inputNameLocal.addEventListener('change', applyFilter);
    selectOrderBySelect.addEventListener('change', applyFilter);

    //Setando o litener do botão de abrir o modal de adicionar componente
    const toAddNewComponentButton = document.querySelector('#toAddNewComponent');
    toAddNewComponentButton.addEventListener('click', toAddNewComponent);

    //Setando os liteners dos botões de adicionar e editar determinado componente
    const addButton = document.querySelector('#addButton');
    const editButton = document.querySelector('#editButton');

    addButton.addEventListener('click', addNewComponent);
    editButton.addEventListener('click', editComponent);

    //Setando os liteners dos botões de abrir/fechar o modal
    const closeFirstModalButton = document.querySelector('#closeFirstModal');
    closeFirstModalButton.addEventListener('click', () => { changeStatusModal('#addNewComponent') });
}

getAllComponents()
setAllEventsListeners()