let chart, db, transactionStore, transaction;
let transactions = [];
const request = window.indexedDB.open("BudgetDB");

// Initial fetch
fetch("/api/transaction")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    transactions = data;
    populateTotal();
    populateTable();
    populateChart();
  });

  // Populates the total transactions
function populateTotal() {
  let total = transactions.reduce((total, t) => {
    return total + parseInt(t.value);
  }, 0);
  let totalEl = document.querySelector("#total");
  totalEl.textContent = total;
}

// Populates the table with each transaction so far
function populateTable() {
  let tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";

  transactions.forEach((transaction) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${transaction.name}</td>
      <td>${transaction.value}</td>
    `;

    tbody.appendChild(tr);
  });
}

// Populates the chart with data and dates
function populateChart() {
  let reversed = transactions.slice().reverse();
  let sum = 0;
  let labels = reversed.map((t) => {
    let date = new Date(t.date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  });
  let data = reversed.map((t) => {
    sum += parseInt(t.value);
    return sum;
  });
  if (chart) {
    chart.destroy();
  }
  let ctx = document.getElementById("myChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Total Over Time",
          fill: true,
          backgroundColor: "#6666ff",
          data,
        },
      ],
    },
  });
}

// Function to change local information into an object and create a fetch request,
// If response has errors it creates an entry in the IndexedDB
function sendTransaction(isAdding) {
  let nameEl = document.querySelector("#t-name");
  let amountEl = document.querySelector("#t-amount");
  let errorEl = document.querySelector(".form .error");

  if (nameEl.value === "" || amountEl.value === "") {
    errorEl.textContent = "Missing Information";
    return;
  } else {
    errorEl.textContent = "";
  }

  let transaction = {
    name: nameEl.value,
    value: amountEl.value,
    date: new Date().toISOString(),
  };

  if (!isAdding) {
    transaction.value *= -1;
  }

  transactions.unshift(transaction);

  populateChart();
  populateTable();
  populateTotal();

  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.errors) {
        errorEl.textContent = "Missing Information";
      } else {
        nameEl.value = "";
        amountEl.value = "";
      }
    })
    .catch((err) => {
      saveRecord(transaction);
      nameEl.value = "";
      amountEl.value = "";
    });
}
// When the IndexedDB is called create a new entry
request.onupgradeneeded = function (event) {
  db = event.target.result;
  transactionStore = db.createObjectStore("transactionStore", {
    autoIncrement: true,
  });
};

// On success check if user is online and then check MongoDB connection
request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

// On indexedDB error console log error
request.onerror = function (event) {
  console.log(event.target.result);
};

// Save a new entry to the indexedDB
function saveRecord(record) {
  transaction = db.transaction(["transactionStore"], "readwrite");
  transactionStore = transaction.objectStore("transactionStore");
  transactionStore.add(record);
}

// Function to check entries in indexedDB and then bulk send all locally stored entries
function checkDatabase() {
  transaction = db.transaction(["transactionStore"], "readwrite");
  transactionStore = transaction.objectStore("transactionStore");
  const getAll = transactionStore.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          transaction = db.transaction(["transactionStore"], "readwrite");
          transactionStore = transaction.objectStore("transactionStore");
          transactionStore.clear();
        });
    }
  };
}

// Online event listener
window.addEventListener("online", checkDatabase);

document.querySelector("#add-btn").onclick = function () {
  sendTransaction(true);
};

document.querySelector("#sub-btn").onclick = function () {
  sendTransaction(false);
};