
let currentUser = JSON.parse(localStorage.getItem("user"));
if(!currentUser && !location.pathname.includes("login.html")){
    location.href="login.html";
}
