const exampleClients = [
    {
        id: 1,
        name: "Fulano",
        fone: "(19) 98317-3555",
        city: "Hortolândia",
        address: "Rua Vitor Hugo José de Souza, 115",
        equipment: "Televisão",
        budget: 100.0,
        model: "Samsung",
        defect: "Só fica em preto e branco",
        technicalEvaluationt: "está assim pq...",
        firstDate: new Date(),
        lastDate: new Date()
    },
    {
        id: 2,
        name: "Ciclano",
        fone: "(19) 98317-3555",
        city: "Hortolândia",
        address: "Rua Vitor Hugo José de Souza, 115",
        equipment: "Televisão",
        budget: 100.0,
        model: "Samsung",
        defect: "Só fica em preto e branco",
        technicalEvaluationt: "está assim pq...",
        firstDate: new Date(),
        lastDate: new Date()
    },
    {
        id: 3,
        name: "Beltrano",
        fone: "(19) 98317-3555",
        city: "Hortolândia",
        address: "Rua Vitor Hugo José de Souza, 115",
        equipment: "Televisão",
        budget: 100.0,
        model: "Samsung",
        defect: "Só fica em preto e branco",
        technicalEvaluationt: "está assim pq...",
        firstDate: new Date(),
        lastDate: new Date()
    },
    {
        id: 4,
        name: "Cliente 01562",
        fone: "(19) 98317-3555",
        city: "Hortolândia",
        address: "Rua Vitor Hugo José de Souza, 115",
        equipment: "Televisão",
        budget: 100.0,
        model: "Samsung",
        defect: "Só fica em preto e branco",
        technicalEvaluationt: "está assim pq...",
        firstDate: new Date(),
        lastDate: new Date()
    },
    {
        id: 5,
        name: "Cliente Teste",
        fone: "(19) 98317-3555",
        city: "Hortolândia",
        address: "Rua Vitor Hugo José de Souza, 115",
        equipment: "Televisão",
        budget: 100.0,
        model: "Samsung",
        defect: "Só fica em preto e branco",
        technicalEvaluationt: "está assim pq...",
        firstDate: new Date(),
        lastDate: new Date()
    }
]

let arrayFilted = []

function arrayToTableListHTML(arrayResult) {

    const tbody = document.querySelector('#tbody');
    let newTBody = document.createElement('tbody');

    newTBody.setAttribute('id', 'tbody')

    for (let i = 0; i < arrayResult.length; i++) {

        let tr = newTBody.insertRow();
        tr.setAttribute('id', arrayResult[i].id)

        for (const key in arrayResult[i]) {

            if (key == 'id' || key == 'name' || key == 'fone' || key == 'equipment' || key == 'budget' || key == 'firstDate') {

                let td = tr.insertCell()

                if (key != 'firstDate')
                    if (key == 'budget')
                        td.innerText = 'R$ ' + arrayResult[i][key];
                    else
                        td.innerText = arrayResult[i][key];
                else
                    td.innerText = arrayResult[i][key].toLocaleDateString();
            }
        }

        let td = tr.insertCell();
        let buttonEdit = document.createElement('button');
        let buttonDelete = document.createElement('button');

        buttonEdit.innerText = "Editar"
        buttonDelete.innerText = "Deletar"

        td.setAttribute('class', 'buttonTD');
        buttonEdit.setAttribute('class', 'buttonGreen');
        buttonDelete.setAttribute('class', 'buttonRed');

        buttonEdit.addEventListener('click', () => { toEditClient(arrayResult[i]) });
        buttonDelete.addEventListener('click', () => { deleteComponent(arrayResult[i].id) });

        td.appendChild(buttonEdit);
        td.appendChild(buttonDelete);
    }

    tbody.parentNode.replaceChild(newTBody, tbody)
}

