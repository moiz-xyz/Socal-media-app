import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { Supabaseconfig ,firebaseConfig } from '../config.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } 
from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const supabase = createClient(Supabaseconfig.url, Supabaseconfig.ApiKey);
const app = initializeApp(firebaseConfig);
// console.log(supabase , Supabaseconfig);
// console.log(app);



// SIGNUP FUNCTION
let signup_Btn = document.getElementById("register-btn");
signup_Btn.addEventListener("click", async (event) => {
    event.preventDefault(); 

    let signupemail = document.getElementById("regemail").value;
    let signupname = document.getElementById("reguser").value;
    let signuppass = document.getElementById("regpass").value;


    try {
        const { data, error } = await supabase.auth.signUp({
            email: signupemail,
            password: signuppass,
        });

        if (error) {
            console.error("Signup Error:", error.message);
            Swal.fire("Error", error.message, "error");
        } else {
            console.log("Signup Success:", data);
            Swal.fire("Success!", "Account created successfully", "success");
        }
    } catch (err) {
        console.error("Unexpected Error:", err);
    }


    // SENDING DATA TO DATA BASE

  try {
    const { error } = await supabase
  .from('Practise')
  .insert({ 
     Name: signupname ,
     Email : signupemail ,
     })
     if (error) {
        console.log(error.message);
     } else{
console.log("Data done ");
        
     }

  } catch (err) {
    console.log("unexpected eror" + err.message);
  }



    document.getElementById("regemail").value = "";
    document.getElementById("reguser").value = "";
    document.getElementById("regpass").value = "";
});



// LOGIN FUNCTION
let login_btn = document.getElementById("login_btn");
login_btn.addEventListener("click", async (event) => {
    event.preventDefault();

    let loginemail = document.getElementById("login_email").value;
    let loginpass = document.getElementById("login_pass").value;

    console.log("Attempting Login:", loginemail);

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: loginemail,
            password: loginpass,
        });

        if (error) {
            Swal.fire("Error", error.message, "error");
        } else {
            Swal.fire("Success!", "Logged in successfully", "success");
        }
    } catch (err) {
        console.error("Unexpected Error:", err);
    }

    document.getElementById("login_email").value = "";
    document.getElementById("login_pass").value = "";
});

 // GOOGLE FUNCTION  WITH FIREBASE 
//  console.log(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
let reg_By_Google = document.getElementById ( "reg_By_Google") ;
reg_By_Google .addEventListener ('click' , async ()=>{
  signInWithPopup(auth, provider)
  .try((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;

    console.log("Login successful! User info:", user);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.error("Login failed:", errorCode, errorMessage);
  });
})





const container = document.querySelector(".container");
const registerbtn = document.querySelector(".register-btn");
const loginbtn = document.querySelector(".login-btn");

registerbtn.addEventListener("click", () => {
    container.classList.add("active");
});

loginbtn.addEventListener("click", () => {
    container.classList.remove("active");
});


// localStorage.clear()