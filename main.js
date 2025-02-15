if (localStorage.getItem("sb-tsiriyarbapweplseeqv-auth-token")) {
 console.log("user is log in");
 
    window.location.href = "./Link-up Ui/index.html";
} else {
console.log("no usr found");
    window.location.href = "./User Creationals/user.html";
   }
//    localStorage.clear()