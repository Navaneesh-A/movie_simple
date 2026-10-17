import { db, auth } from "../config/firebase.js";


import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "firebase/firestore";

import {
    signOut,
    onAuthStateChanged
} from "firebase/auth";
// import {
//     collection,
//     addDoc,
//     getDocs,
//     deleteDoc,
//     doc
// } from "firebase/firestore";

// import {
//     signOut,
//     onAuthStateChanged
// } from "firebase/auth";

// --------------------
// Protect Home Page
// --------------------
import dbx from "../dropbox.js";
onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    getMovies();

});
console.log(db);
console.log("DB =", db);
// --------------------
// DOM Elements
// --------------------

const titleInput = document.getElementById("title");
const dateInput = document.getElementById("date");
const addButton = document.getElementById("addMovie");
const movieList = document.getElementById("movieList");
const logoutBtn = document.getElementById("logoutBtn");
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");

// --------------------
// Logout
// --------------------
uploadBtn.addEventListener("click", uploadToDropbox);
async function uploadToDropbox() {

    const file = fileInput.files[0];

    if (!file) {
        alert("Please choose a file.");
        return;
    }

    try {

        await dbx.filesUpload({

            path: "/" + file.name,
            contents: file

        });

        alert("File uploaded successfully!");

    }
    catch (error) {

        console.error(error);

        console.log(await error.error);

    }

}
logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "index.html";

});


// --------------------
// Add Movie
// --------------------

addButton.addEventListener("click", addMovie);

async function addMovie() {

    const title = titleInput.value.trim();
    const date = dateInput.value;

    if (title === "" || date === "") {
        alert("Please enter title and release year");
        return;
    }

    try {

        await addDoc(collection(db, "movies"), {
            title: title,
            date: Number(date)
        });

        titleInput.value = "";
        dateInput.value = "";
        getMovies();

        try {
            const response = await fetch("http://localhost:3000/api/movies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    date: Number(date)
                })
            });

            if (!response.ok) {
                throw new Error(`MongoDB API returned ${response.status}`);
            }

            alert("Movie added to Firebase and MongoDB.");
        } catch (mongoError) {
            console.error("Movie was saved to Firebase but not MongoDB:", mongoError);
            alert("Movie was saved to Firebase, but the MongoDB copy failed. Check that the backend is running.");
        }

    } catch (error) {

        console.error(error);
        alert("Error adding movie");

    }

}


// --------------------
// Get Movies
// --------------------

async function getMovies() {

    movieList.innerHTML = "";


    const querySnapshot = await getDocs(collection(db, "movies"));

    querySnapshot.forEach((movieDocument) => {

        const movie = movieDocument.data();

        const div = document.createElement("div");

        div.className = "movie-card";

        div.innerHTML = `
                <div>
                    <h3>${movie.title}</h3>
                    <p>${movie.date}</p>
                </div>

                <button class="delete-btn">
                    Delete
                </button>
            `;

        div.querySelector(".delete-btn")
            .addEventListener("click", () => {
                deleteMovie(movieDocument.id);
            });

        movieList.appendChild(div);

    });

}




// --------------------
// Delete Movie
// --------------------

async function deleteMovie(id) {

    try {

        await deleteDoc(doc(db, "movies", id));

        getMovies();

    } catch (error) {

        console.error(error);

    }

}