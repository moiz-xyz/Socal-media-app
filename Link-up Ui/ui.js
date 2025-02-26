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

// Function to get logged-in user details
const getUserDetails = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Upload Post
let uploadPost = async (event) => {
  event.preventDefault();

  let caption = document.getElementById("caption").value;
  let fileInput = document.getElementById("file");
  let file = fileInput.files[0];

  if (!file && caption.trim() === "") {
    alert("Post must consist of either an image or some text");
    return;
  }

  // Get logged-in user
  let user = await getUserDetails();
  if (!user) {
    alert("User not found. Please log in.");
    return;
  }

  // Fetch user details from Supabase
  let { data: userData, error: userError } = await supabase
    .from("users")
    .select("user_name, username")
    .eq("id", user.id)
    .single();

  if (userError) {
    console.error("Error fetching user details:", userError.message);
    return;
  }

  let imageUrl = null;
  if (file) {
    const fileName = `${Date.now()}-${file.name}`;
    let { data: uploadData, error: uploadError } = await supabase.storage
      .from("user_uploads") // Change "user_uploads" to your actual bucket
      .upload(fileName, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError.message);
      alert("File upload failed");
      return;
    }

    imageUrl = `https://tsiriyarbapweplseeqv.supabase.co/storage/v1/object/public/user_uploads/${fileName}`;
  }

  // Insert Post into Database
  let { error: postError } = await supabase
    .from("posts")
    .insert([{ 
      caption, 
      image_url: imageUrl, 
      user_name: userData.user_name, 
      username: userData.username 
    }]);

  if (postError) {
    console.error("Error inserting post:", postError.message);
    alert("Failed to post");
    return;
  }

  alert("Post posted!");
  postForm.classList.remove("active");
  document.getElementById("caption").value = "";
  fileInput.value = "";
};

// Function to display posts
let postui = (name_of_user, username_of_user, caption, imageUrl) => {
  let post_div = document.createElement("div");
  post_div.innerHTML = `
    <div class="post-card">
        <div class="post-header">
            <img src="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png" alt="User" class="profile-pic">
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

// Fetch existing posts
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

// Listen for real-time new posts
supabase
  .channel("posts_changes")
  .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, (payload) => {
    let newPost = payload.new;
    postui(newPost.user_name, newPost.username, newPost.caption, newPost.image_url);
  })
  .subscribe();

// Load posts on page open
fetchPosts();

// Listen for form submission
document.getElementById("postForm").addEventListener("submit", uploadPost);
