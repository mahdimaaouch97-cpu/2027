
function login(){
 const user=document.getElementById("user").value;
 const role=document.getElementById("role").value;
 if(!user) return alert("أدخل الاسم");
 localStorage.setItem("user",JSON.stringify({user,role}));
 location.href="index.html";
}
