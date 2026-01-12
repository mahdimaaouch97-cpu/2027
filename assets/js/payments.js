
let subs=JSON.parse(localStorage.getItem("subscribers"))||[];
let rec=JSON.parse(localStorage.getItem("receipts"))||[];
function render(){
 let tb=document.getElementById("pay");tb.innerHTML="";
 subs.forEach((s,i)=>{
  let r=s.price-s.paid;
  tb.innerHTML+=`<tr>
  <td>${s.name}</td><td>$${s.price}</td><td>$${s.paid}</td><td>$${r}</td>
  <td><button onclick="pay(${i})">دفع</button></td></tr>`;
 });
}
function pay(i){
 let a=parseFloat(prompt("المبلغ"));
 if(isNaN(a))return;
 subs[i].paid+=a;
 rec.push({name:subs[i].name,amount:a,date:new Date().toLocaleDateString()});
 localStorage.setItem("subscribers",JSON.stringify(subs));
 localStorage.setItem("receipts",JSON.stringify(rec));
 render();
}
render();
