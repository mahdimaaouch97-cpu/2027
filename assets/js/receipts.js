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

    // ربط الإيصالات بالمشتركين
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

    // تطبيق البحث والفلترة
    let filtered = rows.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(search);

        // تجاهل الإيصالات الغير مدفوعة بالكامل
        if (r.remaining === r.total) return false;

        let matchesStatus = true;
        if (statusFilter === "full") matchesStatus = r.remaining === 0;
        if (statusFilter === "partial") matchesStatus = r.remaining > 0 && r.remaining < r.total;

        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9">لا توجد نتائج</td></tr>`;
        return;
    }

    // عرض الصفوف مع تلوين الحالة
    filtered.forEach(r => {
        let statusText = "";
        let statusColor = "";

        if (r.remaining === 0) {
            statusText = "مدفوع كليًا";
            statusColor = "#28a745"; // أخضر
        } else if (r.remaining > 0 && r.remaining < r.total) {
            statusText = "مدفوع جزئيًا";
            statusColor = "#FFA500"; // برتقالي
        }

        tableBody.innerHTML += `
        <tr>
            <td>${r.id}</td>
            <td>${r.name}</td>
            <td>$${r.total}</td>
            <td>$${r.amount}</td>
            <td>$${r.remaining}</td>
            <td>${r.month}</td>
            <td style="padding:5px 0;">
                <span style="
                    display:inline-block;
                    width:100%;
                    background-color:${statusColor};
                    color:white;
                    font-weight:bold;
                    border-radius:4px;
                    text-align:center;
                    padding:4px 0;
                ">
                    ${statusText}
                </span>
            </td>
            <td>${r.date}</td>
            <td>
                <button class="print-btn" onclick="printReceipt(${r.id})">طباعة</button>
            </td>
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

    // تجاهل الإيصالات غير المدفوعة عند الطباعة
    if (remaining === total) return alert("لا يمكن طباعة إيصال غير مدفوع");

    let status = remaining === 0 ? "مدفوع كليًا" : "مدفوع جزئيًا";

    const win = window.open("", "", "width=220,height=500");

    win.document.write(`
        <div style="direction:rtl;font-family:Arial;font-size:12px">
            <h3 style="text-align:center;margin:0">FAST NET</h3>
            <p style="text-align:center;margin:2px 0">71346411</p>
            <hr>
            <p>رقم الإيصال: ${r.id}</p>
            <p>المشترك: ${sub ? sub.name : "غير معروف"}</p>
            <p>العنوان: ${sub ? sub.address : "غير محدد"}</p>
            <p>سعر الاشتراك: $${total}</p>
            <p>المدفوع: $${r.amount}</p>
            <p>المتبقي: $${remaining}</p>
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

document.addEventListener("DOMContentLoaded", renderTable);
