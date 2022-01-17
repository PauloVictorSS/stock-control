import { db, collection, getDocs, setDoc, doc, deleteDoc } from "../../config/firebase.js"

let allClients = [];
let arrayFilted = [];

async function getAllClients() {

    const clientsCol = collection(db, 'clients');
    const clientSnapshot = await getDocs(clientsCol);

    allClients = clientSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}

function toTableListComponents(arrayWithPaginations) {

    const tbody = document.querySelector('#tbody');
    let newTBody = document.createElement('tbody');

    newTBody.setAttribute('id', 'tbody')

    for (let i = 0; i < arrayWithPaginations.length; i++) {

        const component = arrayWithPaginations[i];
        const properties = ['id', 'name', 'fone', 'equipment', 'budget', 'firstDate', 'approval'];

        let tr = newTBody.insertRow();
        tr.setAttribute('id', component.id);

        properties.forEach(property => {

            let td = tr.insertCell()
            td.setAttribute('id', property + '_' + component.id)

            if (component[property] != undefined)
                td.innerText = (property != 'firstDate') ? component[property] : component.firstDate.split('-').reverse().join('/');
            else
                td.innerText = "Sem valor";
        });

        let td = tr.insertCell();
        td.setAttribute('class', 'buttonTD');

        let buttonEdit = document.createElement('button');
        let buttonDelete = document.createElement('button');

        buttonEdit.innerText = "Visualizar"
        buttonDelete.innerText = "Deletar"

        buttonEdit.setAttribute('class', 'buttonGreen');
        buttonDelete.setAttribute('class', 'buttonRed');

        buttonEdit.addEventListener('click', () => { toEditClient(component) });
        buttonDelete.addEventListener('click', () => { deleteClient(component.id) });

        td.appendChild(buttonEdit);
        td.appendChild(buttonDelete);
    }

    tbody.parentNode.replaceChild(newTBody, tbody)
}

function applyFilter() {

    const searchName = document.querySelector("#nameComponent");
    const orderBySelector = document.querySelector("#orderBySelect");

    if (searchName.value != "") {

        const table = document.querySelector("table");
        const divPagination = document.querySelector("div#divPagination");
        table.setAttribute("class", "");
        divPagination.setAttribute("class", "");

        const result = allClients.filter((component) => {

            return component.name.toLowerCase().includes(searchName.value.toLowerCase());
        })

        result.sort((a, b) => {
            if (orderBySelector.value == "name") {
                if (a.name.toLowerCase() < b.name.toLowerCase())
                    return -1;
                else
                    return true;
            }
            else {
                if (a[orderBySelector.value] < b[orderBySelector.value])
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

function changeStatusModal(text) {

    const modalAddNewClient = document.querySelector(text);

    let classes = modalAddNewClient.className;

    if (classes.indexOf('show') != -1)
        modalAddNewClient.setAttribute('class', 'modal');
    else
        modalAddNewClient.setAttribute('class', 'modal show');
}

function toAddNewClient() {

    let newIdClient = 0;

    allClients.forEach(currentClient => {

        if (currentClient.id >= newIdClient)
            newIdClient = parseInt(currentClient.id) + 1;
    });

    document.querySelector("#idClient").innerText = newIdClient;

    const allInputs = document.querySelectorAll("div#formsAddClient input, div#formsAddClient textarea");

    allInputs.forEach(input => {
        input.value = "";
    });

    const select = document.querySelector("select#approval");
    select.selectedIndex = 0

    document.querySelector("#addButton").setAttribute('class', 'buttonGreen');
    document.querySelector("#editButton").setAttribute('class', 'buttonGreen none');

    changeStatusModal('#addNewClient')
}

function toEditClient(client) {

    document.querySelector("#idClient").innerText = client.id;
    const allInputs = document.querySelectorAll("div#formsAddClient input, div#formsAddClient textarea");

    allInputs.forEach(input => {
        input.value = client[input.id];
    });

    if (client.approval != undefined) {
        const select = document.querySelector("select#approval");

        if (client.approval == "Não")
            select.selectedIndex = 0
        else
            select.selectedIndex = 1
    }

    document.querySelector("#editButton").setAttribute('class', 'buttonGreen');
    document.querySelector("#addButton").setAttribute('class', 'buttonGreen none');

    changeStatusModal('#addNewClient')
}

async function addNewClient() {

    const id = document.querySelector("#idClient").innerText;
    const allInputs = document.querySelectorAll("div#formsAddClient input, div#formsAddClient textarea");

    let newClient = {};

    allInputs.forEach(input => {
        newClient[input.id] = input.value
    });

    const select = document.querySelector("select#approval");
    newClient.approval = select.opt[select.selectedIndex].value;

    await setDoc(doc(db, "clients", id), newClient);

    applyFilter();
    window.location.reload();
}

async function editClient() {

    const id = document.querySelector("#idClient").innerText;
    const allInputs = document.querySelectorAll("div#formsAddClient input, div#formsAddClient textarea");

    let newClient = {};

    allInputs.forEach(input => {
        newClient[input.id] = input.value
    });

    const select = document.querySelector("select#approval");
    newClient.approval = select.options[select.selectedIndex].value;

    await setDoc(doc(db, "clients", id), newClient);
    window.location.reload();
}

async function deleteClient(id) {
    await deleteDoc(doc(db, "clients", id));
    window.location.reload();
}

function mascara() {

    let telefone = document.querySelector("#fone")
    let v = telefone.value

    v = v.replace(/\D/g, "")
    v = v.replace(/^(\d\d)(\d)/g, "($1) $2")

    if (telefone.value.length <= 14)
        v = v.replace(/(\d{4})(\d)/, "$1-$2")
    else if (telefone.value.length === 15)
        v = v.replace(/(\d{5})(\d)/, "$1-$2")

    document.querySelector("#fone").value = v
}

function setAllEventsListeners() {

    //Setando os liteners referentes aos campos de pesquisa
    const inputNameClient = document.querySelector('#nameComponent');
    const selectOrderBySelect = document.querySelector('#orderBySelect');

    inputNameClient.addEventListener('change', applyFilter);
    selectOrderBySelect.addEventListener('change', applyFilter);

    //Setando o litener do botão de abrir o modal de adicionar cliente
    const toAddNewClientButton = document.querySelector('#toAddNewClient');
    toAddNewClientButton.addEventListener('click', toAddNewClient);

    //Setando o listener para a máscara do input de telefone
    const foneClientInput = document.querySelector('#fone');
    foneClientInput.addEventListener('keypress', mascara);

    //Setando os liteners dos botões de adicionar e editar determinado cliente
    const addButton = document.querySelector('#addButton');
    const editButton = document.querySelector('#editButton');

    addButton.addEventListener('click', addNewClient);
    editButton.addEventListener('click', editClient);

    //Setando os liteners dos botões de abrir/fechar o modal
    const closeFirstModalButton = document.querySelector('#closeFirstModal');
    closeFirstModalButton.addEventListener('click', () => { changeStatusModal('#addNewClient') });
}

await getAllClients()
setAllEventsListeners()