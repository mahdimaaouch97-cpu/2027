// تحميل المشتركين والإيصالات من localStorage
let subscribers = JSON.parse(localStorage.getItem("subscribers")) || [];
let receipts = JSON.parse(localStorage.getItem("receipts")) || [];

// التأكد من هيكلة المشتركين
subscribers = subscribers.map((sub, index) => ({
    id: sub.id !== undefined ? sub.id : index + 1,
    name: sub.name || "بدون اسم",
    phone: sub.phone || "غير محدد",
    price: Number(sub.price) || 0,
    remaining: sub.remaining !== undefined ? Number(sub.remaining) : Number(sub.price) || 0,
    payments: Array.isArray(sub.payments) ? sub.payments : []
}));
localStorage.setItem("subscribers", JSON.stringify(subscribers));

function renderTable() {
    const tableBody = document.querySelector("#subscribersTable tbody");
    const searchFilter = document.getElementById("search").value.toLowerCase();
    const statusFilter = document.getElementById("filterStatus").value;
    tableBody.innerHTML = "";

    let filtered = subscribers.filter(sub => {
        let status = sub.remaining === 0 ? "full" : (sub.remaining < sub.price ? "partial" : "unpaid");
        if(statusFilter !== "all" && status !== statusFilter) return false;
        return sub.name.toLowerCase().includes(searchFilter) || sub.phone.toLowerCase().includes(searchFilter);
    });

    if(filtered.length === 0){
        tableBody.innerHTML = `<tr><td colspan="11">لا يوجد مشتركين مطابقين.</td></tr>`;
        return;
    }

    filtered.forEach(sub => {
        const paidAmount = sub.payments.reduce((sum, p) => sum + Number(p.amount), 0).toFixed(2);
        let statusHtml = sub.remaining === 0 ? '<span class="status-paid">مدفوع كليًا</span>' :
                         sub.remaining < sub.price ? '<span class="status-partial">مدفوع جزئيًا</span>' :
                         '<span class="status-unpaid">غير مدفوع</span>';

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${sub.id}</td>
            <td>${sub.name}</td>
            <td>${sub.phone}</td>
            <td>$${sub.price}</td>
            <td>$${paidAmount}</td>
            <td>$${sub.remaining}</td>
            <td>${statusHtml}</td>
            <td>
                <select id="month-${sub.id}">
                    ${[...Array(12)].map((_,i)=>`<option value="${i+1}">${i+1}</option>`).join("")}
                </select>
            </td>
            <td>
                <input type="number" id="pay-${sub.id}" min="0.01" max="${sub.remaining}" step="0.01" ${sub.remaining===0?"disabled":""}>
                <button class="pay-btn" onclick="pay(${sub.id})" ${sub.remaining===0?"disabled":""}>دفع</button>
            </td>
            <td><button class="print-btn" onclick="printReceipt(${sub.id})">طباعة</button></td>
            <td><button class="wa-btn" onclick="sendWhatsApp(${sub.id})">أرسل واتساب</button></td>
        `;
        tableBody.appendChild(tr);
    });
}

function pay(id) {
    const sub = subscribers.find(s => s.id === id);
    const amount = parseFloat(document.getElementById(`pay-${id}`).value);
    const month = document.getElementById(`month-${id}`).value;

    if(isNaN(amount) || amount <= 0 || amount > sub.remaining){
        return alert("الرجاء إدخال مبلغ صالح.");
    }

    sub.remaining = +(sub.remaining - amount).toFixed(2);
    sub.payments.push({ amount, month, date: new Date().toLocaleDateString() });
    localStorage.setItem("subscribers", JSON.stringify(subscribers));

    // توليد رقم إيصال فريد
    let lastNumber = parseInt(localStorage.getItem("lastReceiptNumber")) || 2000;
    lastNumber++;
    localStorage.setItem("lastReceiptNumber", lastNumber);
    const receiptId = lastNumber;

    // إضافة إيصال جديد
    receipts.push({
        id: receiptId,
        subscriberId: sub.id,
        name: sub.name,
        phone: sub.phone,
        amount: amount,
        remaining: sub.remaining,
        total: sub.price,
        month: month,
        date: new Date().toLocaleDateString()
    });
    localStorage.setItem("receipts", JSON.stringify(receipts));

    document.getElementById(`pay-${id}`).value = "";
    renderTable();

    // إرسال واتساب مباشرة بعد الدفع
    sendWhatsApp(id, amount, month);
}

function sendWhatsApp(id, amount = null, month = null){
    const sub = subscribers.find(s => s.id === id);
    let lastPayment = sub.payments[sub.payments.length - 1];
    if(!lastPayment) return alert("لا توجد دفعات.");
    const msg = `📩 إشعار دفع FAST NET\n👤 المشترك: ${sub.name}\n💰 المبلغ المدفوع: $${amount ?? lastPayment.amount}\n💵 المبلغ الم
