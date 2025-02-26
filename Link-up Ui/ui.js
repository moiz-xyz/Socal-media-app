import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { Supabaseconfig } from "../config.js";

const supabase = createClient(Supabaseconfig.url, Supabaseconfig.ApiKey);

let create_btn = document.getElementById("create_btn");
let closebtn = document.getElementById("close");
let postForm = document.getElementById("postForm"); // Added this line

// Toggle post form visibility
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
      .from("images") // Ensure this matches your Supabase bucket name
      .upload(fileName, file, { contentType: file.type });

    if (error) {
      console.error("Image upload failed:", error.message);
      alert("Failed to upload image");
      return;
    }

    imageUrl = `https://tsiriyarbapweplseeqv.supabase.co/storage/v1/object/public/images/${fileName}`;
  }

 let  getdata = async ()=>{
    
    try {
        const { data, error } = await supabase
        .from('users')
        .select()
        if (data){
            console.log( data[0].user_name);
            
        }
        if (error) {
        console.log(error.message);
        
    }
} catch (error) {
    console.log(error.message);
    
 }

 }
  let { data, error } = await supabase
    .from("posts")
    .insert([{ caption, image_url: imageUrl, user_name: data[0].user_name, username: "@johndoe" }]);

  if (error) {
    console.error("Error inserting post:", error.message);
    alert("Failed to post");
    return;
  }

  alert("Post posted");
  postForm.classList.remove("active");
};

// Function to display a post
let postui = (name_of_user, username_of_user, caption, imageUrl) => {
  let post_div = document.createElement("div");
  post_div.innerHTML = `
    <div class="post-card">
        <div class="post-header">
            <img src="https://cdn.vectorstock.com/i/1000v/66/13/default-avatar-profile-icon-social-media-user-vector-49816613.jpg" alt="User" class="profile-pic">
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
const channel = supabase
  .channel("posts_changes")
  .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, (payload) => {
    let newPost = payload.new;
    postui(newPost.user_name, newPost.username, newPost.caption, newPost.image_url);
  })
  .subscribe();

// Load posts on page open
fetchPosts();

document.getElementById("upload").addEventListener("click", uploadPost);

