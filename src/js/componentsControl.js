import { db, setCollection, getAllDocs, addDocument, setDocument, documentFirebase, deleteDocument } from "../config/firebase.js"

let allComponents = []
let arrayFilted = []

async function getAllComponents() {

    const componentsCol = setCollection(db, 'components');
    const componentSnapshot = await getAllDocs(componentsCol);

    allComponents = componentSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
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

        buttonEdit.innerText = "Editar"
        buttonDelete.innerText = "Deletar"

        buttonEdit.setAttribute('class', 'buttonGreen');
        buttonDelete.setAttribute('class', 'buttonRed');

        buttonEdit.addEventListener('click', () => { toEditComponent(component.id) });
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

    let result = allComponents.filter((component) => {

        return component.name.toLowerCase().includes(searchName.value.toLowerCase()) &&
            component.local.toLowerCase().includes(localName.value.toLowerCase());
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

    document.querySelector("#nameAddInput").value = "";
    document.querySelector("#qtdAddInput").value = "";
    document.querySelector("#localAddInput").value = "";
    document.querySelector("#descriptionAddInput").value = "";

    document.querySelector("#addButton").setAttribute('class', 'buttonGreen');
    document.querySelector("#editButton").setAttribute('class', 'buttonGreen none');

    changeStatusModal('#addNewComponent')
}

async function addNewComponent() {

    const name = document.querySelector("#nameAddInput").value;
    const qtd = document.querySelector("#qtdAddInput").value;
    const local = document.querySelector("#localAddInput").value;
    const description = document.querySelector("#descriptionAddInput").value;

    if (name != "" || qtd != "" || local != "" || description != "") {

        const newComponent = {
            name,
            qtd,
            local,
            description,
            lastUpdate: new Date()
        }

        await addDocument(setCollection(db, "components"), newComponent);
        document.querySelector("#textMensage").innerText = "Componente adicionado com sucesso!";

        applyFilter();
        window.location.reload();
    }
    else {
        document.querySelector("#textMensage").innerText = "Preencha algum campos";
    }
    changeStatusModal("#mensageModal");
}

async function editComponent() {

    const id = document.querySelector("#editButton").value
    const name = document.querySelector("#nameAddInput").value;
    const qtd = document.querySelector("#qtdAddInput").value;
    const local = document.querySelector("#localAddInput").value;
    const description = document.querySelector("#descriptionAddInput").value;

    if (name != "" || qtd != "" || local != "" || description != "") {

        const newComponent = {
            name,
            qtd,
            local,
            description,
            lastUpdate: new Date()
        }

        await setDocument(documentFirebase(db, "components", id), newComponent);
        document.querySelector("#textMensage").innerText = "Componente editado com sucesso!";

        applyFilter();
        window.location.reload();
    }
    else {
        document.querySelector("#textMensage").innerText = "Não deixei nenhum campo vazio";
    }

    changeStatusModal("#mensageModal");
}

async function deleteComponent(id) {

    await deleteDocument(documentFirebase(db, "components", id));
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

    //Setando os liteners dos botões de abrir/fechar os modais
    const closeFirstModalButton = document.querySelector('#closeFirstModal');
    const changeMensageModalButton = document.querySelector('#changeMensageModal');

    closeFirstModalButton.addEventListener('click', () => { changeStatusModal('#addNewComponent') });
    changeMensageModalButton.addEventListener('click', () => { changeStatusModal('#mensageModal') });
}

await getAllComponents()
applyFilter()
setAllEventsListeners()