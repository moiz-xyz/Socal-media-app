import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { Supabaseconfig } from "../config.js";

const supabase = createClient(Supabaseconfig.url, Supabaseconfig.ApiKey);

let create_btn = document.getElementById("create_btn");
let closebtn = document.getElementById("close");
let postForm = document.getElementById("postForm");

create_btn.addEventListener("click", () => {
  postForm.classList.toggle("active");
});

closebtn.addEventListener("click", () => {
  postForm.classList.remove("active");
});


let uploadPost = async (event) => {
  event.preventDefault();
  
  let caption = document.getElementById("caption").value;
  let fileInput = document.getElementById("file");
  let file = fileInput.files.length > 0 ? fileInput.files[0] : null;
  
  if (!file && caption.trim() === "") {
    alert("Post must consist of either an image or some text");
    return;
  }
  
  let imageUrl = "";
  if (file) {
    const fileName = `user_uploads/${Date.now()}-${file.name}`;
    let { data, error } = await supabase.storage
    .from("images")
    .upload(fileName, file, { contentType: file.type });
    
    if (error) {
      console.error("Image upload failed:", error.message);
      alert("Failed to upload image");
      return;
    }
    imageUrl = `https://tsiriyarbapweplseeqv.supabase.co/storage/v1/object/public/images/${fileName}`;
  }
  
let data_loacl= localStorage.getItem("save") ;
let usersArray = JSON.parse(data_loacl);
let nameofuser = usersArray[0].nameofuser;
let signupname = usersArray[0].signupname;
let user_name = nameofuser;
let username = signupname;

  let { data, error } = await supabase
    .from("posts")
    .insert([{ caption, image_url: imageUrl, user_name, username }]);

  if (error) {
    console.error("Error inserting post:", error.message);
    alert("Failed to post");
    return;
  }

  alert("Post posted successfully!");
  postForm.classList.remove("active");
};

let postui = (name_of_user, username_of_user, caption, imageUrl) => {
  let post_div = document.createElement("div");
  post_div.innerHTML = `
    <div class="post-card">
        <div class="post-header">
            <img src="https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png" alt="User" class="profile-pic">
            <p>${name_of_user}</p>
            <span class="username">${username_of_user}</span>
        </div>
        ${imageUrl ? `<img src="${imageUrl}" alt="Post Image" class="post-image">` : ""}
        <div class="post-actions">
            <i class="fas fa-heart like-icon"></i>
            <i class="fas fa-comment comment-icon"></i>
            <i class="fa-solid fa-trash"></i>
        </div>
        <p class="post-title">${caption}</p>
    </div>
  `;
  document.getElementById("post-container").appendChild(post_div);
};

let fetchPosts = async () => {
  let { data, error } = await supabase.from("posts").select("*");

  if (error) {
    console.error("Error fetching posts:", error.message);
    return;
  }

  data.forEach((post) => {
    postui(post.user_name, post.username, post.caption, post.image_url);
  });
};

const channel = supabase
  .channel("posts_changes")
  .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, (payload) => {
    let newPost = payload.new;
    postui(newPost.user_name, newPost.username, newPost.caption, newPost.image_url);
  })
  .subscribe();


fetchPosts();
document.getElementById("upload").addEventListener("click", uploadPost);

let profile_btn = document.getElementById("profile");
async function fetchUsers() {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.log("Auth Error:", authError.message);
      return;
    }
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("Email", user.email) 
    if (error) {
      console.log("Error fetching user details:", error.message);
      return;
    }
    if (data.length === 0) {
      console.log("No user found with this email.");
      return;
    }
    let profileDiv = document.getElementById("profile_page");
    profileDiv.innerHTML = `
      <div class="profile-section" id="profileSection">
        <h2>Profile Details</h2>
        <img src="https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png" alt="User" class="profile-pic">
        <p><i class="fa-solid fa-pencil" id="setImage"></i> Set an image </p>
        <br>
        <p id="nameInput">${data[0].user_name}</p>
        <p id="usernameInput">${data[0].username}</p>
        <p id="emailInput">${data[0].Email}</p>
        <button class="close-btn" id="close-btn">Close</button>
      </div>
    `;
    let profileSection = document.getElementById("profileSection");
    profileSection.classList.toggle("active");

    let close_btn = document.getElementById("close-btn");
    close_btn.addEventListener("click", function () {
      profileSection.classList.toggle("active");
    });
  } catch (error) {
    console.log("Unexpected error:", error.message);
  }
  
  let setImageicon = document.getElementById("setImage");

  let setImage = () =>{   
    let upload_container = document.getElementById("profile_page");
    upload_container.innerHTML = `
     <div class="upload-container">
     <label for="fileInput" class="upload-icon">📷</label>
     <input type="file" id="fileInput" accept="image/*">
     <br>
     <br>
     <button id="saveButton" class="save-button">Save Photo</button>
    </div>
` ;
const uploadContainer = document.querySelector('.upload-container')
uploadContainer.classList.add('active'); // Slide down and appear
// const fileInput = document.getElementById("fileInput");
// const
  }
  setImageicon.addEventListener("click" , setImage)
}
profile_btn.addEventListener("click", fetchUsers);

let logout = document.getElementById("logout");

async function  logoutAccount() {
  try {
    const { error } = await supabase.auth.signOut()
if (error){
  console.log(error.message);
  
} else {
  console.log("Loged out");
  
}
  } catch (error) {
    console.log("Unexpected error" , error);
    
  }


}
logout.addEventListener("click" , logoutAccount)