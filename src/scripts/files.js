import { Etching } from "./etching";

export function checkFile(e){
  e.stopPropagation();
  const file = e.target.files;
  if (file.length ===1 ) {
    const button = document.getElementById("submit");
    button.addEventListener('click', processFile);
  }
}

async function processFile(){
  const upload = document.getElementById('upload');
  const file = upload.files[0];
  const iBP = await createImageBitmap(file);
  new Etching(iBP);
}