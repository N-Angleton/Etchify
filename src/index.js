// import Example from "./scripts/example"

import { Etching } from "./scripts/etching";

function checkFile(e){
    e.stopPropagation()
    const file = e.target.files
    if (file.length != 1) {
        const feedback = document.getElementById("feedback")
        feedback.innerText = "Invalid number of files";
    }
    else {
        const button = document.getElementById("submit")
        button.addEventListener('click', processFile)
    }
}

async function processFile(){
    const upload = document.getElementById('upload')
    const file = upload.files[0]
    const iBP = await createImageBitmap(file);
    // console.log(iBP)
    // process(iBP)
    new Etching(iBP)
    upload.value = ""
}

// function process(iBP){
//     const unit = 8
//     const height = iBP.height - (iBP.height % unit)
//     const width = iBP.width - (iBP.width % unit)
//     // refactor later to not trim edge
//     const hiddenCanvas = new OffscreenCanvas(height, width)
//     const hiddenCtx = hiddenCanvas.getContext('2d')
//     hiddenCtx.drawImage(iBP, 0, 0, width, height)
//     const data = hiddenCtx.getImageData(0,0,width,height)
//     console.log(data)
//     etchify(data, unit)
// }

// function etchify(data, unit){
//     const width = data.width;
//     const height = data.height;

//     const canvas = document.getElementById('canvas');
//     canvas.width = width;
//     canvas.height = height;
//     const ctx = canvas.getContext('2d');


//     const newData = ctx.createImageData(width, height);

//     const area = unit * unit;
//     const pixels = data.data.length / 4;
//     const countOfCells = pixels / area;

//     for (let cell = 0; cell < countOfCells; cell++) {
//         let acc = 0;
//         let row = Math.floor(cell / (width / unit))
//         let col = (cell % (width / unit))
//         for (let pixel = 0; pixel < area; pixel++) {
//             let dRow = row + Math.floor(pixel / unit);
//             let dCol = col + (pixel % unit);
//             let num = 4 * ((dRow * width) + dCol);
//             acc += (data.data[num] + data.data[num + 1] + data.data[num + 2]);
//         }
//         drawCell(cell, acc, newData);
//     }
//     debugger
//     console.log(newData)
//     ctx.putImageData(newData, 0, 0);
// }

// function drawCell(cell, acc, newData){
//     let width = newData.width
//     let unit = 8;
//     const area = unit * unit;

//     let val = (acc / (unit * unit * 3));
//     let row = Math.floor(cell / (width / unit));
//     let col = (cell % (width / unit));
    
//     for (let pixel = 0; pixel < area; pixel++) {
//         let dRow = row + Math.floor(pixel / unit);
//         let dCol = col + (pixel % unit);
//         let num = 4 * ((dRow * width) + dCol);
//         newData.data[num] = val;
//         newData.data[num + 1] = val;
//         newData.data[num + 2] = val;
//         newData.data[num + 3] = 255;
//     }
// }


document.addEventListener("DOMContentLoaded", () => {
    const upload = document.getElementById('upload');
    upload.addEventListener("change", checkFile);
})