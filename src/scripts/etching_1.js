export class Etching{
  constructor(bitMap){
    this.unit = 2;
    this.height = bitMap.height - (bitMap.height % this.unit);
    this.width = bitMap.width - (bitMap.width % this.unit);

    this.hiddenCanvas = new OffscreenCanvas(this.height, this.width);
    this.hiddenCtx = this.hiddenCanvas.getContext('2d');
    this.hiddenCtx.drawImage(bitMap, 0, 0, this.width, this.height);

    this.canvas = document.getElementById('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');

    this.newData = this.ctx.createImageData(this.width, this.height);

    this.data = this.hiddenCtx.getImageData(0, 0, this.width, this.height);

    this.area = this.unit * this.unit;
    this.pixels = this.data.data.length / 4;
    this.countOfCells = this.pixels / this.area;
    this.etchify();
    // this.ctx.drawImage(bitMap, 0, 0, this.width, this.height);
  }

  etchify(){
    let acc = 0;
    for (let cell = 0; cell < this.countOfCells; cell++) {
      acc = 0;
      let row = Math.floor(cell / (this.width / this.unit))
      let col = (cell % (this.width / this.unit))
      for (let pixel = 0; pixel < this.area; pixel++) {

        let dRow = ((row * this.unit) + Math.floor(pixel / this.unit))
        let dCol = col * this.unit + (pixel % this.unit)
        let num = 4 * ((dRow * this.width) + dCol)
        acc += (this.data.data[num] + this.data.data[num + 1] + this.data.data[num + 2])
        if (acc === 0) debugger

      }

      this.drawCell(cell, acc);
      if (cell % 1000 === 0) console.log(cell);
    }
    // debugger
    console.log(this.newData);
    this.ctx.putImageData(this.newData, 0, 0);
  }

  drawCell(cell, acc) {
    if (cell % 1000 === 0) console.log(cell);
    let val = Math.floor(acc / (this.area * 3));
    let row = Math.floor(cell / (this.width / this.unit));
    let col = (cell % (this.width / this.unit));
    for (let pixel = 0; pixel < this.area; pixel++) {
      const dRow = row * this.unit + Math.floor(pixel / this.unit);
      const dCol = col * this.unit + (pixel % this.unit);
      let num = 4 * ((dRow * this.width) + dCol);
      // console.log(`Cell: ${cell}, row: ${dRow}, col: ${dCol}, num: ${num}, val: ${val}`);
      this.newData.data[num] = val;
      this.newData.data[num + 1] = val;
      this.newData.data[num + 2] = val;
      this.newData.data[num + 3] = 255;
    }
  }

}