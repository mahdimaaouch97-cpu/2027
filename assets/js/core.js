

const STORAGE_KEYS = {
  subscribers: "pos_subscribers",
  payments: "pos_payments",
  receipts: "pos_receipts",
  receiptNo: "pos_receipt_no"
};

// ===== Helpers =====
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getNextReceiptNo() {
  let no = localStorage.getItem(STORAGE_KEYS.receiptNo) || 1;
  localStorage.setItem(STORAGE_KEYS.receiptNo, Number(no) + 1);
  return no;
}

function today() {
  return new Date().toLocaleDateString("ar-LB");
}

// ===== Auth check =====
function checkLogin() {
  if (!localStorage.getItem("loggedInUser")) {
    window.location.href = "login.html";
  }
}
