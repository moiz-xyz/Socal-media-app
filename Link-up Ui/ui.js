import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { Supabaseconfig } from "../config.js";

const supabase = createClient(Supabaseconfig.url, Supabaseconfig.ApiKey);

let create_btn = document.getElementById("create_btn");
let closebtn = document.getElementById("close");
let postForm = document.getElementById("postForm");

// Toggle post form visibility
create_btn.addEventListener("click", () => {
  postForm.classList.toggle("active");
});

closebtn.addEventListener("click", () => {
  postForm.classList.remove("active");
});

// Upload a new post
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

  let data_local = localStorage.getItem("save");
  let usersArray = JSON.parse(data_local || "[]");

  if (usersArray.length === 0) {
    alert("User data not found. Please log in again.");
    return;
  }

  let { nameofuser, signupname } = usersArray[0];

  let { error: insertError } = await supabase
    .from("posts")
    .insert([{ caption, image_url: imageUrl, user_name: nameofuser, username: signupname }]);

  if (insertError) {
    console.error("Error inserting post:", insertError.message);
    alert("Failed to post");
    return;
  }

  Swal.fire({ title: "Post Posted!", icon: "success", draggable: true });
  postForm.classList.remove("active");
};

// Display post UI
let postui = (name_of_user, username_of_user, caption, imageUrl) => {
  let post_div = document.createElement("div");
  post_div.classList.add("post-card");    
  post_div.innerHTML = `
    <div class="post-header">
        <img src="https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png" alt="User" class="profile-pic">
        <p>${name_of_user}</p>
        <span class="username">${username_of_user}</span>
    </div>
    ${imageUrl ? `<img src="${imageUrl}" alt="Post Image" class="post-image">` : ""}
    <div class="post-actions">
        <i class="fas fa-heart like-icon"></i>
        <i class="fas fa-comment comment-icon"></i>
        <i class="fa-solid fa-trash deletepost" id ="deletepost"></i>
    </div>
    <p class="post-title">${caption}</p>
  `;
  document.getElementById("post-container")?.appendChild(post_div);
};

// Fetch all posts
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

// Subscribe to post changes
supabase
  .channel("posts_changes")
  .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, (payload) => {
    let newPost = payload.new;
    postui(newPost.user_name, newPost.username, newPost.caption, newPost.image_url);
  })
  .subscribe();

fetchPosts();
document.getElementById("upload")?.addEventListener("click", uploadPost);

// Fetch user profile details
let profile_btn = document.getElementById("profile");

async function fetchUsers() {
  try {
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData.user) {
      console.log("Auth Error:", authError?.message);
      return;
    }

    let { data, error } = await supabase.from("users").select().eq("Email", userData.user.email);
    if (error) {
      console.log("Error fetching user details:", error.message);
      return;
    }

    if (data.length === 0) {
      console.log("No user found with this email.");
      return;
    }

    let user = data[0];
    let profileDiv = document.getElementById("profile_page");
    profileDiv.innerHTML = `
      <div class="profile-section" id="profileSection">
        <h2>Profile Details</h2>
        <img src="https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png" alt="User" class="profile-pic">
        <p><i class="fa-solid fa-pencil" id="setImage"></i> Set an image </p>
        <br>
        <p id="nameInput">${user.user_name}</p>
        <p id="usernameInput">${user.username}</p>
        <p id="emailInput">${user.Email}</p>
        <button class="close-btn" id="close-btn">Close</button>
      </div>
    `;

    document.getElementById("profileSection").classList.add("active");
    document.getElementById("close-btn").addEventListener("click", () => {
      document.getElementById("profileSection").classList.remove("active");
    });

    document.getElementById("setImage").addEventListener("click", setImage);
  } catch (error) {
    console.log("Unexpected error:", error.message);
  }
}

// Image upload for profile
function setImage() {
  let upload_container = document.getElementById("profile_page");
  upload_container.innerHTML = `
    <div class="upload-container">
      <label for="fileInput" class="upload-icon">📷</label>
      <input type="file" id="fileInput" accept="image/*">
      <br><br>
      <button id="saveButton" class="save-button">Save Photo</button>
    </div>
  `;

  document.querySelector('.upload-container').classList.add('active');
}

profile_btn?.addEventListener("click", fetchUsers);

// Logout function
let logout = document.getElementById("logout");

async function logoutAccount() {
  try {
    let { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Logout error:", error.message);
    } else {
      Swal.fire({ title: "Logged Out!", icon: "success", draggable: true });
      window.location.href = "../User Creationals/user.html"
    }
  } catch (error) {
    console.log("Unexpected error", error);
  }
}

logout?.addEventListener("click", logoutAccount);
