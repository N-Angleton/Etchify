import { checkFile } from "./scripts/files";

document.addEventListener("DOMContentLoaded", () => {
    const upload = document.getElementById('upload');
    upload.addEventListener("change", checkFile);
});