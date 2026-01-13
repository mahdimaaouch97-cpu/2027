let receipts = JSON.parse(localStorage.getItem("receipts")) || [];
let subscribers = JSON.parse(localStorage.getItem("subscribers")) || [];

function renderTable() {
    const tableBody = document.getElementById("receiptsTableBody");
    const search = document.getElementById("search").value.toLowerCase();
    const statusFilter = document.getElementById("filterStatus").value;

    tableBody.innerHTML = "";

    if (receipts.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9">لا توجد إيصالات</td></tr>`;
        return;
    }

    let rows = receipts.map(r => {
        const sub = subscribers.find(s => Number(s.id) === Number(r.subscriberId));
        let remaining = r.remaining ?? (sub ? sub.remaining : 0);

        return {
            id: r.id,
            name: sub ? sub.name : "غير معروف",
            address: sub ? sub.address : "غير محدد",
            total: sub ? sub.price : 0,
            amount: r.amount || 0,
            remaining: remaining,
            month: r.month || "-",
            date: r.date || "-"
        };
    });

    // فلترة النتائج
    let filtered = rows.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(search);
        if (r.remaining === r.total) return false; // تجاهل غير المدفوعين
        let matchesStatus = true;
        if (statusFilter === "full") matchesStatus = r.remaining === 0;
        if (statusFilter === "partial") matchesStatus = r.remaining > 0 && r.remaining < r.total;
        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9">لا توجد نتائج</td></tr>`;
        return;
    }

    filtered.forEach(r => {
        let statusClass = r.remaining === 0 ? "status-full" : "status-partial";
        let statusText = r.remaining === 0 ? "مدفوع كليًا" : "مدفوع جزئيًا";

        tableBody.innerHTML += `
        <tr>
            <td>${r.id}</td>
            <td>${r.name}</td>
            <td>$${r.total}</td>
            <td>$${r.amount}</td>
            <td>$${r.remaining}</td>
            <td>${r.month}</td>
            <td><span class="status-label ${statusClass}">${statusText}</span></td>
            <td>${r.date}</td>
            <td><button class="print-btn" onclick="printReceipt(${r.id})">طباعة</button></td>
        </tr>
        `;
    });
}

function printReceipt(id) {
    const r = receipts.find(x => x.id == id);
    if (!r) return alert("الإيصال غير موجود");

    const sub = subscribers.find(s => Number(s.id) === Number(r.subscriberId));
    const total = sub ? sub.price : 0;
    const remaining = r.remaining ?? (sub ? sub.remaining : 0);

    if (remaining === total) return alert("لا يمكن طباعة إيصال غير مدفوع");

    const status = remaining === 0 ? "مدفوع كليًا" : "مدفوع جزئيًا";

    const win = window.open("", "PrintReceipt", "width=220,height=500");

    win.document.write(`
    <div style="font-family:Arial, sans-serif; direction:rtl; width:200px; padding:5px; text-align:right; font-size:12px;">
        <h3 style="text-align:center; margin:0;">FAST NET</h3>
        <p style="text-align:center; margin:2px 0; font-size:12px;">71346411 / 71338640</p>
        <hr>
        <table style="width:100%; border-collapse:collapse; font-size:12px; direction:rtl;">
            <tr><td style="font-weight:bold;">رقم الإيصال:</td><td>${r.id}</td></tr>
            <tr><td style="font-weight:bold;">المشترك:</td><td>${sub ? sub.name : "غير معروف"}</td></tr>
            <tr><td style="font-weight:bold;">العنوان:</td><td>${sub ? sub.address : "غير محدد"}</td></tr>
            <tr><td style="font-weight:bold;">سعر الاشتراك:</td><td>$${total}</td></tr>
            <tr><td style="font-weight:bold;">المدفوع:</td><td>$${r.amount}</td></tr>
            <tr><td style="font-weight:bold;">المتبقي:</td><td>$${remaining}</td></tr>
            <tr><td style="font-weight:bold;">الشهر:</td><td>${r.month}</td></tr>
            <tr><td style="font-weight:bold;">حالة الدفع:</td><td>${status}</td></tr>
            <tr><td style="font-weight:bold;">التاريخ:</td><td>${r.date}</td></tr>
        </table>
        <hr>
        <p style="text-align:center; font-weight:bold; font-size:12px;">شكراً لاستخدامكم FAST NET</p>
    </div>
    `);

    win.print();
}

document.addEventListener("DOMContentLoaded", renderTable);
