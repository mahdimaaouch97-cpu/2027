let receipts = JSON.parse(localStorage.getItem("receipts")) || [];

function renderReceipts(){
    const tbody = document.querySelector("#receiptsTable tbody");
    tbody.innerHTML = "";

    receipts.forEach((r, i) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${i+1}</td>
            <td>${r.receiptNo}</td>
            <td>${r.name}</td>
            <td>${r.package}</td>
            <td>$${r.paid}</td>
            <td>${r.date}</td>
            <td>${r.status}</td>
            <td><button onclick="printReceipt(${i})">طباعة</button></td>
        `;
        tbody.appendChild(row);
    });
}

function printReceipt(index){
    localStorage.setItem("lastReceipt", JSON.stringify(receipts[index]));
    window.open("receipt.html","_blank");
}

/* ===== Excel ===== */
function exportReceiptsExcel(){
    const ws = XLSX.utils.json_to_sheet(receipts);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Receipts");
    XLSX.writeFile(wb, "receipts.xlsx");
}

/* ===== PDF بسيط ===== */
function exportReceiptsPDF(){
    let text = "FAST NET - Receipts\n\n";
    receipts.forEach(r=>{
        text += `${r.receiptNo} | ${r.name} | $${r.paid} | ${r.date}\n`;
    });
    const blob = new Blob([text], {type:"application/pdf"});
    const url = URL.createObjectURL(blob);
    window.open(url);
}

document.addEventListener("DOMContentLoaded", renderReceipts);
