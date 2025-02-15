import { supabase, Supabaseconfig } from "./config.js";
// console.log(supabase, Supabaseconfig);

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
//     const fileName = `${Date.now()}-${file.name}`
//     if (!file && caption.trim() === '') {
//         alert("Post must consist of either an image or some text");
//         return;
//     }
//     const { data, error } = await supabase.storage
//     .from("images")  
//     .upload(fileName, file);

// if (error) {
//     console.error("Upload error:", error.message);
// } else {
//     console.log("File uploaded successfully:", data);
//     getPublicUrl(fileName); 
// }


let imageUrl = file ? URL.createObjectURL(file) : '';
let post_div = document.createElement("div");
post_div.innerHTML = `
    <div class="post-card">
        <div class="post-header">
            <img src="./logo (2).png" alt="User" class="profile-pic">
            <span class="username">John Doe</span>
        </div>
        ${file ? `<img src="${imageUrl}" alt="Post Image" class="post-image">` : ''}
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
    
});


//  profile details 
let profile = document.getElementById("profile");
profile.addEventListener ("click" , async function(){
    
})