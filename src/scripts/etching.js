export class Etching {
  constructor(bitMap){
    this.unit = parseInt(document.querySelector("input[name='unit']:checked").value);
    this.area = this.unit * this.unit;

    this.shadingIndex = parseInt(document.querySelector("input[name='shading']:checked").value)
    debugger

    this.width = bitMap.width - (bitMap.width % this.unit)
    this.hor = this.width / this.unit
    
    this.height = bitMap.height - (bitMap.height % this.unit)
    this.vert = this.height / this.unit
    
    this.hiddenCanvas = new OffscreenCanvas(this.width, this.height);
    this.hiddenCtx = this.hiddenCanvas.getContext('2d');
    this.hiddenCtx.drawImage(bitMap, 0, 0, this.width, this.height);

    this.canvas = document.getElementById('canvas')
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.ctx = canvas.getContext('2d')

    this.oldData = this.hiddenCtx.getImageData(0, 0, this.width, this.height);
    this.newData = this.ctx.createImageData(this.oldData)
  
    this.etchify()
  }

  etchify(){
    let acc;
    for (let row = 0; row < this.vert; row++) {
      for (let col = 0; col < this.hor; col++) {
        acc = 0;
        let pixelsAbove = row * this.unit * this.width * 4
        let pixelsLeft = col * this.unit * 4
        let pixelsBeforeCell = pixelsAbove + pixelsLeft 
        for (let i = 0; i < this.area; i++) {
          let pixelsAboveInCell = Math.floor(i / this.unit) * this.width * 4
          let pixelsLeftInCell = (i % this.unit) * 4
          let startingPixel = pixelsBeforeCell + pixelsAboveInCell + pixelsLeftInCell
          acc += .299 * this.oldData.data[startingPixel]
          acc += .587 * this.oldData.data[startingPixel + 1]
          acc += .114 * this.oldData.data[startingPixel + 2]
        }
        let val = Math.floor(acc / this.area)
        this.drawCell(pixelsBeforeCell, val)
      }
    }
    this.ctx.putImageData(this.newData, 0, 0);
  }

  drawCell(pixelsBeforeCell, val){
    if (this.shadingIndex === 0) { this.basicShade(pixelsBeforeCell, val) }
    else if (this.shadingIndex === 1) { this.veritcalHash(pixelsBeforeCell, val)}
  }

  veritcalHash(pixelsBeforeCell, val){
    let shadeValue = Math.floor(val / (256 / (this.unit + 1)))

    for (let i = 0; i < this.unit; i++) {
      let pixelsAboveInCell = i * this.width * 4
      let startingPixel = pixelsBeforeCell + pixelsAboveInCell
      for (let j = 0; j < shadeValue; j++) {
      }
      for (let j = shadeValue; j < this.unit; j++) {
        this.newData.data[startingPixel + (j * 4) + 3] = 255
      }    
    }
  }

  basicShade(pixelsBeforeCell, val){
    for (let i = 0; i < this.area; i++) {
      let pixelsAboveInCell = Math.floor(i / this.unit) * this.width * 4
      let pixelsLeftInCell = (i % this.unit) * 4
      let startingPixel = pixelsBeforeCell + pixelsAboveInCell + pixelsLeftInCell
      // console.log(`startingPixel: ${startingPixel}, val: ${val}`)
      this.newData.data[startingPixel] = val
      this.newData.data[startingPixel + 1] = val
      this.newData.data[startingPixel + 2] = val
      this.newData.data[startingPixel + 3] = 255
    }
  }

}