
let rec=JSON.parse(localStorage.getItem("receipts"))||[];
let tb=document.getElementById("r");
rec.forEach(x=>{
 tb.innerHTML+=`<tr><td>${x.name}</td><td>$${x.amount}</td><td>${x.date}</td></tr>`;
});
