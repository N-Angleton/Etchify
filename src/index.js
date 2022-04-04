// import Example from "./scripts/example"

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
    console.log(iBP)
    process(iBP)
    upload.value = ""
}

function process(iBP){
    const unit = 8
    const height = iBP.height - (iBP.height % unit)
    const width = iBP.width - (iBP.width % unit)
    // refactor later to not trim edge
    const hiddenCanvas = new OffscreenCanvas(height, width)
    const hiddenCtx = hiddenCanvas.getContext('2d')
    hiddenCtx.drawImage(iBP, 0, 0, width, height)
    const data = hiddenCtx.getImageData(0,0,width,height)
    console.log(data)
    etchify(data, unit)
}

// function etchify(data, unit){
//     const cells = (data.width * data.height) / (unit ** 2)

//     const width = data.width
//     const height = data.height

//     const canvas = document.getElementById('canvas')
//     canvas.width = width
//     canvas.height = height
//     const context = canvas.getContext('2d')

//     const newData = context.createImageData(data.width, data.height)
//     const arr = new Array(cells)

//     for (let row = 0; row < height; row++) {
//         for (let col = 0; col < width; col++) {
//                 arr[(row * width) + col] = (data.data[(row * width) + col] + data.data[(row * width) + col + 1] + data.data[(row * width) + col + 2])
//         }
//     }

//     arr.forEach((val, ind) => {
//         let bound_val = val / 3
//         for (let j = 0; j < 3; j++) {
//             newData.data[ind + j] = bound_val 
//         }
//         newData.data[ind + 3] = 255
//     });
//     debugger
//     context.putImageData(newData, 0, 0);
// }

// function etchify(data, unit){
//     const width = data.width
//     const height = data.height

//     const canvas = document.getElementById('canvas')
//     const ctx = canvas.getContext('2d')
//     canvas.width = width
//     let hor = width / unit;
//     canvas.height = height
//     let ver = height / unit;

//     const newData = ctx.createImageData(hor, ver)

//     const arr = new Array((width * height) / (unit ** 2))

//     arr.forEach( (el, i) => arr[i] = 0 )

//     for (let i = 0; i < data.data.length; i++) {
//         let cell = i % 4
//         let row = (i / width) / unit
//         let col = (i / height) / unit
//         if ( cell < 3) {
//             arr[(row * hor) + col] += data.data[i]
//         }
//     }

//     arr.forEach( (val, ind) => {
//         let bound_val = val / 3
//         for (let j = 0; j < 3; j++) {
//             newData.data[(3 * ind) + j] = bound_val 
//         }
//         newData.data[(3 * ind) + 3] = 255
//     });
//     debugger
//     ctx.putImageData(newData, 0, 0);
// }

// function etchify(data, unit){
//     const width = data.width
//     const height = data.height

//     const canvas = document.getElementById('canvas')
//     const ctx = canvas.getContext('2d')

//     canvas.width = width
//     canvas.height = height

//     let arr = new Array(height / unit)
//     arr.forEach( (el, i) => {
//         arr[i] = new Array(width / unit)
//     })

//     for (let i = 0; i < data.data.length; i+= 4) {
//         let row = (i / (width * 4)) / unit
//         let col = (i % (width * 4)) / unit
//         debugger
//         if (typeof(arr[row][col]) === 'undefined') arr[row][col] = 0;
//         arr[row][col] += (data.data[i] + data.data[i + 1] + data.data[i + 2])
//     }

//     const newData = ctx.createImageData(width * 4 / unit, height * 4 / unit)

//     arr.forEach( (el, i) => {
//         el.forEach( (val, j) => {
//             let new_val = val / (3 * (unit ** 2))
//             newData[i * (width * 4 / unit) + j] = new_val
//         })
//     })

//     ctx.putImageData(newData, 0, 0);
// }

function etchify(data, unit){
    const width = data.width;
    const height = data.height;

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const newData = ctx.createImageData(width, height);

    const area = unit * unit;
    const pixels = data.data.length / 4;
    const countOfCells = pixels / area;

    for (let cell = 0; cell < countOfCells; cell++) {
        let acc = 0;
        let row = Math.floor(cell / (width / unit))
        let col = (cell % (width / unit))
        for (let pixel = 0; pixel < area; pixel++) {
            let dRow = row + Math.floor(pixel / unit);
            let dCol = col + (pixel % unit);
            let num = 4 * ((dRow * width) + dCol);
            acc += (data.data[num] + data.data[num + 1] + data.data[num + 2]);
        }
        drawCell(cell, acc, newData);
    }

    ctx.putImageData(newData, 0, 0);
}

function drawCell(cell, acc, newData){
    let width = newData.width
    let unit = 8;
    const area = unit * unit;

    let val = (acc / (unit * unit * 3));
    let row = Math.floor(cell / (width / unit));
    let col = (cell % (width / unit));

    for (let pixel = 0; pixel < area; pixel++) {
        let dRow = row + Math.floor(pixel / unit);
        let dCol = col + (pixel % unit);
        let num = 4 * ((dRow * width) + dCol);
        newData.data[num] = val;
        newData.data[num + 1] = val;
        newData.data[num + 2] = val;
        newData.data[num + 3] = 255;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const upload = document.getElementById('upload');
    upload.addEventListener("change", checkFile);
})