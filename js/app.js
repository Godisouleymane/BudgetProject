// Constantes pour les éléments HTML
const cardNotification = document.querySelector(".feedback");
const budgetForm = document.getElementById("budget-form");
const budgetInput = document.getElementById("budget-input");
const budgetAmount = document.getElementById("budget-amount");
const expenseAmount = document.getElementById("expense-amount");
const balance = document.getElementById("balance");
const balanceAmount = document.getElementById("balance-amount");
const expenseForm = document.getElementById("expense-form");
const expenseInput = document.getElementById("expense-input");
const amountInput = document.getElementById("amount-input");
const expenseList = document.getElementById("expense-list");
const displayHistory = document.getElementById("display-history");
const historyCard = document.getElementById("history-card");
const closeHistory = document.getElementById("close-history");
const historyContainer = document.getElementById("history-container");
const chartContainer = document.querySelector(".chart-container");
const resetButton = document.getElementById("reset-button");
const divHistory = document.createElement("div");
// Liste d'objets dépense
let itemList = [];
let itemID = 1;



// fonction pour ajouter la notification 

function notification(element, title, message) {
  element.classList.remove("hidden");
  element.innerHTML = `<div class="card">
     <div class="card-header border-0">
         <h4 class="card-title text-center text-white">${title}</h4>
     </div>
     <div class="card-body">
         <h5 class="text-center">${message}</h5>
     </div>
 </div>`
setTimeout(function () {
     element.classList.add("hidden");
     }, 2000);
   

}

// fonction pour soumettre le formulaire du budget 
function negativeValueBudget() {
  if (budgetInput.value < 0) {
    notification(cardNotification, "Ajout de budget", "Le montant de votre budget doit etre positive")
  }
}


function negativeValueAmount() {
  if (amountInput.value < 0) {
    notification(cardNotification, "Ajout de budget", "Le montant de votre budget doit etre positive")
  }
}


function submitBudgetForm() {
  const value = parseInt(budgetInput.value) 
  if (!value || value < 0) {
    notification(cardNotification, "Ajout de budget", "Le montant de votre budget doit etre positive")

  } else if (parseInt(budgetAmount.textContent) > 0){
    const aaa = parseInt(budgetAmount.textContent)
    budgetAmount.textContent = value + aaa
    budgetInput.value = "";
  }
   else {
    notification(cardNotification, "Ajout de budget", "Votre budget a ete ajoute avec success")
    budgetAmount.textContent = value;
    budgetInput.value = "";
  }
  saveBudget(value);
  showBalance();
}

// fonction pour afficher le solde 

function showBalance() {
  const expense = totalExpense();
  const total = parseInt(budgetAmount.textContent) - expense;
  balanceAmount.textContent = total;
  if (total < 0) {
    balanceAmount.classList.remove('showGreen')
    balanceAmount.classList.add("showRed");
  } else if (total > 0) {
    balanceAmount.classList.remove('showRed');
    balanceAmount.classList.add("showGreen");
  } else if (total === 0) {
    balance.classList.remove("showRed");
    balance.classList.add("showGreen");
  }
}


// fonction pour soumettre le formulaire de depense 

function submitExpenseForm() {
  const expenseValue = expenseInput.value;
  const amountValue = amountInput.value;
  if (expenseValue === "" || amountValue === "" || amountValue < 0) {
    notification(cardNotification, "Ajout de depense", "Le montant de votre depense doit etre positive");
  } else {
    notification(cardNotification, "Ajout de depense", "Votre depense a ete ajouter avec success");
    const amount = parseInt(amountValue);
    expenseInput.value = "";
    amountInput.value = "";
    let expense
    let newExpense;
    let position;
    if (itemList.length > 0) {
      itemList.forEach((item, index) => {
        if (item.title === expenseValue) {
          let price = amount + item.amount
          expense = {
            id: item.id,
            title: expenseValue,
            amount: price
          };
          position = index
  
          console.log(item);
        }else {
          newExpense = {
            id: itemID,
            title: expenseValue,
            amount: amount,
          };
          console.log(newExpense);
        }
      })
    } else {
      newExpense = {
        id: itemID,
        title: expenseValue,
        amount: amount,
      };
    }

    if (newExpense) {
      itemID++;
      itemList.push(newExpense);
      addExpense(newExpense);
      
    } else {
      itemList.splice(position, 1, expense)
      addExpense(expense);
    }

    showBalance();
  }
  saveToLocalStorage()

}


// fonction pour ajouter une depense a la lise 

function addExpense(expense) {
  const expenseItem = document.querySelectorAll('.expense-item');

  expenseItem.forEach(element => {
    element.remove();
  })
  
  const div = document.createElement("div");
  div.classList.add("expense");
  itemList.forEach(expense => {
    div.innerHTML += `<div class="expense-item d-flex border-bottom border-primary justify-content-between align-items-baseline">
     <h6 class="expense-title mb-0 text-uppercase list-item">${expense.title}</h6>
     <h5 class="expense-amount mb-0 list-item">${expense.amount} F</h5>
     <div class="expense-icons list-item">
       <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
         <i class="fas fa-edit"></i>
       </a>
       <a href="#" class="delete-icon" data-id="${expense.id}">
         <i class="fas fa-trash"></i>
       </a>
     </div>
   </div>`;

  })
  
  expenseList.appendChild(div);



divHistory.classList.add("expense");

divHistory.innerHTML = `<div class="w-100 d-flex justify-content-between text-secondary"><p>0${expense.id}</p><p>${expense.title}</p><p>${expense.amount}</p></div>`

historyContainer.appendChild(divHistory);

// Ajouter la nouvelle dépense aux tableaux
    // Mettre à jour les données du graphique
    myDoughnutChart.data.labels.push(expense.title);
    myDoughnutChart.data.datasets[0].data.push(expense.amount);
    myDoughnutChart.data.datasets[0].backgroundColor.push(getRandomColor());

 // Mettre à jour le graphique
  myDoughnutChart.update();
}


