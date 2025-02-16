import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { Supabaseconfig } from "../User Creationals/config.js";

const supabase = createClient(Supabaseconfig.url, Supabaseconfig.ApiKey);
// console.log(supabase);

let create_btn = document.getElementById("create_btn");
let closebtn = document.getElementById("close");
let postForm = document.getElementById("postForm");

create_btn.addEventListener("click", () => {
  postForm.classList.toggle("active");
});

closebtn.addEventListener("click", function () {
  postForm.classList.remove("active");
});

let upload = document.getElementById("upload");
upload.addEventListener("click", async (event) => {
  event.preventDefault();
  let caption = document.getElementById("caption").value;
  let fileInput = document.getElementById("file");
  let file = fileInput.files[0];
  const fileName = `${Date.now()}-${file.name}`;
  if (!file && caption.trim() === "") {
    alert("Post must consist of either an image or some text");
    return;
  }
  // const { data, error } = await supabase.storage
  //   .from("images")
  //   .upload(fileName, file);

  // if (error) {
  //   console.error("Upload error:", error.message);
  // } else {
  //   console.log("File uploaded successfully:", data);
  //   getPublicUrl(fileName);
  // }

  

  let storedProfile = JSON.parse(localStorage.getItem("profile")) || {};
  if (storedProfile.image) {
    document.getElementById("profile-pic").src = storedProfile.image;
  }
  let storedUsers = JSON.parse(localStorage.getItem("users")) || [];
  let username_of_user = storedUsers.map((user) => user.username);
  let name_of_user = storedUsers.map((user) => user.name);

  let imageUrl = file ? URL.createObjectURL(file) : "";
  let post_div = document.createElement("div");
  post_div.innerHTML = `
    <div class="post-card">
        <div class="post-header">
            <img src="https://cdn.vectorstock.com/i/1000v/66/13/default-avatar-profile-icon-social-media-user-vector-49816613.jpg" alt="User" class="profile-pic" id ="profile-pic">
           <p>${name_of_user}</p>
            <span class="username">${username_of_user}</span>
        </div>
        ${
          file
            ? `<img src="${imageUrl}" alt="Post Image" class="post-image">`
            : ""
        }
        <div class="post-actions">
            <i class="fas fa-heart like-icon"></i>
            <i class="fas fa-comment comment-icon"></i>
            <i class="fa-solid fa-trash"></i>
        </div>
        <p class="post-title">${caption}</p>
    </div>
`;

  let postContainer = document.getElementById("post-container");
  postContainer.appendChild(post_div);
  postForm.classList.remove("active");

  let image = document.getElementById("profile-pic").src;
  let profileData = {
    image,
  };
  localStorage.setItem("profile", JSON.stringify(profileData));

  document
    .getElementById("imageInput")
    .addEventListener("change", function (event) {
      let reader = new FileReader();
      reader.onload = function () {
        document.getElementById("profileImage").src = reader.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    });
});

//  profile details
let profileDiv = document.getElementById("profile_page");
let profile = document.getElementById("profile");
profileDiv.innerHTML = ` <div class="profile-section" id="profileSection">
<h2>Profile-Deatails</h2>
        <img id="profileImage" src="https://cdn.vectorstock.com/i/1000v/66/13/default-avatar-profile-icon-social-media-user-vector-49816613.jpg" alt="Profile Picture">
         <p> <i class="fa-solid fa-pencil" id ="setiamge"> </i> Set an image </p>
        <br>
        <div id = "inputforiamge"> </div>
        <p id="nameInput"> </p>
        <p id="usernameInput"> </p>
        <p id="emailInput"> </p>
        <button class="close-btn" id= "close-btn">Close</button> 
        </div>
        `;
// set a prfile photo
let set_icon = document.getElementById("setiamge");
set_icon.addEventListener("click", function () {
  let inputforiamge = document.getElementById("inputforiamge");
  inputforiamge.innerHTML = `
             <input type="file" id="imageInput">
             <button class="save-btn" id="saveProfile">Save Profile</button>
            `;
  let save_btn = document.getElementById("saveProfile");
  save_btn.addEventListener("click", function () {
    let image = document.getElementById("profileImage").src;
    let profileData = {
      image,
    };
    localStorage.setItem("profile", JSON.stringify(profileData));
  });
  document
    .getElementById("imageInput")
    .addEventListener("change", function (event) {
      let reader = new FileReader();
      reader.onload = function () {
        document.getElementById("profileImage").src = reader.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    });
});
profile.addEventListener("click", async function () {
  let profileSection = document.getElementById("profileSection");
  profileSection.classList.toggle("active");

  let storedUser = JSON.parse(localStorage.getItem("users"));
  let storedProfile = JSON.parse(localStorage.getItem("profile")) || {};

  let name_of_user = storedUser.map((user) => user.name);
  let username_of_user = storedUser.map((user) => user.username);
  let email_of_user = storedUser.map((user) => user.email);

  let input_profile_name = document.getElementById("nameInput");
  let input_profile_username = document.getElementById("usernameInput");
  let input_profile_email = document.getElementById("emailInput");
  if (storedUser) {
    input_profile_name.innerHTML = `Name : ${name_of_user}`;
    input_profile_username.innerHTML = `Username :${username_of_user}`;
    input_profile_email.innerHTML = `Email : ${email_of_user}`;
  }
  if (storedProfile.image) {
    document.getElementById("profileImage").src = storedProfile.image;
  }
});
let close_btn = document.getElementById("close-btn");
close_btn.addEventListener("click", function () {
  let profileSection = document.getElementById("profileSection");
  profileSection.classList.toggle("active");
});

// function dataget () {
//     let storedUsers = JSON.parse(localStorage.getItem("users")) || [];
//     storedUsers.forEach(user => console.log("User Email:", user.email ,
//         username_of_user, user.password
//     ));

// }
// dataget()
