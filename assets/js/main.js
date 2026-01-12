
let subs=JSON.parse(localStorage.getItem("subscribers"))||[];
let rec=JSON.parse(localStorage.getItem("receipts"))||[];
let total=subs.reduce((a,b)=>a+b.paid,0);
document.getElementById("stats").innerHTML=`
<p>عدد المشتركين: ${subs.length}</p>
<p>عدد الإيصالات: ${rec.length}</p>
<p>الإيرادات: $${total.toFixed(2)}</p>
`;