function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}



// fonction pour calculer la depense totale
function totalExpense() {
  let total = 0;
  if (itemList.length > 0) {
    total = itemList.reduce(function (acc, curr) {
      acc += curr.amount;
      return acc;
    }, 0);
  }
  expenseAmount.textContent = total;
  return total;
}


// fonction pour editer une depense 

function editExpense(element) {
  const id = parseInt(element.dataset.id);
  const supprimIndex = itemList.findIndex(function (item) {
    return item.id === id;
  });
  
  console.log(supprimIndex);
  
  console.log(myDoughnutChart.data);
  if (supprimIndex >= 0) {
    myDoughnutChart.data.labels.splice(supprimIndex, 1)
    myDoughnutChart.data.datasets[0].data.splice(supprimIndex, 1)
    myDoughnutChart.data.datasets[0].backgroundColor.splice(supprimIndex, 1)
    // Mettre à jour le graphique
    myDoughnutChart.update();
  }
 

  const expense = itemList.find(function (item) {
    return item.id === id;
  });

  expenseInput.value = expense.title;
  amountInput.value = expense.amount;

  const tempList = itemList.filter(function (item) {
    return item.id !== id;
  });

  itemList = tempList;
  showBalance();
  saveToLocalStorage();
  myDoughnutChart.update();
}

// Fonction pour supprimer une dépense
function deleteExpense(element) {
  const id = parseInt(element.dataset.id);
  const parent = element.parentElement.parentElement.parentElement;
  expenseList.removeChild(parent);

  const tempList = itemList.filter(function (item) {
    return item.id !== id;
  });

  itemList = tempList;
  saveToLocalStorage();
  showBalance();

  const supprimIndex = itemList.findIndex(function (item) {
    return item.id === id;
  });

  console.log("liste", itemList);
  console.log("chart", supprimIndex);
  console.log("id de la depense", id);
  
  if (supprimIndex) {
    myDoughnutChart.data.labels.splice(supprimIndex, 1)
    myDoughnutChart.data.datasets[0].data.splice(supprimIndex, 1)
    myDoughnutChart.data.datasets[0].backgroundColor.splice(supprimIndex, 1)
    // Mettre à jour le graphique
    myDoughnutChart.update();
  }
  
  const supprimHistory = itemList.findIndex(function(item) {
    return item.id === id;
  });
  
  console.log("history", supprimHistory);
  if (supprimHistory) {
    historyContainer.removeChild(divHistory);
  }


}
// ajout d'evenement 

budgetForm.addEventListener('submit', function (event) {
  event.preventDefault();
  submitBudgetForm();
})

expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();
  submitExpenseForm();
});

expenseList.addEventListener("click", function (event) {
  if (event.target.parentElement.classList.contains("edit-icon")) {
    editExpense(event.target.parentElement);
  } else if (event.target.parentElement.classList.contains("delete-icon")) {
    deleteExpense(event.target.parentElement);
  }
});


historyCard.addEventListener("click", function (){
  displayHistory.classList.remove('hidden')
})

closeHistory.addEventListener("click", function () {
  displayHistory.classList.add("hidden");
})

resetButton.addEventListener("click", function () {
  itemList = [];
  itemID = 0;
  localStorage.clear();
  historyContainer.innerHTML = "";
  const expenseItem = document.querySelectorAll('.expense-item');

  expenseItem.forEach(element => {
    element.remove();
  })

  myDoughnutChart.data.labels = [];
  myDoughnutChart.data.datasets[0].data = [];
  myDoughnutChart.data.datasets[0].backgroundColor = [];
  myDoughnutChart.update();

  balanceAmount.textContent = "0";
  budgetAmount.textContent = "0";
  expenseAmount.textContent = "0"
  balanceAmount.classList.remove("showGreen", "showRed");
});


let myChart = document.getElementById('myDoughnutChart');
let myDoughnutChart = new Chart(myChart, {
  type: 'doughnut',
  data: {
    labels: [], 
    datasets: [{
      data: [], 
      backgroundColor: [], 
      borderColor: [],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
   },
   
 });

 function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


localStorage.setItem("name", "Souleymane");
localStorage.setItem("age", "21");

console.log(localStorage.getItem("name"));


 function saveToLocalStorage() {
   localStorage.setItem("itemList", JSON.stringify(itemList));
   localStorage.setItem("itemID", itemID);
 }


// // Fonction pour charger les données depuis le localStorage
function loadFromLocalStorage() {
  if (localStorage.getItem("itemList")) {
    itemList = JSON.parse(localStorage.getItem("itemList"));
    itemID = parseInt(localStorage.getItem("itemID"));
    itemList.forEach(function (expense) {
      addExpense(expense);
    });
    showBalance();
  }
}
loadFromLocalStorage();


function saveBudget(budget) {
  localStorage.setItem("budget", budget);
}

// fonction pour charger saveBudget

function loadBudget() {
  if (localStorage.getItem("budget")) {
    const budgetSave = localStorage.getItem("budget");
    budgetAmount.textContent = budgetSave;
    showBalance()
  }
}

loadBudget();

