// تحميل الإيصالات من LocalStorage
let receipts = JSON.parse(localStorage.getItem("receipts")) || [];

// عرض جدول الإيصالات
function renderTable() {
    const tableBody = document.getElementById("receiptsTableBody");
    const search = document.getElementById("search").value.toLowerCase();
    const statusFilter = document.getElementById("filterStatus").value;

    tableBody.innerHTML = "";

    let filtered = receipts.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(search);

        let matchesStatus = true;
        if (statusFilter === "full") {
            matchesStatus = r.remaining === 0;
        }
        if (statusFilter === "partial") {
            matchesStatus = r.remaining > 0 && r.remaining < r.total;
        }

        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        tableBody.innerHTML =
            `<tr><td colspan="9">لا توجد إيصالات</td></tr>`;
        return;
    }

    filtered.forEach(r => {
        const statusText =
            r.remaining === 0 ? "مدفوع كليًا" : "مدفوع جزئيًا";

        tableBody.innerHTML += `
            <tr>
                <td>${r.id}</td>
                <td>${r.name}</td>
                <td>$${r.total}</td>
                <td>$${r.amount}</td>
                <td>$${r.remaining}</td>
                <td>${r.month}</td>
                <td>${statusText}</td>
                <td>${r.date}</td>
                <td>
                    <button class="print-btn" onclick="printReceipt(${r.id})">
                        طباعة
                    </button>
                </td>
            </tr>
        `;
    });
}

// طباعة إيصال
function printReceipt(id) {
    const r = receipts.find(x => x.id == id);
    if (!r) return alert("الإيصال غير موجود");

    const status =
        r.remaining === 0 ? "مدفوع كليًا" : "مدفوع جزئيًا";

    const win = window.open("", "", "width=220,height=500");

    win.document.write(`
        <div style="direction:rtl;font-family:Arial;font-size:12px">
            <h3 style="text-align:center;margin:0">FAST NET</h3>
            <p style="text-align:center;margin:2px 0">71346411</p>
            <hr>
            <p>رقم الإيصال: ${r.id}</p>
            <p>المشترك: ${r.name}</p>
            <p>العنوان: ${r.address || "غير محدد"}</p>
            <p>سعر الاشتراك: $${r.total}</p>
            <p>المدفوع: $${r.amount}</p>
            <p>المتبقي: $${r.remaining}</p>
            <p>الشهر: ${r.month}</p>
            <p>الحالة: ${status}</p>
            <p>التاريخ: ${r.date}</p>
            <hr>
            <p style="text-align:center;font-weight:bold">
                شكراً لاستخدامكم FAST NET
            </p>
        </div>
    `);

    win.print();
}

// تشغيل الصفحة
document.addEventListener("DOMContentLoaded", renderTable);
