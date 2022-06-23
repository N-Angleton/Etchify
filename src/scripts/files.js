import { Etching } from "./etching";

export function checkFile(e){
  e.stopPropagation();
  const files = e.target.files;
  if (files.length === 1 ) {
    const button = document.getElementById("submit");
    button.addEventListener('click', processFile);
  }
}

async function processFile(){
  const upload = document.getElementById('upload');
  const file = upload.files[0];
  const imageBitMap = await createImageBitmap(file);
  new Etching(imageBitMap);
}