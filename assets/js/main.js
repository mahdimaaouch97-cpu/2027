// ملف الدوال المشتركة POSNEW - main.js

// تحديث قائمة الباقات في أي صفحة
function fillPackageDropdown(selectElementId){
    let packages = JSON.parse(localStorage.getItem("packages")) || [];
    const select = document.getElementById(selectElementId);
    if(!select) return;
    select.innerHTML = "";
    packages.forEach(p=>{
        const option = document.createElement("option");
        option.value = p.name;
        option.textContent = p.name;
        select.appendChild(option);
    });
}

// حساب المبلغ المتبقي لمشترك
function getRemaining(subscriber){
    let packages = JSON.parse(localStorage.getItem("packages")) || [];
    const pkgPrice = packages.find(p=>p.name===subscriber.package)?.price || 0;
    return (pkgPrice - subscriber.paid).toFixed(2);
}

// طباعة إيصال لأي مشترك
function printReceipt(subscriber){
    const remaining = getRemaining(subscriber);
    const printWindow = window.open('','', 'width=400,height=600');
    printWindow.document.write(`
        <html><head><title>إيصال الدفع</title>
        <style>body{font-family:Arial;padding:20px;} h2{text-align:center;} table{width:100%;border-collapse:collapse;margin-top:20px;} th,td{border:1px solid #000;padding:8px;text-align:left;}</style>
        </head>
        <body>
        <h2>إيصال الدفع</h2>
        <table>
        <tr><th>الاسم:</th><td>${subscriber.name}</td></tr>
        <tr><th>العنوان:</th><td>${subscriber.address || ""}</td></tr>
        <tr><th>الباقة:</th><td>${subscriber.package}</td></tr>
        <tr><th>المبلغ المدفوع ($):</th><td>$${subscriber.paid.toFixed(2)}</td></tr>
        <tr><th>المبلغ المتبقي ($):</th><td>$${remaining}</td></tr>
        <tr><th>التاريخ:</th><td>${new Date().toLocaleDateString()}</td></tr>
        </table>
        <p style="text-align:center;margin-top:20px;">شكراً لاستخدامكم FAST NET</p>
        </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// تحديث لوحة التحكم
function updateDashboard(){
    const subscribers = JSON.parse(localStorage.getItem("subscribers")) || [];
    const receipts = JSON.parse(localStorage.getItem("receipts")) || [];
    const packages = JSON.parse(localStorage.getItem("packages")) || [];

    document.getElementById("totalSubscribers")?.textContent = subscribers.length;
    document.getElementById("totalReceipts")?.textContent = receipts.length;

    let totalRevenue = 0;
    subscribers.forEach(sub=> totalRevenue += parseFloat(sub.paid || 0));
    document.getElementById("totalRevenue")?.textContent = `$${totalRevenue.toFixed(2)}`;

    document.getElementById("totalPackages")?.textContent = packages.length;
}
