// import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
// import { Supabaseconfig } from "../config.js";

// const supabase = createClient(Supabaseconfig.url, Supabaseconfig.ApiKey);

// let create_btn = document.getElementById("create_btn");
// let closebtn = document.getElementById("close");
// let postForm = document.getElementById("postForm");

// // Toggle post form visibility
// create_btn.addEventListener("click", () => {
//   postForm.classList.toggle("active");
// });

// closebtn.addEventListener("click", () => {
//   postForm.classList.remove("active");
// });

// // ✅ Function to Get Logged-In User Details
// const getLoggedInUser = async () => {
//   const { data: { user }, error } = await supabase.auth.getUser();
//   if (error || !user) {
//     console.error("Error fetching user:", error?.message);
//     alert("User not logged in");
//     return null;
//   }
//   return user;
// };

// // ✅ Upload Post
// let uploadPost = async (event) => {
//   event.preventDefault();
  
//   let user = await getLoggedInUser();
//   if (!user) return;
  
//   let caption = document.getElementById("caption").value;
//   let fileInput = document.getElementById("file");
//   let file = fileInput.files.length > 0 ? fileInput.files[0] : null;
  
//   if (!file && caption.trim() === "") {
//     alert("Post must consist of either an image or some text");
//     return;
//   }
  
//   let imageUrl = "";
//   if (file) {
//     const fileName = `user_uploads/${Date.now()}-${file.name}`;
//     let { data, error } = await supabase.storage
//     .from("images")
//     .upload(fileName, file, { contentType: file.type });
    
//     if (error) {
//       console.error("Image upload failed:", error.message);
//       alert("Failed to upload image");
//       return;
//     }
    
//     imageUrl =  `https://tsiriyarbapweplseeqv.supabase.co/rest/v1/users?select=user_name,username,Email&id=eq.7376d3d1-308b-4383-8bee-a563ade28667`;
// ;
//   }
  
//   let userId = parseInt(user.id); // Ensure it's a number
//   console.log("User ID:", user.id, "Type:", typeof user.id);
  
//   let { data: userData, error: userError } = await supabase
//   .from("users")
//   .select("user_name, username")
//   .eq("id", userId)  // ✅ Pass as an integer
//   .single();

// if (userError) {
//   console.error("Error fetching user data:", userError);
// } else {
//   console.log("Fetched user data:", userData);
// }


//   let user_name = userData.user_name;
//   let username = userData.username;

//   // ✅ Insert Post into Database
//   let { data, error } = await supabase
//     .from("posts")
//     .insert([{ caption, image_url: imageUrl, user_name, username }]);

//   if (error) {
//     console.error("Error inserting post:", error.message);
//     alert("Failed to post");
//     return;
//   }

//   alert("Post posted successfully!");
//   postForm.classList.remove("active");
// };

// // ✅ Function to Display a Post
// let postui = (name_of_user, username_of_user, caption, imageUrl) => {
//   let post_div = document.createElement("div");
//   post_div.innerHTML = `
//     <div class="post-card">
//         <div class="post-header">
//             <img src="https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png" alt="User" class="profile-pic">
//             <p>${name_of_user}</p>
//             <span class="username">${username_of_user}</span>
//         </div>
//         ${imageUrl ? `<img src="${imageUrl}" alt="Post Image" class="post-image">` : ""}
//         <div class="post-actions">
//             <i class="fas fa-heart like-icon"></i>
//             <i class="fas fa-comment comment-icon"></i>
//             <i class="fa-solid fa-trash"></i>
//         </div>
//         <p class="post-title">${caption}</p>
//     </div>
//   `;
//   document.getElementById("post-container").appendChild(post_div);
// };

// // ✅ Fetch Existing Posts
// let fetchPosts = async () => {
//   let { data, error } = await supabase.from("posts").select("*");

//   if (error) {
//     console.error("Error fetching posts:", error.message);
//     return;
//   }

//   data.forEach((post) => {
//     postui(post.user_name, post.username, post.caption, post.image_url);
//   });
// };

// // ✅ Real-Time Post Updates
// const channel = supabase
//   .channel("posts_changes")
//   .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, (payload) => {
//     let newPost = payload.new;
//     postui(newPost.user_name, newPost.username, newPost.caption, newPost.image_url);
//   })
//   .subscribe();

// // ✅ Load Posts on Page Open
// fetchPosts();
// document.getElementById("upload").addEventListener("click", uploadPost);

// // ✅ Profile Section
// let profile_btn = document.getElementById("profile");

// const showProfile = async () => {
//   let user = await getLoggedInUser();
//   console.log("User ID:", user.id, "Type:", typeof user.id);

//   if (!user) return;

//   // ✅ Fetch user details using UUID
//   let { data: userData, error: userError } = await supabase
//     .from("users")
//     .select("user_name, username, Email")
//     .eq("id", user.id)
//     .single();

//   if (userError || !userData) {
//     console.error("Error fetching user profile:", userError?.message);
//     alert("Failed to fetch profile data");
//     return;
//   }

  // let profileDiv = document.getElementById("profile_page");
//   profileDiv.innerHTML = `
//       <div class="profile-section" id="profileSection">
//         <h2>Profile Details</h2>
//         <img src="https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png" alt="User" class="profile-pic">
//         <p><i class="fa-solid fa-pencil" id="setImage"></i> Set an image </p>
//         <br>
//         <p id="nameInput">${userData.user_name}</p>
//         <p id="usernameInput">${userData.username}</p>
//         <p id="emailInput">${userData.email}</p>
//         <button class="close-btn" id="close-btn">Close</button>
//       </div>
//   `;

//   let profileSection = document.getElementById("profileSection");
//   profileSection.classList.toggle("active");

//   let close_btn = document.getElementById("close-btn");
//   close_btn.addEventListener("click", function () {
//     profileSection.classList.toggle("active");
//   });
// };

// profile_btn.addEventListener("click", showProfile);









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
      .from("images")
      .upload(fileName, file, { contentType: file.type });

    if (error) {
      console.error("Image upload failed:", error.message);
      alert("Failed to upload image");
      return;
    }

    imageUrl = `https://tsiriyarbapweplseeqv.supabase.co/storage/v1/object/public/images/${fileName}`;
  }

  // Fetch user data first
  let { data: userData, error: userError } = await supabase.from("users").select("user_name").limit(1);

  if (userError || !userData || userData.length === 0) {
    console.error("Error fetching user data:", userError?.message);
    alert("Failed to fetch user data");
    return;
  }

  let user_name = userData[0].user_name;

  // Insert post
  let { data, error } = await supabase
    .from("posts")
    .insert([{ caption, image_url: imageUrl, user_name, username: "@johndoe" }]);

  if (error) {
    console.error("Error inserting post:", error.message);
    alert("Failed to post");
    return;
  }

  alert("Post posted");
  postForm.classList.remove("active");
};

