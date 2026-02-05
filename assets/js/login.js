
const USERS = [
  { username: "admin", password: "1234" },
  { username: "employee", password: "123" }
];

const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

loginForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const user = USERS.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem("loggedInUser", username);
    window.location.href = "index.html";
  } else {
    errorMsg.textContent = "اسم المستخدم أو كلمة المرور خاطئة";
  }
});