function applyFilter() {

    const searchName = document.querySelector("#nameComponent");
    const orderBySelector = document.querySelector("#orderBySelect");

    const result = exampleClients.filter((component) => {

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

    createButtonsPagiantion(arrayFilted.length)

    const oldPagination = document.querySelector("#paginationSelected");
    const newPagination = document.querySelector(".id1");

    oldPagination.removeAttribute('id')
    newPagination.setAttribute('id', 'paginationSelected');

    applyPagination(arrayFilted);
}

function changeStatusModal(text) {

    const modalAddNewClient = document.querySelector(text);

    let classes = modalAddNewClient.className;

    if (classes.indexOf('show') != -1)
        modalAddNewClient.setAttribute('class', 'modal');
    else
        modalAddNewClient.setAttribute('class', 'modal show');
}

function addNewClient() {

    const id = document.querySelector("#idClient").innerText;
    const firstDate = document.querySelector("#firstDate").value;
    const lastDate = document.querySelector("#lastDate").value;

    const name = document.querySelector("#nameClient").value;

    const fone = document.querySelector("#foneClient").value;
    const city = document.querySelector("#cityClient").value;
    const address = document.querySelector("#localClient").value;

    const equipment = document.querySelector("#equipment").value;
    const budget = document.querySelector("#equipmentBudget").value;
    const model = document.querySelector("#equipmentModel").value;
    const defect = document.querySelector("#equipmentDefect").value;
    const technicalEvaluationt = document.querySelector("#equipmentTechnicalEvaluationt").value;

    exampleClients.push({
        id,
        name,
        fone,
        city,
        address,
        equipment,
        budget,
        model,
        defect,
        technicalEvaluationt,
        firstDate,
        lastDate
    });
    document.querySelector("#textMensage").innerText = "Cliente adicionado com sucesso!";

    applyFilter();
    changeStatusModal("#addNewClient");
    changeStatusModal("#mensageModal");
}

function toAddNewClient() {

    document.querySelector("#idClient").innerText = exampleClients.length + 1;
    document.querySelector("#firstDate").value = "";
    document.querySelector("#lastDate").value = "";

    document.querySelector("#nameClient").value = "";

    document.querySelector("#foneClient").value = "";
    document.querySelector("#cityClient").value = "";
    document.querySelector("#localClient").value = "";

    document.querySelector("#equipment").value = "";
    document.querySelector("#equipmentBudget").value = "";
    document.querySelector("#equipmentModel").value = "";
    document.querySelector("#equipmentDefect").value = "";
    document.querySelector("#equipmentTechnicalEvaluationt").value = "";

    document.querySelector("#addButton").setAttribute('class', 'buttonGreen');
    document.querySelector("#editButton").setAttribute('class', 'buttonGreen none');

    changeStatusModal('#addNewClient')
}

function toEditClient(client) {

    console.log(client.firstDate.toLocaleDateString());

    document.querySelector("#idClient").innerText = client.id;
    document.querySelector("#firstDate").value = client.firstDate.toLocaleDateString();
    document.querySelector("#lastDate").value = client.lastDate.toLocaleDateString();

    document.querySelector("#nameClient").value = client.name;

    document.querySelector("#foneClient").value = client.fone;
    document.querySelector("#cityClient").value = client.city;
    document.querySelector("#localClient").value = client.address;

    document.querySelector("#equipment").value = client.equipment;
    document.querySelector("#equipmentBudget").value = client.budget;
    document.querySelector("#equipmentModel").value = client.model;
    document.querySelector("#equipmentDefect").value = client.defect;
    document.querySelector("#equipmentTechnicalEvaluationt").value = client.technicalEvaluationt;

    document.querySelector("#editButton").setAttribute('class', 'buttonGreen');
    document.querySelector("#addButton").setAttribute('class', 'buttonGreen none');

    changeStatusModal('#addNewClient')
}


function editClient() {

    const id = document.querySelector("#idClient").innerText;
    const firstDate = document.querySelector("#firstDate").value;
    const lastDate = document.querySelector("#lastDate").value;

    const name = document.querySelector("#nameClient").value;

    const fone = document.querySelector("#foneClient").value;
    const city = document.querySelector("#cityClient").value;
    const address = document.querySelector("#localClient").value;

    const equipment = document.querySelector("#equipment").value;
    const budget = document.querySelector("#equipmentBudget").value;
    const model = document.querySelector("#equipmentModel").value;
    const defect = document.querySelector("#equipmentDefect").value;
    const technicalEvaluationt = document.querySelector("#equipmentTechnicalEvaluationt").value;

    console.log({
        id,
        name,
        fone,
        city,
        address,
        equipment,
        budget,
        model,
        defect,
        technicalEvaluationt,
        firstDate,
        lastDate
    });
    document.querySelector("#textMensage").innerText = "Cliente editado com sucesso!";

    applyFilter();

    changeStatusModal("#addNewClient");
    changeStatusModal("#mensageModal");
}

function deleteComponent(id) {
    console.log(`Deletei: ${id}`);
}

function mascara() {

    let telefone = document.querySelector("#foneClient")
    let v = telefone.value

    v = v.replace(/\D/g, "")
    v = v.replace(/^(\d\d)(\d)/g, "($1) $2")

    if (telefone.value.length <= 14)
        v = v.replace(/(\d{4})(\d)/, "$1-$2")
    else if (telefone.value.length === 15)
        v = v.replace(/(\d{5})(\d)/, "$1-$2")

    document.querySelector("#foneClient").value = v
}

applyFilter()