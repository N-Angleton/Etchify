import { Pixel } from "./pixel";

export class Etching {
  
  constructor(bitMap){
    this.getVaraibles();
    this.calculateDimensions(bitMap);
    this.createCanvasesAndData(bitMap);
    if (this.unprocessed) this.processImage()
    if (this.line) {
      this.drawLines();
      this.refineLinePixels()
    }
    // if (this.shade) this.shade();
  }

  getVaraibles(){
    this.unprocessed = true

    this.lineSensitivity = parseInt(document.querySelector("input[name='lineSensitivity']").value);
    this.neighborRequirement = parseInt(document.querySelector("input[name='neighborRequirement']").value) / 100.0;

    this.animate = Boolean(document.querySelector("input[name='animate']:checked").value === "true");

    this.line = Boolean(document.querySelector("input[name='lineBoolean']:checked").value === "true");
    this.shade = Boolean(document.querySelector("input[name='shadeBoolean']:checked").value === "true");
    
    this.lineColor = document.querySelector("input[name='lineColor']").value;
    this.lineColorStrings = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.lineColor);
    this.lineRgb = { red: parseInt(this.lineColorStrings[1], 16), green: parseInt(this.lineColorStrings[2], 16), blue: parseInt(this.lineColorStrings[3], 16) };

