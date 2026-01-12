// جلب المشتركين من LocalStorage أو إنشاء مصفوفة فارغة
window.subscribers = JSON.parse(localStorage.getItem("subscribers")) || [];

// دالة لحساب المبلغ المتبقي
function getRemaining(sub){
    return ((sub.price || 0) - (sub.paid || 0)).toFixed(2);
}

// عرض المشتركين في الجدول
function renderSubscribers(list){
    const data = list || window.subscribers;
    const tbody = document.querySelector("#subscribersTable tbody");
    tbody.innerHTML = "";

    data.forEach((sub, index) => {
        const remaining = getRemaining(sub);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index+1}</td>
            <td>${sub.name}</td>
            <td>${sub.address || ""}</td>
            <td>${sub.package}</td>
            <td>$${sub.price}</td>
            <td>$${sub.paid.toFixed(2)}</td>
            <td>$${remaining}</td>
            <td>${remaining == 0 ? "مدفوع" : "غير مدفوع"}</td>
            <td>
                <button onclick="editSubscriber(${index})">تعديل</button>
                <button onclick="deleteSubscriber(${index})">حذف</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// تعديل بيانات مشترك
function editSubscriber(index){
    const sub = window.subscribers[index];
    const name = prompt("اسم المشترك:", sub.name);
    if(!name) return;
    const address = prompt("العنوان:", sub.address || "");
    const packageName = prompt("الباقة:", sub.package);
    const price = parseFloat(prompt("سعر الباقة ($):", sub.price));
    if(isNaN(price)) return alert("السعر غير صالح!");
    const paid = parseFloat(prompt("المبلغ المدفوع ($):", sub.paid)) || 0;

    window.subscribers[index] = {name, address, package: packageName, price, paid};
    localStorage.setItem("subscribers", JSON.stringify(window.subscribers));
    renderSubscribers();
}

// حذف مشترك
function deleteSubscriber(index){
    if(confirm("هل أنت متأكد من حذف المشترك؟")){
        window.subscribers.splice(index,1);
        localStorage.setItem("subscribers", JSON.stringify(window.subscribers));
        renderSubscribers();
    }
}

// حذف جميع المشتركين
function deleteAllSubscribers(){
    if(confirm("هل أنت متأكد من حذف جميع المشتركين؟")){
        window.subscribers = [];
        localStorage.setItem("subscribers", JSON.stringify(window.subscribers));
        renderSubscribers();
    }
}

// عرض المشتركين عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function(){
    renderSubscribers();
});
