import { Etching } from "./etching";

export function checkFile(e){
  e.stopPropagation();

  const files = e.target.files;
  const fileName = document.getElementById('fileInputContainer');
  const startButton = document.getElementById('start');

  startButton.innerText ="Draw"

  if (files.length === 0) {
    fileName.innerText = 'Choose File';
    fileName.classList.remove('selected')
  }
  if (files.length === 1 ) {
    fileName.innerText = files[0].name;
    fileName.classList.add('selected')
  }
}

export function updateStyle(e){
  e.stopPropagation();
  const shadeBox = document.getElementById('toggleShading')
  const lineBox = document.getElementById('toggleOutline')
  const lineSlider = document.getElementById('shadeSensitivity')
  if (e.target.value === 'shade') {
    shadeBox.checked = true;
    lineBox.checked = false;
    lineSlider.value = 3;
    lineSlider.dispatchEvent(new Event('input'));
  }
  if (e.target.value === 'line') {
    shadeBox.checked = false;
    lineBox.checked = true;
    lineSlider.value = 3;
    lineSlider.dispatchEvent(new Event('input'));
  }
  if (e.target.value === 'shade&line') {
    shadeBox.checked = true;
    lineBox.checked = true;
    lineSlider.value = 3;
    lineSlider.dispatchEvent(new Event('input'));
  }
  if (e.target.value === 'silhouette') {
    shadeBox.checked = true;
    lineBox.checked = false;
    lineSlider.value = 1;
    lineSlider.dispatchEvent(new Event('input'));
  }
}

export function updateColor(e){
  e.stopPropagation();
  const lineColor = document.getElementById('lineColor');
  const shadeColor = document.getElementById('shadeColor');
  const color = e.target.dataset.color;
  lineColor.value = color;
  shadeColor.value = color;
}

export function removeStyle(e){
  e.stopPropagation();
  const checkedButton = document.querySelector('.style:checked');
  if (checkedButton) checkedButton.checked = false;
}

export function removeColor(e){
  e.stopPropagation();
  const checkedColor = document.querySelector('.color:checked');
  if (checkedColor) checkedColor.checked = false;
}

export async function processImage(e){
  e.stopPropagation();
  const startButton = document.getElementById('start');

  const upload = document.getElementById('upload');
  const files = upload.files;

  if (files.length === 0) {
    startButton.innerText = "Please select a file first"
    return
  }

  const shadeBox = document.getElementById('toggleShading')
  const lineBox = document.getElementById('toggleOutline')

  if (!(shadeBox.checked || lineBox.checked)) {
    startButton.innerText = "Please select shade or outline"
    return
  }

  let bitmap = await createImageBitmap(files[0])
  new Etching(bitmap)
}