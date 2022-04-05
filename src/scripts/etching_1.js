// export class Etching{
//   constructor(bitMap){
//     this.unit = 2;
//     this.height = bitMap.height - (bitMap.height % this.unit);
//     this.width = bitMap.width - (bitMap.width % this.unit);

//     this.hiddenCanvas = new OffscreenCanvas(this.height, this.width);
//     this.hiddenCtx = this.hiddenCanvas.getContext('2d');
//     this.hiddenCtx.drawImage(bitMap, 0, 0, this.width, this.height);

//     this.canvas = document.getElementById('canvas');
//     this.canvas.width = this.width;
//     this.canvas.height = this.height;
//     this.ctx = this.canvas.getContext('2d');

//     this.newData = this.ctx.createImageData(this.width, this.height);

//     this.data = this.hiddenCtx.getImageData(0, 0, this.width, this.height);

//     this.area = this.unit * this.unit;
//     this.pixels = this.data.data.length / 4;
//     this.countOfCells = this.pixels / this.area;
//     this.etchify();
//     // this.ctx.drawImage(bitMap, 0, 0, this.width, this.height);
//   }

//   etchify(){
//     let acc = 0;
//     for (let cell = 0; cell < this.countOfCells; cell++) {
//       acc = 0;
//       let row = Math.floor(cell / (this.width / this.unit))
//       let col = (cell % (this.width / this.unit))
//       for (let pixel = 0; pixel < this.area; pixel++) {

//         let dRow = ((row * this.unit) + Math.floor(pixel / this.unit))
//         let dCol = col * this.unit + (pixel % this.unit)
//         let num = 4 * ((dRow * this.width) + dCol)
//         acc += (this.data.data[num] + this.data.data[num + 1] + this.data.data[num + 2])
//         if (acc === 0) debugger

//       }

//       this.drawCell(cell, acc);
//       if (cell % 1000 === 0) console.log(cell);
//     }
//     // debugger
//     console.log(this.newData);
//     this.ctx.putImageData(this.newData, 0, 0);
//   }

//   drawCell(cell, acc) {
//     if (cell % 1000 === 0) console.log(cell);
//     let val = Math.floor(acc / (this.area * 3));
//     let row = Math.floor(cell / (this.width / this.unit));
//     let col = (cell % (this.width / this.unit));
//     for (let pixel = 0; pixel < this.area; pixel++) {
//       const dRow = row * this.unit + Math.floor(pixel / this.unit);
//       const dCol = col * this.unit + (pixel % this.unit);
//       let num = 4 * ((dRow * this.width) + dCol);
//       // console.log(`Cell: ${cell}, row: ${dRow}, col: ${dCol}, num: ${num}, val: ${val}`);
//       this.newData.data[num] = val;
//       this.newData.data[num + 1] = val;
//       this.newData.data[num + 2] = val;
//       this.newData.data[num + 3] = 255;
//     }
//   }

// }

// etchify(){
//   let acc = 0;
//   for (let row = 0; row < this.height; row++) {
//     for (let col = 0; col < this.width; col++) {
//       acc = 0;
//       for (let i = 0; i < this.area; i++) {
//         let prev_rows = 4 * (((row * this.unit) + Math.floor(i / this.unit)) * this.width);
//         let prev_col = 4 * ((col * this.unit) + (i % this.unit));
//         acc += this.data.data[prev_rows + prev_col];
//         acc += this.data.data[prev_rows + prev_col + 1];
//         acc += this.data.data[prev_rows + prev_col + 2];
//         // console.log(`row: ${row}, col: ${col}, prev_rows: ${prev_rows}, prev_col: ${prev_col}`);
//       }
//       this.drawCell(row, col, acc);
//     }
//   }
//   console.log(this.newData)
//   this.ctx.putImageData(this.newData, 0, 0);
// }

// this.vert = Math.floor(this.height / this.unit);
// this.vertEdge = this.height % this.unit;


// drawCell(row, col, acc){
//   let val = Math.floor(acc / (3 * this.area));

//   for (let i = 0; i < this.area; i++) {
//     let prev_rows = 4 * (((row * this.unit) + Math.floor(i / this.unit)) * this.width);
//     let prev_col = 4 * ((col * this.unit) + (i % this.unit));
//     // console.log(`val: ${val}, row: ${row}, col: ${col}, prev_rows: ${prev_rows}, prev_col: ${prev_col}`);
//     this.newData.data[prev_rows + prev_col] = val;
//     this.newData.data[prev_rows + prev_col + 1] = val;
//     this.newData.data[prev_rows + prev_col + 2] = val;
//     this.newData.data[prev_rows + prev_col + 3] = 255;
//   }
// }


// export class Etching {
//   constructor(bitMap){
//     this.unit = 10;
//     this.area = this.unit * this.unit;

//     this.width = bitMap.width;
//     this.hor = Math.ceil(this.width / this.unit);

//     this.pix = this.width * 4;

//     this.height = bitMap.height;
//     this.vert = Math.ceil(this.height / this.unit);

//     this.hiddenCanvas = new OffscreenCanvas(this.width, this.height);
//     this.hiddenCtx = this.hiddenCanvas.getContext('2d');
//     this.hiddenCtx.drawImage(bitMap, 0, 0);
    
//     this.canvas = document.getElementById('canvas');
//     this.canvas.width = this.width;
//     this.canvas.height = this.height;
//     this.ctx = canvas.getContext('2d');

//     this.data = this.hiddenCtx.getImageData(0, 0, this.width, this.height);
//     this.newData = this.ctx.createImageData(this.data);

//     this.etchify();
//     // this.ctx.drawImage(bitMap, 0, 0);
//   }

//   etchify(){
//     let acc = 0;
//     let num = 0;
//     for (let row = 0; row < this.vert; row++) {
//       for (let col = 0; col < this.hor; col++) {
//         acc = 0;
//         num = 0;
//         for (let i = 0; i < this.area; i++){
//           let prev_rows = this.pix * (row + Math.floor(i / this.unit));
//           let prev_col = 4 * ((col * this.unit) + (i % this.unit));
//           let val = this.data.data[prev_rows + prev_col];
//           if (typeof(val) === 'undefined') {continue;}
//           else {
//           num += 1
//           acc += val;
//           acc += this.data.data[prev_rows + prev_col + 1];
//           acc += this.data.data[prev_rows + prev_col + 2];
//           }
//           // console.log(`row: ${row}, col: ${col}, prev_rows: ${prev_rows}, prev_col: ${prev_col}`);
//           if (acc === 0) debugger
//         }
//         this.drawCell(row, col, acc, num);
//       }
//     }
//     console.log(this.newData);
//     this.ctx.putImageData(this.newData, 0, 0);
//   }

//   drawCell(row, col, acc, num){
//     let val = Math.floor(acc / (3 * num));

//     for (let i = 0; i < this.area; i++) {
//       let prev_rows = this.pix * (row + Math.floor(i / this.unit));
//       let prev_col = 4 * ((col * this.unit) + (i % this.unit));
//       // console.log(`val: ${val}, row: ${row}, col: ${col}, prev_rows: ${prev_rows}, prev_col: ${prev_col}`);
//       this.newData.data[prev_rows + prev_col] = val;
//       this.newData.data[prev_rows + prev_col + 1] = val;
//       this.newData.data[prev_rows + prev_col + 2] = val;
//       this.newData.data[prev_rows + prev_col + 3] = 255;
//     }
//   }


// }