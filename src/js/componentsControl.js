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

let arrayFilted = []

function arrayToTableListHTML(arrayResult) {

    const tbody = document.querySelector('#tbody');
    let newTBody = document.createElement('tbody');

    newTBody.setAttribute('id', 'tbody')

    for (let i = 0; i < arrayResult.length; i++) {

        let tr = newTBody.insertRow();
        tr.setAttribute('id', arrayResult[i].id)

        for (const key in arrayResult[i]) {

            let td = tr.insertCell()

            td.setAttribute('id', key + '_' + arrayResult[i].id)

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

        buttonEdit.addEventListener('click', () => { toEditComponent(arrayResult[i].id) });
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

    const modalAddNewComponent = document.querySelector(text);

    let classes = modalAddNewComponent.className;

    if (classes.indexOf('show') != -1)
        modalAddNewComponent.setAttribute('class', 'modal');
    else
        modalAddNewComponent.setAttribute('class', 'modal show');
}

function addNewComponent() {

    const name = document.querySelector("#nameAddInput").value;
    const qtd = document.querySelector("#qtdAddInput").value;
    const local = document.querySelector("#localAddInput").value;
    const description = document.querySelector("#descriptionAddInput").value;

    if (name != "" || qtd != "" || local != "" || description != "") {


        exampleComponents.push({
            id: "ID novo",
            name,
            qtd,
            local,
            description,
            lastUpdate: new Date()
        });
        document.querySelector("#textMensage").innerText = "Componente adicionado com sucesso!";

        applyFilter();
        changeStatusModal("#addNewComponent");
    }
    else {

        document.querySelector("#textMensage").innerText = "Preencha todos os campos";
    }
    changeStatusModal("#mensageModal");
}

function toAddNewComponent() {

    document.querySelector("#titleCardComponent").innerText = "NOVO COMPONENTE"

    document.querySelector("#nameAddInput").value = "";
    document.querySelector("#qtdAddInput").value = "";
    document.querySelector("#localAddInput").value = "";
    document.querySelector("#descriptionAddInput").value = "";

    document.querySelector("#addButton").setAttribute('class', 'buttonGreen');
    document.querySelector("#editButton").setAttribute('class', 'buttonGreen none');

    changeStatusModal('#addNewComponent')
}

function toEditComponent(id) {

    document.querySelector("#titleCardComponent").innerText = "EDITAR COMPONENTE"

    document.querySelector("#nameAddInput").value = document.querySelector('#' + 'name_' + id).innerText;
    document.querySelector("#qtdAddInput").value = document.querySelector('#' + 'qtd_' + id).innerText;
    document.querySelector("#localAddInput").value = document.querySelector('#' + 'local_' + id).innerText;
    document.querySelector("#descriptionAddInput").value = document.querySelector('#' + 'description_' + id).innerText;

    document.querySelector("#editButton").setAttribute('class', 'buttonGreen');
    document.querySelector("#addButton").setAttribute('class', 'buttonGreen none');

    document.querySelector("#editButton").value = id;

    changeStatusModal('#addNewComponent')
}


function editComponent() {

    const id = document.querySelector("#editButton").value
    const name = document.querySelector("#nameAddInput").value;
    const qtd = document.querySelector("#qtdAddInput").value;
    const local = document.querySelector("#localAddInput").value;
    const description = document.querySelector("#descriptionAddInput").value;

    if (name != "" || qtd != "" || local != "" || description != "") {


        console.log({
            id,
            name,
            qtd,
            local,
            description,
            lastUpdate: new Date()
        });
        document.querySelector("#textMensage").innerText = "Componente editado com sucesso!";

        applyFilter();
        changeStatusModal("#addNewComponent");
    }
    else {

        document.querySelector("#textMensage").innerText = "Não deixei nenhum campo vazio";
    }

    changeStatusModal("#mensageModal");
}

function deleteComponent(id) {
    console.log(`Deletei: ${id}`);
}

applyFilter()