import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const Supabaseconfig = {
  url: "https://tsiriyarbapweplseeqv.supabase.co",
  ApiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzaXJpeWFyYmFwd2VwbHNlZXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5Mjc0NDYsImV4cCI6MjA1NDUwMzQ0Nn0.3vinucDxTzvjfHxzOAUj59s3deoJ710FMyi0YF6fzZw"
};

const supabase = createClient(Supabaseconfig.url, Supabaseconfig.ApiKey);



import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
const firebaseConfig = {
  apiKey: "AIzaSyDqNuQjDQ10QkYTS58Y2uSEysUdLPYsUqw",
  authDomain: "social-login-and-sign-up.firebaseapp.com",
  projectId: "social-login-and-sign-up",
  storageBucket: "social-login-and-sign-up.appspot.com",
  messagingSenderId: "135117853732",
  appId: "1:135117853732:web:87bc018d0da690110f34b1",
  measurementId: "G-4ZFT252G50"
};

const app = initializeApp(firebaseConfig);

export { supabase, Supabaseconfig , app  };
