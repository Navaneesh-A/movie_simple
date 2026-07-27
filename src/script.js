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


// --------------------
// Protect Home Page
// --------------------

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    getMovies();

});


// --------------------
// DOM Elements
// --------------------

const titleInput = document.getElementById("title");
const dateInput = document.getElementById("date");
const addButton = document.getElementById("addMovie");
const movieList = document.getElementById("movieList");
const logoutBtn = document.getElementById("logoutBtn");


// --------------------
// Logout
// --------------------

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

    try {

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

    } catch (error) {

        console.error(error);

    }

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