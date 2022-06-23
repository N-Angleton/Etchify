export class Etching {
  constructor(bitMap){
    this.unit = parseInt(document.querySelector("input[name='unit']").value);
    this.area = this.unit * this.unit;

    this.lineConstant = (101 - parseInt(document.querySelector("input[name='lineSensitivity']").value)) / 4;

    this.animate = Boolean(document.querySelector("input[name='animate']:checked").value === "true");
    this.animationDelay = 10;

    this.shadeBool = Boolean(document.querySelector("input[name='shadeBool']:checked").value === "true");
    this.lineBool = Boolean(document.querySelector("input[name='lineBool']:checked").value === "true");

    this.color = document.querySelector("input[name='shadeColor']").value;
    this.colorStrings = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.color);
    this.rgb = { red: parseInt(this.colorStrings[1], 16), green: parseInt(this.colorStrings[2], 16), blue: parseInt(this.colorStrings[3], 16) };

    this.lineColor = document.querySelector("input[name='lineColor']").value;
    this.lineColorStrings = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.lineColor);
    this.lineRgb = { red: parseInt(this.lineColorStrings[1], 16), green: parseInt(this.lineColorStrings[2], 16), blue: parseInt(this.lineColorStrings[3], 16) };

    this.distinctShades = parseInt(document.querySelector("input[name='shades']").value);
    this.shadingIndex = parseInt(document.querySelector("input[name='shading']:checked").value);

    this.width = bitMap.width - (bitMap.width % this.unit);
    this.hor = this.width / this.unit;
    
    this.height = bitMap.height - (bitMap.height % this.unit);
    this.vert = this.height / this.unit;

    this.hiddenCanvas = new OffscreenCanvas(this.width, this.height);
    this.hiddenCtx = this.hiddenCanvas.getContext('2d');
    this.hiddenCtx.drawImage(bitMap, 0, 0, this.width, this.height);

    this.canvas = document.getElementById('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = canvas.getContext('2d');

    this.lineCanvas = document.getElementById('lineCanvas');
    this.lineCanvas.width = this.width;
    this.lineCanvas.height = this.height;
    this.lineCtx = lineCanvas.getContext('2d');

    this.oldData = this.hiddenCtx.getImageData(0, 0, this.width, this.height);
    this.newData = this.ctx.createImageData(this.oldData);
    this.lineData = this.lineCtx.createImageData(this.oldData);
  
    this.etchify();
  }

  async etchify(){
    let acc;
    let rawAcc;
    let accRed;
    let accGreen;
    let accBlue;
    for (let row = 0; row < this.vert; row++) {
      for (let col = 0; col < this.hor; col++) {
        acc = 0;
        rawAcc = 0;
        accRed = 0;
        accGreen = 0;
        accBlue = 0;
        let pixelsAbove = row * this.unit * this.width * 4;
        let pixelsLeft = col * this.unit * 4;
        let pixelsBeforeCell = pixelsAbove + pixelsLeft ;
        for (let i = 0; i < this.area; i++) {

          let pixelsAboveInCell = Math.floor(i / this.unit) * this.width * 4;
          let pixelsLeftInCell = (i % this.unit) * 4;
          let startingPixel = pixelsBeforeCell + pixelsAboveInCell + pixelsLeftInCell;

          acc += 0.299 * this.oldData.data[startingPixel];
          acc += 0.587 * this.oldData.data[startingPixel + 1];
          acc += 0.114 * this.oldData.data[startingPixel + 2];

          rawAcc += this.oldData.data[startingPixel];
          rawAcc += this.oldData.data[startingPixel + 1];
          rawAcc += this.oldData.data[startingPixel + 2];

          accRed += this.oldData.data[startingPixel];
          accGreen += this.oldData.data[startingPixel + 1];
          accBlue += this.oldData.data[startingPixel + 2];

        }
        let val = Math.floor(acc / this.area);
        if (this.lineBool) this.drawLine(pixelsBeforeCell, accRed, accGreen, accBlue, rawAcc);
        if (this.shadeBool) this.drawCell(pixelsBeforeCell, val);
      }
      if (this.animate) {
        await this.timeout(this.animationDelay);
        if (this.shadeBool) this.ctx.putImageData(this.newData, 0, 0);
        if (this.lineBool) this.lineCtx.putImageData(this.lineData, 0, 0);
      }
    }
    if (!this.animate) {
      if (this.shadeBool) this.ctx.putImageData(this.newData, 0, 0);
      if (this.lineBool) this.lineCtx.putImageData(this.lineData, 0, 0);
    }
  }

  timeout(ms){
    return new Promise( resolve => setTimeout(resolve, ms));
  }

  drawLine(pixelsBeforeCell, accRed, accGreen, accBlue, rawAcc){
    
    let avgRed = accRed / this.area;
    let avgGreen = accGreen / this.area;
    let avgBlue = accBlue / this.area;
    let avgDarkness= rawAcc / (this.area * 3);
    let squaredDiffRed = 0;
    let squaredDiffGreen = 0;
    let squaredDiffBlue = 0;
    let squaredDiffDarkness = 0;
    let darkness;
    for (let i = 0; i < this.area; i++) {
      darkness = 0;
      let pixelsAboveInCell = Math.floor(i / this.unit) * this.width * 4;
      let pixelsLeftInCell = (i % this.unit) * 4;
      let startingPixel = pixelsBeforeCell + pixelsAboveInCell + pixelsLeftInCell;
      squaredDiffRed += Math.pow((this.oldData.data[startingPixel] - avgRed), 2);
      squaredDiffGreen += Math.pow((this.oldData.data[startingPixel + 1] - avgGreen), 2);
      squaredDiffBlue += Math.pow((this.oldData.data[startingPixel + 2] - avgBlue), 2);

      darkness += this.oldData.data[startingPixel];
      darkness += this.oldData.data[startingPixel + 1];
      darkness += this.oldData.data[startingPixel + 2];
      squaredDiffDarkness += Math.pow( (darkness / 3) - avgDarkness, 2);
    }
    let sDevRed = Math.pow((squaredDiffRed / (this.area)), 0.5);
    let sDevGreen = Math.pow((squaredDiffGreen / (this.area)), 0.5);
    let sDevBlue = Math.pow((squaredDiffBlue / (this.area)), 0.5);
    let sDevDarkness = Math.pow((squaredDiffDarkness / this.area), 0.5);
    if (sDevRed > this.lineConstant || sDevGreen > this.lineConstant ||
      sDevBlue > this.lineConstant || sDevDarkness > this.lineConstant) {
      for (let i = 0; i < this.area; i++) {
        let pixelsAboveInCell = Math.floor(i / this.unit) * this.width * 4;
        let pixelsLeftInCell = (i % this.unit) * 4;
        let startingPixel = pixelsBeforeCell + pixelsAboveInCell + pixelsLeftInCell;
        this.lineData.data[startingPixel] = this.lineRgb.red;
        this.lineData.data[startingPixel + 1] = this.lineRgb.green;
        this.lineData.data[startingPixel + 2] = this.lineRgb.blue;
        this.lineData.data[startingPixel + 3] = 255;
      }
    }
  }

  drawCell(pixelsBeforeCell, val){
    if (this.shadingIndex === 0) { this.basicShade(pixelsBeforeCell, val);}
    else if (this.shadingIndex === 1) { this.verticalHatching(pixelsBeforeCell, val);}
    else if (this.shadingIndex === 2) { this.horizontalHatching(pixelsBeforeCell, val);}
    else if (this.shadingIndex === 3) {    
      this.verticalHatching(pixelsBeforeCell, val);
      this.horizontalHatching(pixelsBeforeCell, val);
    }
  }

  verticalHatching(pixelsBeforeCell, val) {
    let numberOfShadings = this.distinctShades * this.unit;
    let interval = (256 / (this.unit * this.distinctShades)) / 2;
    let shadeValue = numberOfShadings - Math.floor(val / interval);

    for (let i = 0; i < this.unit; i++) {
      let pixelsAboveInCell = i * this.width * 4;
      let startingPixel = pixelsBeforeCell + pixelsAboveInCell;

      for (let j = 0; j < shadeValue; j++) {
        this.newData.data[startingPixel + ((j % this.unit) * 4)] = this.rgb.red;
        this.newData.data[startingPixel + ((j % this.unit) * 4) + 1] = this.rgb.green;
        this.newData.data[startingPixel + ((j % this.unit) * 4) + 2] = this.rgb.blue;
        this.newData.data[startingPixel + ((j % this.unit) * 4) + 3] += (256 / this.distinctShades);
      }
    }
  }

  horizontalHatching(pixelsBeforeCell, val) {
    let numberOfShadings = this.distinctShades * this.unit;
    let interval = (256 / (this.unit * this.distinctShades)) / 2;
    let shadeValue = numberOfShadings - Math.floor(val / interval);

    for (let i = 0; i < shadeValue; i++) {

      let pixelsAboveInCell = (i % this.unit) * this.width * 4;
      let startingPixel = pixelsBeforeCell + pixelsAboveInCell;

      for (let j = 0; j < this.unit; j++) {
        this.newData.data[startingPixel + (j * 4)] = this.rgb.red;
        this.newData.data[startingPixel + (j * 4) + 1] = this.rgb.green;
        this.newData.data[startingPixel + (j * 4) + 2] = this.rgb.blue;
        this.newData.data[startingPixel + (j * 4) + 3] += (256 / this.distinctShades);
      }
    }
  }

  basicShade(pixelsBeforeCell, val) {
    let ratio = val / 255;
    for (let i = 0; i < this.area; i++) {
      let pixelsAboveInCell = Math.floor(i / this.unit) * this.width * 4;
      let pixelsLeftInCell = (i % this.unit) * 4;
      let startingPixel = pixelsBeforeCell + pixelsAboveInCell + pixelsLeftInCell;
      this.newData.data[startingPixel] = ratio * this.rgb.red;
      this.newData.data[startingPixel + 1] = ratio * this.rgb.green;
      this.newData.data[startingPixel + 2] = ratio * this.rgb.blue;
      this.newData.data[startingPixel + 3] = 255 - val;
    }
  }

}