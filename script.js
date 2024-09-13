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

// Set budget part
totalAmountButton.addEventListener("click", () => {
    tempAmount = parseInt(totalAmount.value); // Ensure the value is treated as an integer
    // Empty or negative input
    if (isNaN(tempAmount) || tempAmount <= 0) {
        errorMessage.classList.remove("hide");
    } else {
        errorMessage.classList.add("hide");
        // Set Budget
        amount.innerText = tempAmount;
        // Set Balance
        balanceValue.innerText = tempAmount - parseInt(expenditureValue.innerText);
        // Clear Input Box
        totalAmount.value = "";
    }
});

// Function to disable edit and delete buttons
const disableButtons = (bool) => {
    const editButtons = document.getElementsByClassName("edit");
    Array.from(editButtons).forEach((element) => {
        element.disabled = bool;
    });
};

// Function to modify list elements
const modifyList = (element, edit = false) => {
    let parentDiv = element.parentElement;
    let currentBalance = parseInt(balanceValue.innerText);
    let currentExpenditure = parseInt(expenditureValue.innerText);
    let parentAmount = parseInt(parentDiv.querySelector(".amount").innerText);

    if (edit) {
        let parentText = parentDiv.querySelector(".product").innerText;
        productTitle.value = parentText;
        userAmount.value = parentAmount;
        disableButtons(true);
    }

    balanceValue.innerText = currentBalance + parentAmount;
    expenditureValue.innerText = currentExpenditure - parentAmount;
    parentDiv.remove();
};

// Function to create list
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
};

// Function to add expense
checkAmountButton.addEventListener("click", () => {
    // Empty checks
    if (!userAmount.value || !productTitle.value) {
        productTitleError.classList.remove("hide");
        return false;
    }

    productTitleError.classList.add("hide");
    
    // Enable buttons
    disableButtons(false);
    
    // Expense
    let expenditure = parseInt(userAmount.value);
    
    // Total expense (existing + new)
    let sum = parseInt(expenditureValue.innerText) + expenditure;
    expenditureValue.innerText = sum;
    
    // Total balance (budget - total expense)
    const totalBalance = tempAmount - sum;
    balanceValue.innerText = totalBalance;
    
    // Create list
    listCreater(productTitle.value, userAmount.value);
    
    // Empty inputs
    productTitle.value = "";
    userAmount.value = "";
});
