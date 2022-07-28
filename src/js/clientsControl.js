const { database } = require("../../config/firebase.js")

let allClients = [];
let arrayFilted = [];

async function getAllClients() {

    const data = await database.collection("clients").get();
    allClients = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}

function insertACellOnComponentsTable(component, property, tr) {

    let td = tr.insertCell()
    td.setAttribute('id', property + '_' + component.id)

    if (component[property] != undefined) {

        if (property == "equipment")
            td.innerText = component.equipment + " - " + ((component.brand != "") ? component.brand : "Não espefificada") + " - " + ((component.model != "") ? component.model : "Não espefificado")
        else
            td.innerText = (property != 'firstDate') ? component[property] : component.firstDate.split('-').reverse().join('/');
    }
    else if (property == "budget") {

        if (component.budgetLabor != "" && component.budgetComponent != "")
            td.innerText = parseInt(component.budgetLabor) + parseInt(component.budgetComponent);
        else
            td.innerText = "Sem valor";
    }
    else
        td.innerText = "---";
}

function toTableListComponents(arrayWithPaginations) {

    const tbody = document.querySelector('#tbody');
    let newTBody = document.createElement('tbody');

    newTBody.setAttribute('id', 'tbody')

    for (let i = 0; i < arrayWithPaginations.length; i++) {

        const component = arrayWithPaginations[i];
        const properties = ['id', 'name', 'equipment', 'budget', 'firstDate', 'approval', 'status', 'paid'];

        let tr = newTBody.insertRow();
        tr.setAttribute('id', component.id);

        properties.forEach(property => insertACellOnComponentsTable(component, property, tr));

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

function createAPDF() {

    const elementToPrint = document.querySelector("#element-to-print");
    elementToPrint.setAttribute('class', '');

    const fileName = "ordem_de_serviço_" + document.querySelector("#idClient").innerText + ".pdf"

    const opt = {
        margin: [2, 15],
        filename: fileName,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
            scale: 2
        },
        jsPDF: { orientation: 'landscape' }
    };


    const html2pdf = require('html2pdf.js');

    html2pdf().set(opt).from(elementToPrint).save().then(() => {

        elementToPrint.setAttribute('class', 'none');
    });

}

function inputSearchApplyFilter(client, search){

    const fields = ["name", "equipment", "brand", "model"]
    let condiction = false

    fields.map(field => {
        condiction = condiction || client[field].toLowerCase().includes(search.toLowerCase())
    })

    return condiction
}

function applyFilter() {

    const searchName = document.querySelector("#nameComponent");
    const orderBySelector = document.querySelector("#orderBySelect");
    const selectFilterByApproval = document.querySelector('#filterByApproval');

    if (searchName.value != "" || selectFilterByApproval.value != "") {

        const table = document.querySelector("table");
        const divPagination = document.querySelector("div#divPagination");
        table.setAttribute("class", "");
        divPagination.setAttribute("class", "");

        const result = allClients.filter((client) => {

            let filterName = (searchName.value != "") ? inputSearchApplyFilter(client, searchName.value) : true;
            let filterApproval = (selectFilterByApproval.value != "") ? (client.approval == selectFilterByApproval.value) : true;

            return filterName && filterApproval;
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

    const selectApproval = document.querySelector("select#approval");
    const selectPaid = document.querySelector("select#paid");
    selectApproval.selectedIndex = 0
    selectPaid.selectedIndex = 0

    document.querySelector("#addButton").setAttribute('class', 'buttonGreen');
    document.querySelector("#pdfButton").setAttribute('class', 'buttonGreen none');
    document.querySelector("#editButton").setAttribute('class', 'buttonGreen none');

    changeStatusModal('#addNewClient')
}

function toEditClient(client) {

    document.querySelector("#idClient").innerText = client.id;

    document.querySelector("#element-to-print #idClient").innerText = client.id;
    const allInputs = document.querySelectorAll("div#formsAddClient input, div#formsAddClient textarea");

    allInputs.forEach(input => {
        input.value = (client[input.id] != undefined ? client[input.id] : "");
    });

    const allElementsToPrint = document.querySelectorAll("div#element-to-print p.values");
    allElementsToPrint.forEach(input => {
        input.innerText = client[input.id];
    });

    if (client.approval != undefined) {
        const select = document.querySelector("select#approval");

        if (client.approval == "Pendente")
            select.selectedIndex = 0
        else if (client.approval == "Não")
            select.selectedIndex = 1
        else
            select.selectedIndex = 2
    }
    if (client.paid != undefined) {
        const select = document.querySelector("select#paid");

        if (client.paid == "Não")
            select.selectedIndex = 0
        else
            select.selectedIndex = 1
    }

    let laborCost = (client.budgetLabor != "") ? client.budgetLabor : 0;
    let componentsCost = (client.budgetComponent != "") ? client.budgetComponent : 0;

    let totalBudget = parseInt(laborCost) + parseInt(componentsCost);

    const labelTotalBudget = document.querySelector('#labelTotalBudget');
    labelTotalBudget.innerHTML = totalBudget;

    const pToPrintTotalBudget = document.querySelector('#element-to-print #totalBudget');
    pToPrintTotalBudget.innerHTML = "R$" + totalBudget + ",00";

    document.querySelector("#pdfButton").setAttribute('class', 'buttonGreen');
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

    console.log(newClient);

    const select = document.querySelector("select#approval");
    newClient.approval = select.options[select.selectedIndex].value;

    await database.collection("clients").doc(id).set(newClient);

    applyFilter();
    window.location.reload();
}

async function editClient() {

    const id = document.querySelector("#idClient").innerText;
    const allInputs = document.querySelectorAll("div#formsAddClient input, div#formsAddClient textarea");

    let newClient = {};

    allInputs.forEach(input => {
        newClient[input.id] = (input.value != undefined) ? input.value : ""
    });

    const selectApproval = document.querySelector("select#approval");
    newClient.approval = selectApproval.options[selectApproval.selectedIndex].value;

    const selectPaid = document.querySelector("select#paid");
    newClient.paid = selectPaid.options[selectPaid.selectedIndex].value;

    console.log(newClient)

    await database.collection("clients").doc(id).set(newClient);
    window.location.reload();
}

async function deleteClient(id) {

    await database.collection("clients").doc(id).delete();
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

function changeTotalBudget() {

    const inputBudgetLabor = document.querySelector('#budgetLabor');
    const inputBudgetComponent = document.querySelector('#budgetComponent');

    let laborCost = (inputBudgetLabor.value != "") ? inputBudgetLabor.value : 0;
    let componentsCost = (inputBudgetComponent.value != "") ? inputBudgetComponent.value : 0;

    const labelTotalBudget = document.querySelector('#labelTotalBudget');
    labelTotalBudget.innerHTML = parseInt(laborCost) + parseInt(componentsCost);
}

function setAllEventsListeners() {

    //Setando os liteners referentes aos campos de pesquisa
    const inputNameClient = document.querySelector('#nameComponent');
    const selectOrderBySelect = document.querySelector('#orderBySelect');
    const selectFilterByApproval = document.querySelector('#filterByApproval');

    inputNameClient.addEventListener('change', applyFilter);
    selectOrderBySelect.addEventListener('change', applyFilter);
    selectFilterByApproval.addEventListener('change', applyFilter);

    //Setando o litener do botão de abrir o modal de adicionar cliente
    const toAddNewClientButton = document.querySelector('#toAddNewClient');
    toAddNewClientButton.addEventListener('click', toAddNewClient);

    //Setando o listener para a máscara do input de telefone
    const foneClientInput = document.querySelector('#fone');
    foneClientInput.addEventListener('keypress', mascara);

    //Setando os liteners dos botões de adicionar e editar determinado cliente
    const addButton = document.querySelector('#addButton');
    const editButton = document.querySelector('#editButton');
    const pdfButton = document.querySelector('#pdfButton');

    addButton.addEventListener('click', addNewClient);
    editButton.addEventListener('click', editClient);
    pdfButton.addEventListener('click', createAPDF);

    //Setando os liteners dos input para se calcular o custo total
    const inputBudgetLabor = document.querySelector('#budgetLabor');
    const inputBudgetComponent = document.querySelector('#budgetComponent');

    inputBudgetLabor.addEventListener('change', changeTotalBudget);
    inputBudgetComponent.addEventListener('change', changeTotalBudget);

    //Setando os liteners dos botões de abrir/fechar o modal
    const closeFirstModalButton = document.querySelector('#closeFirstModal');
    closeFirstModalButton.addEventListener('click', () => { changeStatusModal('#addNewClient') });
}

getAllClients()
setAllEventsListeners()