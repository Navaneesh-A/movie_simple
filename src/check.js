import dbx from "../dropbox.js";

const uploadBtn = document.getElementById("upload");
const fileInput = document.getElementById("file");

uploadBtn.addEventListener("click", async () => {

    const file = fileInput.files[0];

    if (!file) {
        alert("Choose a file");
        return;
    }

    try {

        await dbx.filesUpload({
            path: "/" + file.name,
            contents: file
        });

        alert("File uploaded successfully!");

    } catch (error) {

        console.error(error);

    }

});