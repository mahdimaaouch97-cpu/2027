let subscribers = JSON.parse(localStorage.getItem("subscribers")) || [];
let receipts = JSON.parse(localStorage.getItem("receipts")) || [];

function renderPayments(){
    const tbody = document.querySelector("#paymentsTable tbody");
    tbody.innerHTML = "";

    subscribers.forEach((sub, index) => {
        const remaining = (sub.price - sub.paid).toFixed(2);
        const status = remaining == 0 ? "مدفوع" : "غير مدفوع";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${sub.name}</td>
            <td>${sub.package}</td>
            <td>$${sub.price}</td>
            <td>$${sub.paid.toFixed(2)}</td>
            <td>$${remaining}</td>
            <td>${status}</td>
            <td>
                <button onclick="addPayment(${index})">دفع + إيصال</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function addPayment(index){
    const amount = parseFloat(prompt("أدخل المبلغ المدفوع ($):"));
    if (isNaN(amount) || amount <= 0) {
        alert("مبلغ غير صالح");
        return;
    }

    subscribers[index].paid += amount;

    const remaining = subscribers[index].price - subscribers[index].paid;
    const status = remaining <= 0 ? "مدفوع" : "غير مدفوع";

    // إنشاء إيصال
    const receipt = {
        id: Date.now(),
        name: subscribers[index].name,
        package: subscribers[index].package,
        price: subscribers[index].price,
        paid: amount,
        totalPaid: subscribers[index].paid,
        remaining: remaining < 0 ? 0 : remaining,
        status: status,
        date: new Date().toLocaleString()
    };

    receipts.push(receipt);

    localStorage.setItem("subscribers", JSON.stringify(subscribers));
    localStorage.setItem("receipts", JSON.stringify(receipts));
    localStorage.setItem("lastReceipt", JSON.stringify(receipt));

    renderPayments();

    // فتح الإيصال للطباعة
    window.open("receipt.html", "_blank");
}

document.addEventListener("DOMContentLoaded", renderPayments);
