let packages = []; // مصفوفة لتخزين الباقات مؤقتاً

function renderPackages() {
    const tableBody = document.querySelector("#packagesTable tbody");
    tableBody.innerHTML = "";
    packages.forEach((pkg, index) => {
        tableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${pkg.name}</td>
                <td>${pkg.price} ل.ل</td>
                <td>
                    <button onclick="editPackage(${index})">تعديل</button>
                    <button onclick="deletePackage(${index})">حذف</button>
                </td>
            </tr>
        `;
    });
}

function addPackage() {
    const name = prompt("أدخل اسم الباقة:");
    if (!name) return;
    const price = prompt("أدخل سعر الباقة:");
    if (!price || isNaN(price)) return alert("الرجاء إدخال سعر صحيح!");
    packages.push({ name, price });
    renderPackages();
}

function editPackage(index) {
    const pkg = packages[index];
    const newName = prompt("تعديل اسم الباقة:", pkg.name);
    if (!newName) return;
    const newPrice = prompt("تعديل سعر الباقة:", pkg.price);
    if (!newPrice || isNaN(newPrice)) return alert("الرجاء إدخال سعر صحيح!");
    packages[index] = { name: newName, price: newPrice };
    renderPackages();
}

function deletePackage(index) {
    if (confirm("هل تريد حذف هذه الباقة؟")) {
        packages.splice(index, 1);
        renderPackages();
    }
}

// عرض الباقات عند تحميل الصفحة
window.onload = renderPackages;
