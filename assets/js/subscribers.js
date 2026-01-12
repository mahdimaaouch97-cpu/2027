
let subs=JSON.parse(localStorage.getItem("subscribers"))||[];
function render(){
 let tb=document.getElementById("tb");tb.innerHTML="";
 subs.forEach(s=>{
  let st=s.paid>=s.price?"مدفوع":"غير مدفوع";
  tb.innerHTML+=`<tr><td>${s.name}</td><td>${s.package}</td><td>$${s.price}</td><td>$${s.paid}</td><td>${st}</td></tr>`;
 });
}
function addSub(){
 let n=prompt("الاسم");let p=prompt("الباقة");
 let pr=parseFloat(prompt("السعر"));
 subs.push({name:n,package:p,price:pr,paid:0});
 localStorage.setItem("subscribers",JSON.stringify(subs));
 render();
}
function deleteAll(){
 if(confirm("تأكيد الحذف؟")){
 subs=[];
 localStorage.setItem("subscribers","[]");
 render();
 }
}
render();
