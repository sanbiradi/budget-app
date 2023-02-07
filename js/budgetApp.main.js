class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }

  showAlerts(msg, color, check) {
    if (check === "budget") {
      this.budgetFeedback.classList += ` showItem alert-${color}`;
      this.budgetFeedback.innerHTML = msg;
      setTimeout(() => {
        this.budgetFeedback.classList.remove("showItem");
      }, 3000);
      de;
    }

    if (check === "expense") {
      this.expenseFeedback.classList += ` showItem alert-${color}`;
      this.expenseFeedback.innerHTML = msg;

      setTimeout(() => {
        this.expenseFeedback.classList.remove("showItem");
      }, 3000);
    }
  }

  addBalanceBudget(budget) {
    this.budgetAmount.innerHTML = budget;
    this.balanceAmount.innerHTML = budget;
    localStorage.setItem("budget", JSON.stringify(budget));
    localStorage.setItem("balance", JSON.stringify(budget));
    // localStorage.setItem('expense',JSON.stringify( Number(this.expenseAmount.innerHTML)));
  }

  saveExpenses(expenseTitle, expenseAmount) {
    this.itemList.push({ expenseTitle, expenseAmount });
    let id = this.itemList.length - 1;
    localStorage.setItem("expenses", JSON.stringify(this.itemList));
    const div = document.createElement("div");
    div.innerHTML = `
    <div class="expense mb-2">
      <div class="expense-item d-flex justify-content-between align-items-baseline">

       <h6 class="expense-title mb-0 text-uppercase list-item">-${expenseTitle}</h6>
       <h5 class="expense-amount mb-0 list-item">${expenseAmount}</h5>

       <div class="expense-icons list-item">

       <button class="btn btn-success pr-3 pl-3 btn-sm" data-id="${id}">Edit</button>
       <button class="btn btn-danger pr-3 pl-3 btn-sm" data-id="${id}">Delete</button>
       </div>
      </div>
     </div>`;
    this.expenseList.appendChild(div);
  }

  renderExpenses() {
    this.itemList.map((expense, i) => {
      console.log("\n", expense, i);
      this.expenseList.innerHTML += `
      <div class="expense mb-2">
        <div class="expense-item d-flex justify-content-between align-items-baseline">

         <h6 class="expense-title mb-0 text-uppercase list-item">-${expense.expenseTitle}</h6>
         <h5 class="expense-amount mb-0 list-item">${expense.expenseAmount}</h5>

         <div class="expense-icons list-item">

         <button class="btn btn-success pr-3 pl-3 btn-sm" data-id="${i}">Edit</button>
         <button class="btn btn-danger pr-3 pl-3 btn-sm" data-id="${i}">Delete</button>
         </div>
        </div>
       </div>`;
    });
  }

  calculateBalance(expense, balance) {
    let calculateBalance = balance - expense;
    this.expenseAmount.innerHTML =
      Number(this.expenseAmount.innerHTML) + expense;
    localStorage.setItem(
      "expense",
      JSON.stringify(Number(this.expenseAmount.innerHTML))
    );

    this.balanceAmount.innerHTML = calculateBalance;
    localStorage.setItem("balance", JSON.stringify(calculateBalance));
    this.saveExpenses(this.expenseInput.value, this.amountInput.value);
  }

  init() {
    this.budgetForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let check = true;
      if (this.budgetInput.value === "" || this.budgetInput.value == 0) {
        this.showAlerts(
          "budget value can not be empty, please enter a budget!",
          "danger",
          "budget"
        );
        check = false;
      }

      if (check) this.addBalanceBudget(parseInt(this.budgetInput.value));

      this.budgetInput.value = "";
    });

    this.expenseForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let check = true;

      // form validations
      let doubleEmpty = true;
      if (
        (this.expenseInput.value === "" || this.expenseInput.value == 0) &&
        (this.amountInput.value === "" || this.amountInput.value == 0)
      ) {
        this.showAlerts(
          "expense name, expense amount can not be empty or 0, please enter a expense name!",
          "danger",
          "expense"
        );
        doubleEmpty = false;
        check = false;
      }
      if (
        (this.expenseInput.value === "" || this.expenseInput.value == 0) &&
        doubleEmpty
      ) {
        this.showAlerts(
          "expense name can not be empty, please enter a expense name!",
          "danger",
          "expense"
        );
        check = false;
      }
      if (
        (this.amountInput.value === "" || this.amountInput.value == 0) &&
        doubleEmpty
      ) {
        this.showAlerts(
          "expense amount can not be empty or 0, please enter a expense amount!",
          "danger",
          "expense"
        );
        check = false;
      }

      if (check)
        this.calculateBalance(
          parseInt(this.amountInput.value),
          parseInt(this.balanceAmount.innerHTML)
        );
      this.expenseInput.value = "";
      this.amountInput.value = "";
    });

    this.expenseList.addEventListener("click", (e) => {
      e.preventDefault();
      if (this.itemList.length == 0) {
        this.expenseAmount.innerHTML = 0;
        localStorage.setItem(
          "expense",
          JSON.stringify(Number(this.expenseAmount.innerHTML))
        );
      }
      if (e.target.textContent === "Delete") {
        this.delete(e.target);
      }

      if (e.target.textContent === "Edit") {
        console.log(e.target.parentElement.parentElement)
        this.update(e.target)
      }
    
    });
  }

  update(element){
    let id = element.dataset.id;
    let expenseTitle = String(element.parentElement.parentElement.children[0].textContent).replace('-','');
    let expenseAmount = element.parentElement.parentElement.children[1].textContent;
    element.parentElement.parentElement.remove();
    this.expenseInput.value = expenseTitle;
    this.amountInput.value = expenseAmount;
    this.delete(element);
  }
  delete(element) {
    let id = element.dataset.id;
    element.parentElement.parentElement.remove();
    this.itemList.splice(id, 1);
    localStorage.setItem("expenses", JSON.stringify(this.itemList));
    if (this.itemList.length ===0) {
      this.expenseAmount.innerHTML = 0;
      this.balanceAmount.innerHTML = this.budgetAmount.textContent;

      localStorage.setItem(
        "expense",
        JSON.stringify(0)
      );
    }
  }
}

document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  let ui = new UI();

  ui.itemList = localStorage.getItem("expenses")
    ? JSON.parse(localStorage.getItem("expenses"))
    : [];
  ui.budgetAmount.innerHTML = localStorage.getItem("budget")
    ? JSON.parse(localStorage.getItem("budget"))
    : 0;
  ui.balanceAmount.innerHTML = localStorage.getItem("balance")
    ? JSON.parse(localStorage.getItem("balance"))
    : 0;
  ui.expenseAmount.innerHTML = localStorage.getItem("expense")
    ? JSON.parse(localStorage.getItem("expense"))
    : 0;

  ui.init();
  if (ui.itemList.length ===0) {
    ui.expenseAmount.innerHTML = 0;
    localStorage.setItem(
      "expense",
      JSON.stringify(0)
    );
  }
  ui.renderExpenses();
});
