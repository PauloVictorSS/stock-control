const { database } = require("../../config/firebase.js")

let allClients = [];

async function getAllClients() {

    const data = await database.collection("clients").get();
    allClients = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}
function profitInPeriod() {

    const inputFirstDate = document.querySelector('#firstDate');
    const inputLastDate = document.querySelector('#lastDate');

    if (inputFirstDate.value != "" && inputLastDate.value != "") {

        let result = allClients.filter((client) => {

            if (client.lastDate != "" && client.budgetComponent != undefined) {

                const isBiggerThanFirstDate = (inputFirstDate.value <= client.lastDate);
                const isSmallerThanFirstDate = (client.lastDate <= inputLastDate.value);
                const hasABudget = (client.budgetLabor != "" && client.budgetComponent != "");
                const isApproved = (client.approval == "Sim");

                return isBiggerThanFirstDate && isSmallerThanFirstDate && hasABudget && isApproved;
            }
            return false;
        })

        if (result.length != 0) {

            let text = "";
            let totalBudgetLabor = 0;
            let totalBudgetComponent = 0

            result.forEach(element => {

                const serviceTotalCust = parseInt(element.budgetLabor) + parseInt(element.budgetComponent)

                text += element.equipment + " - " + element.model + ": R$ " + serviceTotalCust + "\n";

                totalBudgetLabor += parseInt(element.budgetLabor);
                totalBudgetComponent += parseInt(element.budgetComponent);
            });

            text += "\nCusto em Mão-de-obra: R$ " + totalBudgetLabor +
                "\nCusto em Componentes: R$ " + totalBudgetComponent +
                "\nTotal de orçamento aprovado nesse período: R$ " + parseInt(totalBudgetLabor + totalBudgetComponent);

            addAMensageText('#contentProfitInPeriod #infosResult', text)
        }
        else {
            addAMensageText('#contentProfitInPeriod #infosResult', 'Sem resultados para essa consulta')
        }
    }
    else {
        addAMensageText('#contentProfitInPeriod #infosResult', 'Preencha ambas as datas para fazer a consulta')
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
    buttonCreateGraphic.addEventListener('click', profitInPeriod);
}

await getAllClients()
setAllEventsListeners()