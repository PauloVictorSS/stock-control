import { db, collection, getDocs } from "../../config/firebase.js"

let allClients = [];

async function getAllClients() {

    const clientsCol = collection(db, 'clients');
    const clientSnapshot = await getDocs(clientsCol);

    allClients = clientSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}
function graphicProfitInPeriod() {

    const inputFirstDate = document.querySelector('#firstDate');
    const inputLastDate = document.querySelector('#lastDate');

    if (inputFirstDate.value != "" && inputLastDate.value != "") {

        let result = allClients.filter((client) => {

            if (client.lastDate != "") {

                const isBiggerThanFirstDate = (inputFirstDate.value <= client.lastDate);
                const isSmallerThanFirstDate = (client.lastDate <= inputLastDate.value);
                const hasABudget = (client.budget != "" && client.budget != "0");
                const isApproved = (client.approval == "Sim");

                return isBiggerThanFirstDate && isSmallerThanFirstDate && hasABudget && isApproved;
            }
            return false;
        })

        if (result.length != 0) {

            let total = 0;

            result.forEach(element => {
                total += parseInt(element.budget);
            });

            addAMensageText('#contentProfitInPeriod #graphic', "Total de lucro obtido nesse período: R$" + total)
        }
        else {
            addAMensageText('#contentProfitInPeriod #graphic', 'Sem resultados para essa consulta')
        }
    }
    else {
        addAMensageText('#contentProfitInPeriod #graphic', 'Preencha ambas as datas para fazer a consulta')
    }
}

function addAMensageText(local, text) {

    let h4 = document.querySelector('#mensagem');
    if (h4 != null)
        h4.remove();

    const div = document.querySelector(local);
    h4 = document.createElement("h4");

    h4.setAttribute("id", "mensagem");

    h4.innerText = text;
    div.appendChild(h4);
}

function setAllEventsListeners() {

    const buttonCreateGraphic = document.querySelector('#toCreateGraphic');
    buttonCreateGraphic.addEventListener('click', graphicProfitInPeriod);
}

await getAllClients()

setAllEventsListeners()