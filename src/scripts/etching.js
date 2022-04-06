export class Etching {
  constructor(bitMap){
    this.unit = parseInt(document.querySelector("input[name='unit']:checked").value);
    this.area = this.unit * this.unit;

    // this.animate = true
    this.animate = Boolean(document.querySelector("input[name='animate']:checked").value === "true");
    this.animationDelay = 10;

    this.color = document.querySelector("input[name='color']").value
    console.log(this.color)
    this.colorStrings = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.color)
    this.rgb = { red: parseInt(this.colorStrings[1], 16), green: parseInt(this.colorStrings[2], 16), blue: parseInt(this.colorStrings[3], 16) }

    this.distinctShades = parseInt(document.querySelector("input[name='shades']:checked").value)
    this.shadingIndex = parseInt(document.querySelector("input[name='shading']:checked").value)

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

  async etchify(){
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
        // if (this.animate) { setTimeout(this.drawCell.bind(this, pixelsBeforeCell, val), this.animationDelay); }
        // else this.drawCell(pixelsBeforeCell, val);
        this.drawCell(pixelsBeforeCell, val)
      }
      if (this.animate) {
        await this.timeout(this.animationDelay)
        this.ctx.putImageData(this.newData, 0, 0)
      }
    }
    if (!this.animate) this.ctx.putImageData(this.newData, 0, 0);
  }

  timeout(ms){
    return new Promise( resolve => setTimeout(resolve, ms));
  }

  drawCell(pixelsBeforeCell, val){
    if (this.shadingIndex === 0) { this.basicShade(pixelsBeforeCell, val) }
    else if (this.shadingIndex === 1) { this.veritcalHash(pixelsBeforeCell, val)}
  }

  // veritcalHash(pixelsBeforeCell, val) {
  //   let numberOfShadings = this.distinctShades * this.unit
  //   let interval = (256 / (this.unit * this.distinctShades)) / 2
  //   let shadeValue = numberOfShadings - Math.floor(val / interval)

  //   for (let i = 0; i < this.unit; i++) {
  //     let pixelsAboveInCell = i * this.width * 4
  //     let startingPixel = pixelsBeforeCell + pixelsAboveInCell

  //     for (let j = 0; j < shadeValue; j++) {
  //       this.newData.data[startingPixel + ((j % this.unit) * 4)] = this.rgb.red
  //       this.newData.data[startingPixel + ((j % this.unit) * 4) + 1] = this.rgb.green
  //       this.newData.data[startingPixel + ((j % this.unit) * 4) + 2] = this.rgb.blue
  //       this.newData.data[startingPixel + ((j % this.unit) * 4) + 3] += (256 / this.distinctShades)
  //     }
  //   }
  // }
  veritcalHash(pixelsBeforeCell, val) {
    let numberOfShadings = this.distinctShades * this.unit
    let interval = (256 / (this.unit * this.distinctShades)) / 2
    let shadeValue = numberOfShadings - Math.floor(val / interval)

    let redIncrement = this.rgb.red / this.distinctShades
    let greenIncrement = this.rgb.green /  this.distinctShades
    let blueIncrement = this.rgb.blue / this.distinctShades

    for (let i = 0; i < this.unit; i++) {
      let pixelsAboveInCell = i * this.width * 4
      let startingPixel = pixelsBeforeCell + pixelsAboveInCell

      for (let j = 0; j < shadeValue; j++) {
        this.newData.data[startingPixel + ((j % this.unit) * 4)] = this.rgb.red
        this.newData.data[startingPixel + ((j % this.unit) * 4) + 1] = this.rgb.green
        this.newData.data[startingPixel + ((j % this.unit) * 4) + 2] = this.rgb.blue
        this.newData.data[startingPixel + ((j % this.unit) * 4) + 3] += (256 / this.distinctShades)
      }
    }
  }

  // basicShade(pixelsBeforeCell, val){
  //   for (let i = 0; i < this.area; i++) {
  //     let pixelsAboveInCell = Math.floor(i / this.unit) * this.width * 4
  //     let pixelsLeftInCell = (i % this.unit) * 4
  //     let startingPixel = pixelsBeforeCell + pixelsAboveInCell + pixelsLeftInCell
  //     this.newData.data[startingPixel] = val
  //     this.newData.data[startingPixel + 1] = val
  //     this.newData.data[startingPixel + 2] = val
  //     this.newData.data[startingPixel + 3] = 255
  //   }
  // }
  basicShade(pixelsBeforeCell, val) {
    let ratio = val / 255
    for (let i = 0; i < this.area; i++) {
      let pixelsAboveInCell = Math.floor(i / this.unit) * this.width * 4
      let pixelsLeftInCell = (i % this.unit) * 4
      let startingPixel = pixelsBeforeCell + pixelsAboveInCell + pixelsLeftInCell
      this.newData.data[startingPixel] = ratio * this.rgb.red
      this.newData.data[startingPixel + 1] = ratio * this.rgb.green
      this.newData.data[startingPixel + 2] = ratio * this.rgb.blue
      this.newData.data[startingPixel + 3] = 255
    }
  }

}