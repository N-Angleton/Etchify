export class Etching {
  constructor(bitMap){
    this.unit = 1;
    this.area = this.unit * this.unit;

    this.width = bitMap.width;
    this.hor = Math.ceil(this.width / this.unit);

    this.pix = this.width * 4;

    this.height = bitMap.height;
    this.vert = Math.ceil(this.height / this.unit);

    this.hiddenCanvas = new OffscreenCanvas(this.height, this.width);
    this.hiddenCtx = this.hiddenCanvas.getContext('2d');
    this.hiddenCtx.drawImage(bitMap, 0, 0);
    
    this.canvas = document.getElementById('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = canvas.getContext('2d');

    this.data = this.hiddenCtx.getImageData(0, 0, this.width, this.height);
    this.newData = this.ctx.createImageData(this.data);

    this.etchify();
    // this.ctx.drawImage(bitMap, 0, 0);
  }

  etchify(){
    let acc = 0;
    let num = 0;
    for (let row = 0; row < this.vert; row++) {
      for (let col = 0; col < this.hor; col++) {
        acc = 0;
        num = 0;
        for (let i = 0; i < this.area; i++){
          let prev_rows = this.pix * (row + Math.floor(i / this.unit));
          let prev_col = 4 * ((col * this.unit) + (i % this.unit));
          let val = this.data.data[prev_rows + prev_col];
          if (typeof(val) === 'undefined') {continue;}
          else {
          num += 1
          acc += val;
          acc += this.data.data[prev_rows + prev_col + 1];
          acc += this.data.data[prev_rows + prev_col + 2];
          }
          // console.log(`row: ${row}, col: ${col}, prev_rows: ${prev_rows}, prev_col: ${prev_col}`);
          if (acc === 0) debugger
        }
        this.drawCell(row, col, acc, num);
      }
    }
    console.log(this.newData);
    this.ctx.putImageData(this.newData, 0, 0);
  }

  drawCell(row, col, acc, num){
    let val = Math.floor(acc / (3 * num));

    for (let i = 0; i < this.area; i++) {
      let prev_rows = this.pix * (row + Math.floor(i / this.unit));
      let prev_col = 4 * ((col * this.unit) + (i % this.unit));
      // console.log(`val: ${val}, row: ${row}, col: ${col}, prev_rows: ${prev_rows}, prev_col: ${prev_col}`);
      this.newData.data[prev_rows + prev_col] = val;
      this.newData.data[prev_rows + prev_col + 1] = val;
      this.newData.data[prev_rows + prev_col + 2] = val;
      this.newData.data[prev_rows + prev_col + 3] = 255;
    }
  }


}