    this.shadeColor = document.querySelector("input[name='shadeColor']").value;
    this.shadeColorStrings = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.shadeColor);
    this.shadeRgb = { red: parseInt(this.shadeColorStrings[1], 16), green: parseInt(this.shadeColorStrings[2], 16), blue: parseInt(this.shadeColorStrings[3], 16) };
  }

  calculateDimensions(bitMap){
    this.width = bitMap.width;    
    this.height = bitMap.height;

    const horizontalRatio = bitMap.width / 1080
    const verticalRatio = bitMap.height / 1350

    let ratio = Math.max(horizontalRatio, verticalRatio)

    if (ratio > 1) {
      ratio = Math.ceil(ratio * 100) / 100
      this.width = Math.floor(this.width / ratio) 
      this.heigth = Math.floor(this.heigth / ratio) 
    }

    this.numberOfPixels = this.width * this.height
  }

   createCanvasesAndData(bitMap){
    this.originalCanvas = document.getElementById('originalCanvas');
    this.originalCtx = this.originalCanvas.getContext('2d');
    this.originalCanvas.width = this.width;
    this.originalCanvas.height = this.height;
    this.originalCtx.drawImage(bitMap, 0, 0, this.width, this.height);

    this.lineCanvas = document.getElementById('lineCanvas');
    this.lineCtx = lineCanvas.getContext('2d');
    this.lineCanvas.width = this.width;
    this.lineCanvas.height = this.height;

    this.shadeCanvas = document.getElementById('shadeCanvas');
    this.shadeCtx = shadeCanvas.getContext('2d');
    this.shadeCanvas.width = this.width;
    this.shadeCanvas.height = this.height;

    this.originalData = this.originalCtx.getImageData(0, 0, this.width, this.height);
    this.lineData = this.lineCtx.createImageData(this.originalData);
    this.shadeData = this.shadeCtx.createImageData(this.originalData);
  }

  processImage(){
    this.unprocessed = false
    this.pixels = {}

    for (let row = 0; row < this.height; row++) {
      for (let column = 0; column < this.width; column++) {
        let currentIndex = this.pixelIndex(row, column)
        let currentRGB = this.retrievePixelRGB(currentIndex)
        let currentDarkness = this.calculateDarkness(currentRGB)

        this.pixels[currentIndex] = new Pixel(currentRGB, currentDarkness)

        let currentPixel = this.pixels[currentIndex]

        let precedingNeighbors = this.precedingNeighbors(row, column)

        precedingNeighbors.forEach( (neighborValues) => {
          let neighborIndex = neighborValues[0]
          let weight = neighborValues[1]
          let neighbor = this.pixels[neighborIndex]
          let neighborRGB = neighbor.colors
          let colorDifference = this.calculateColorDifference(currentRGB, neighborRGB);
          Pixel.addColorDifference(currentPixel, neighbor, colorDifference, weight)
        })
      }
    }
  }

  drawLines(){
    console.log('start of draw lines')
    this.unrefinedLinePixels = []
    for (let i = 0; i < this.numberOfPixels * 4; i += 4) {
      if (!(this.pixels[i / 4].line(this.lineSensitivity, this.neighborRequirement))) {
        this.lineData.data[i] = 255
        this.lineData.data[i + 1] = 255
        this.lineData.data[i + 2] = 255
      } else {this.unrefinedLinePixels.push(i / 4)}
      this.lineData.data[i + 3] = 255
    }
    this.lineCtx.putImageData(this.lineData, 0, 0)
    console.log('here')
  }

  refineLinePixels(){
    console.log('in refine')
    this.lineComplexes = []
    this.unrefinedLinePixels.forEach( lineIndex => {
      if (!(this.pixels[lineIndex].checked)) {
        let unconsideredPixels = [lineIndex]
        let newComplex = []
        while (unconsideredPixels.length) {
          let nextPixel = unconsideredPixels.pop()
          newComplex.push(nextPixel)
          this.pixels[nextPixel].checked = true
          let neighbors = this.neighboringLines(nextPixel)
          neighbors.forEach( neighboringLineIndex => {
            if (!(newComplex.includes(neighboringLineIndex) || unconsideredPixels.includes(neighboringLineIndex))) {
              unconsideredPixels.push(neighboringLineIndex)
            }
          })
        }
        this.lineComplexes.push(newComplex)
      }
    })
    let tooSmallComplexes = this.lineComplexes.filter( lineComplex => lineComplex.length < 10)
    tooSmallComplexes.forEach( complex => {
      complex.forEach( pixel => {
        let index = pixel * 4
        this.lineData.data[index] = 255
        this.lineData.data[index + 1] = 255
        this.lineData.data[index + 2] = 255
      })
    })
    this.lineCtx.putImageData(this.lineData, 0, 0)
    console.log('finished refining')
  }

  pixelIndex(row, column){
    return ((row * this.width) + column)
  }

  rowColumnIndex(index){
    return [Math.floor(index / this.width), index % this.width]
  }

  retrievePixelRGB(index){
    const rgb = []
    const precedingRGBvalues = 4 * index
    rgb.push(this.originalData.data[precedingRGBvalues])
    rgb.push(this.originalData.data[precedingRGBvalues + 1])
    rgb.push(this.originalData.data[precedingRGBvalues + 2])
    return rgb
  }

  calculateColorDifference(rgb1, rgb2){
    let difference = 0

    difference += Math.abs(rgb1[0] - rgb2[0])
    difference += Math.abs(rgb1[1] - rgb2[1])
    difference += Math.abs(rgb1[2] - rgb2[2])

    return difference
  }

  calculateDarkness(arrayRGB){
    let opacity = 0.0
    opacity += 0.299 * arrayRGB[0]
    opacity += 0.587 * arrayRGB[1]
    opacity += 0.114 * arrayRGB[2]
    return opacity
  }

  precedingNeighbors(row, column){
    const neighbors = []

    if (column > 0) {
      neighbors.push([this.pixelIndex(row, column - 1), 1.0])
      if (column > 1) neighbors.push([this.pixelIndex(row, column - 2), 0.25])
    }

    if (row > 1) {
      if (column > 0) {
        neighbors.push([this.pixelIndex(row - 1, column - 1), 0.5])
        if (column > 1) neighbors.push([this.pixelIndex(row - 1, column - 2), 0.2])
      }
      neighbors.push([this.pixelIndex(row - 1, column), 1.0])
      if (column < (this.width - 1)) {
        neighbors.push([this.pixelIndex(row - 1, column + 1), 0.5])
        if (column < (this.width - 2)) neighbors.push([this.pixelIndex(row - 1, column + 2), 0.2])
      }

      if (row > 2) {
        if (column > 0) {
          neighbors.push([this.pixelIndex(row - 2, column - 1), 0.2])
          if (column > 1) neighbors.push([this.pixelIndex(row - 2, column - 2), 0.125])
        }
        neighbors.push([this.pixelIndex(row - 2, column), 0.25])
        if (column < (this.width - 1)) {
          neighbors.push([this.pixelIndex(row - 2, column + 1), 0.2])
          if (column < (this.width - 2)) neighbors.push([this.pixelIndex(row - 2, column + 2), 0.125])
        }
      }
    }
    
    return neighbors
  }

  neighboringLines(index){
    let neighboringLines = []
    const [row, column] = this.rowColumnIndex(index)
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if ((i !== 0 || j !== 0) && this.rowColumnIsValid(row + i, column + j)) {
          let index = this.pixelIndex(row + i, column + j)
          if (this.pixels[index].lineBool) {
            neighboringLines.push(index)
          }
        }
      }
    }
    return neighboringLines
  }

  rowColumnIsValid(row, column){
    if (row < 0) return false
    if (row > this.height - 1) return false
    if (column < 0) return false
    if (column > this.width - 1) return false
    return true
  }

}