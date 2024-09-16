let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("BudGet-error");
const productTitleError = document.getElementById("product-title-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");
let tempAmount = 0;

window.onload = function () {
    if(localStorage.getItem("totalAmount")){
        tempAmount = parseInt(localStorage.getItem("totalAmount"));
        amount.innerText = tempAmount;
        balanceValue.innerText = localStorage.getItem("balance");
        expenditureValue.innerText = localStorage.getItem("expenditure");
    }

    if(localStorage.getItem("expenseList")){
        list.innerHTML = localStorage.getItem("expenseList");
        reattachEventListeners();
    }
};

const disableButtons = (bool) => {
    const editButtons = document.getElementsByClassName("edit");
    Array.from(editButtons).forEach((element) => {
        element.disabled = bool;
    });
};

const saveToLocalStorage = () => {
    localStorage.setItem("totalAmount", tempAmount);
    localStorage.setItem("balance", balanceValue.innerText);
    localStorage.setItem("expenditure", expenditureValue.innerText);
    localStorage.setItem("expenseList", list.innerHTML);
};

totalAmountButton.addEventListener("click", () => {
    tempAmount = parseInt(totalAmount.value);
    if(isNaN(tempAmount) || tempAmount <= 0){
        errorMessage.classList.remove("hide");
    } else{
        errorMessage.classList.add("hide");
        amount.innerText = tempAmount;
        balanceValue.innerText = tempAmount - parseInt(expenditureValue.innerText);
        totalAmount.value = "";
        saveToLocalStorage();
    }
});

const modifyList = (element, edit = false) => {
    let parentDiv = element.parentElement;
    let currentBalance = parseInt(balanceValue.innerText);
    let currentExpenditure = parseInt(expenditureValue.innerText);
    let parentAmount = parseInt(parentDiv.querySelector(".amount").innerText);

    if(edit){
        let parentText = parentDiv.querySelector(".product").innerText;
        productTitle.value = parentText;
        userAmount.value = parentAmount;
        disableButtons(true);
    }

    balanceValue.innerText = currentBalance + parentAmount;
    expenditureValue.innerText = currentExpenditure - parentAmount;
    parentDiv.remove();
    saveToLocalStorage();
};

const listCreater = (expenseName, expenseValue) => {
    let sublistContent = document.createElement("div");
    sublistContent.classList.add("sublist-content", "flex-space");
    sublistContent.innerHTML = `<p class="product">${expenseName}</p><p class="amount">${expenseValue}</p>`;

    let editButton = document.createElement("button");
    editButton.classList.add("fa", "fa-pen-to-square", "edit");
    editButton.style.fontSize = "24px";
    editButton.addEventListener("click", () => {
        modifyList(sublistContent, true);
    });

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("fa", "fa-trash", "delete");
    deleteButton.style.fontSize = "24px";
    deleteButton.addEventListener("click", () => {
        modifyList(deleteButton);
    });

    sublistContent.appendChild(editButton);
    sublistContent.appendChild(deleteButton);
    list.appendChild(sublistContent);
    saveToLocalStorage();
};

const reattachEventListeners = () => {
    const editButtons = document.getElementsByClassName("edit");
    Array.from(editButtons).forEach((editButton, index) => {
        editButton.addEventListener("click", () => {
            modifyList(editButton.parentElement, true);
        });
    });

    const deleteButtons = document.getElementsByClassName("delete");
    Array.from(deleteButtons).forEach((deleteButton) => {
        deleteButton.addEventListener("click", () => {
            modifyList(deleteButton);
        });
    });
};

checkAmountButton.addEventListener("click", () => {
    if(!userAmount.value || !productTitle.value){
        productTitleError.classList.remove("hide");
        return false;
    }

    productTitleError.classList.add("hide");

    disableButtons(false);

    let expenditure = parseInt(userAmount.value);

    let sum = parseInt(expenditureValue.innerText) + expenditure;
    expenditureValue.innerText = sum;

    const totalBalance = tempAmount - sum;
    balanceValue.innerText = totalBalance;

    listCreater(productTitle.value, userAmount.value);

    productTitle.value = "";
    userAmount.value = "";
});
