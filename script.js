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

// Enhanced individual item deletion for better performance
const modifyList = (element, edit = false) => {
    let parentDiv = element.parentElement;
    // Handle case where button might be nested differently
    while (parentDiv && !parentDiv.classList.contains('sublist-content')) {
        parentDiv = parentDiv.parentElement;
    }
    
    if (!parentDiv) return; // Safety check
    
    let parentAmount = parseInt(
        parentDiv.querySelector(".amount")
            ? parentDiv.querySelector(".amount").innerText
            : parentDiv.querySelector(".col-amount").innerText
    );

    if (edit) {
        let parentText = parentDiv.querySelector(".product")
            ? parentDiv.querySelector(".product").innerText
            : parentDiv.querySelector(".col-name").innerText;
        productTitle.value = parentText;
        userAmount.value = parentAmount;
        disableButtons(true);
    }

    // Remove the item with animation
    parentDiv.classList.add("fade-out");
    setTimeout(() => {
        parentDiv.remove();

        // Recalculate total expenses and balance with improved performance
        // This uses reduce instead of forEach for better performance with large lists
        let newExpenditure = Array.from(document.querySelectorAll(".col-amount"))
            .reduce((sum, el) => sum + parseInt(el.innerText || 0), 0);
        
        expenditureValue.innerText = newExpenditure;
        balanceValue.innerText = tempAmount - newExpenditure;

        saveToLocalStorage();
    }, 300);
};

const listCreater = (expenseName, expenseValue) => {
    let sublistContent = document.createElement("div");
    sublistContent.classList.add("sublist-content", "flex-space");
    
    // Create columns
    let nameCol = document.createElement("div");
    nameCol.classList.add("col-name");
    nameCol.innerText = expenseName;

    let amountCol = document.createElement("div");
    amountCol.classList.add("col-amount");
    amountCol.innerText = expenseValue;

    let actionsCol = document.createElement("div");
    actionsCol.classList.add("col-actions");

    let editButton = document.createElement("button");
    editButton.classList.add("fa", "fa-pen-to-square", "edit");
    editButton.style.fontSize = "24px";
    editButton.addEventListener("click", () => {
        modifyList(editButton.parentElement.parentElement, true);
    });

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("fa", "fa-trash", "delete");
    deleteButton.style.fontSize = "24px";
    deleteButton.addEventListener("click", () => {
        sublistContent.classList.add("fade-out");
        setTimeout(() => {
            modifyList(deleteButton);
        }, 300);
    });

    actionsCol.appendChild(editButton);
    actionsCol.appendChild(deleteButton);

    sublistContent.appendChild(nameCol);
    sublistContent.appendChild(amountCol);
    sublistContent.appendChild(actionsCol);
    list.appendChild(sublistContent);
    saveToLocalStorage();
};

const reattachEventListeners = () => {
    // More efficient event delegation for large lists
    if (list) {
        // First, remove any existing event listeners to prevent duplicates
        list.onclick = null;
        
        // Use a single event listener with event delegation
        list.addEventListener("click", (event) => {
            // Handle edit button clicks
            if (event.target.classList.contains("edit")) {
                const button = event.target;
                let parentElement = button.parentElement;
                while (parentElement && !parentElement.classList.contains('sublist-content')) {
                    parentElement = parentElement.parentElement;
                }
                if (parentElement) {
                    modifyList(parentElement, true);
                }
            }
            
            // Handle delete button clicks
            if (event.target.classList.contains("delete")) {
                const button = event.target;
                let parentElement = button.closest('.sublist-content');
                if (parentElement) {
                    parentElement.classList.add('fade-out');
                    setTimeout(() => {
                        modifyList(button);
                    }, 300);
                }
            }
        });
    }
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

// Optimized Delete All functionality for large lists
const deleteAllButton = document.getElementById("delete-all");
if (deleteAllButton) {
    deleteAllButton.addEventListener("click", function handleDeleteAll() {
        const items = document.querySelectorAll(".sublist-content");
        
        // Check if there are items to delete
        if (items.length === 0) {
            return;
        }
        
        // Optional: Show confirmation for large number of items
        if (items.length > 10) {
            if (!confirm(`Are you sure you want to delete all ${items.length} items?`)) {
                return;
            }
        }
        
        // Performance optimization: batch process items with animation
        // This prevents browser slowdown when many items are being animated
        const batchSize = 50;
        const totalBatches = Math.ceil(items.length / batchSize);
        
        for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
            const startIdx = batchIndex * batchSize;
            const endIdx = Math.min(startIdx + batchSize, items.length);
            
            setTimeout(() => {
                for (let i = startIdx; i < endIdx; i++) {
                    items[i].classList.add("fade-out");
                }
            }, batchIndex * 50); // Stagger batches for better performance
        }
        
        // After all animations have started, clear everything at once
        setTimeout(() => {
            // Use innerHTML for better performance with large lists
            list.innerHTML = "";
            expenditureValue.innerText = "0";
            balanceValue.innerText = tempAmount;
            saveToLocalStorage();
        }, (totalBatches * 50) + 300); // Wait for all batches to start + animation time
    });
}