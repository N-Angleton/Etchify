import { checkFile, updateStyle, updateColor, removeStyle, removeColor, processImage } from "./scripts/listeners";

document.addEventListener("DOMContentLoaded", () => {
    const upload = document.getElementById('upload');
    upload.addEventListener("change", checkFile);

    const styleButtons = document.getElementsByClassName('style');
    for (let i = 0; i < styleButtons.length; i++) {
        styleButtons[i].addEventListener('click', updateStyle);
    }

    const colorButtons = document.getElementsByClassName('color');
    for (let i = 0; i < colorButtons.length; i++) {
        colorButtons[i].addEventListener('click', updateColor);
    }

    const styleToggles = document.getElementsByClassName('changeStyle');
    for (let i = 0; i < styleToggles.length; i++) {
        styleToggles[i].addEventListener('click', removeStyle);
    }

    const colorInputs = document.getElementsByClassName('colorInput');
    for (let i = 0; i < colorInputs.length; i++) {
        colorInputs[i].addEventListener('change', removeColor);
    }

    const lineSlider = document.getElementById('shadeSensitivity')
    lineSlider.addEventListener('change', () => {
        if (lineSlider.value !== 1) {
            const silhouette = document.getElementById('style4');
            if (silhouette.checked) silhouette.checked = false;
        }
    });

    const startButton = document.getElementById('start');
    startButton.addEventListener('click', processImage);
});