// import { Pixel } from "./pixel";
// import { Region } from "./region";

// export class Etching {
  
//   constructor(bitMap){
//     this.getVaraibles();
//     this.calculateDimensions(bitMap);
//     this.createCanvasesAndData(bitMap);
//     this.processImage()
//     if (this.line) this.drawLines();
//     // if (this.shade) this.shade();
//   }

//   getVaraibles(){
//     this.lineSensitivity = parseInt(document.querySelector("input[name='lineSensitivity']").value);

//     this.animate = Boolean(document.querySelector("input[name='animate']:checked").value === "true");

//     this.line = Boolean(document.querySelector("input[name='lineBoolean']:checked").value === "true");
//     this.shade = Boolean(document.querySelector("input[name='shadeBoolean']:checked").value === "true");
    
//     this.lineColor = document.querySelector("input[name='lineColor']").value;
//     this.lineColorStrings = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.lineColor);
//     this.lineRgb = { red: parseInt(this.lineColorStrings[1], 16), green: parseInt(this.lineColorStrings[2], 16), blue: parseInt(this.lineColorStrings[3], 16) };

//     this.shadeColor = document.querySelector("input[name='shadeColor']").value;
//     this.shadeColorStrings = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.shadeColor);
//     this.shadeRgb = { red: parseInt(this.shadeColorStrings[1], 16), green: parseInt(this.shadeColorStrings[2], 16), blue: parseInt(this.shadeColorStrings[3], 16) };
//   }

//   calculateDimensions(bitMap){
//     this.width = bitMap.width;    
//     this.height = bitMap.height;

//     const horizontalRatio = bitMap.width / 1080
//     const verticalRatio = bitMap.height / 1350
//     let ratio = Math.max(horizontalRatio, verticalRatio)

//     if (ratio > 1) {
//       ratio = Math.ceil(ratio * 100) / 100
//       this.width = Math.floor(this.width / ratio) 
//       this.heigth = Math.floor(this.heigth / ratio) 
//     }

//     this.numberOfPixels = this.width * this.height
//   }

//    createCanvasesAndData(bitMap){
//     this.originalCanvas = document.getElementById('originalCanvas');
//     this.originalCtx = this.originalCanvas.getContext('2d');
//     this.originalCanvas.width = this.width;
//     this.originalCanvas.height = this.height;
//     this.originalCtx.drawImage(bitMap, 0, 0, this.width, this.height);

//     this.lineCanvas = document.getElementById('lineCanvas');
//     this.lineCtx = lineCanvas.getContext('2d');
//     this.lineCanvas.width = this.width;
//     this.lineCanvas.height = this.height;

//     this.shadeCanvas = document.getElementById('shadeCanvas');
//     this.shadeCtx = shadeCanvas.getContext('2d');
//     this.shadeCanvas.width = this.width;
//     this.shadeCanvas.height = this.height;

//     this.originalData = this.originalCtx.getImageData(0, 0, this.width, this.height);
//     this.lineData = this.lineCtx.createImageData(this.originalData);
//     this.shadeData = this.shadeCtx.createImageData(this.originalData);
//   }

//   processImage(){
//     this.regions = {}
//     this.pixels = {}

//     this.processFirstPixel()
//     this.processRestOfFirstRow()
//     this.processOtherRows()
//   }

//   processFirstPixel(){
//     let firstPixelColors = this.retrievePixelColors(0)
//     let firstPixelDarkness = this.calculateDarkness(firstPixelColors)
//     this.regions[0] = new Region(0, firstPixelDarkness, 0, 0)
//     this.pixels[0] = new Pixel(0, firstPixelColors, false)
//   }

//   processRestOfFirstRow(){
//     for (let index = 1; index < this.width; index++) {
//       let previousPixel = this.pixels[index - 1]
//       let currentPixelColors = this.retrievePixelColors(index)
//       let currentPixelDarkness = this.calculateDarkness(currentPixelColors)
//       let difference = this.calculateColorDifference(currentPixelColors, previousPixel.colors)

//       if (difference < this.lineSensitivity) {
//         console.log('in shared')
//         let sharedRegionId = previousPixel.region
//         this.regions[sharedRegionId].addPixel(index, currentPixelDarkness, 0, index)
//         this.pixels[index] = new Pixel(sharedRegionId, currentPixelColors, false)
//       } else {
//         console.log('in separate')
//         previousPixel.line = true
//         this.regions[index] = new Region(index, currentPixelDarkness, 0, index)
//         this.pixels[index] = new Pixel(index, currentPixelColors, true)
//       }
//     }
//   }

//   processOtherRows(){
//     for (let row = 1; row < this.height; row++) {
//       for (let column = 0; column < this.width; column++) {

//         let index = this.pixelIndex(row, column)
//         let currentColors = this.retrievePixelColors(index)
//         let currentDarkness = this.calculateDarkness(currentColors)
//         let neighboringPixels = this.getNeighboringPixels(row, column)

//         let minDifference = this.lineSensitivity
//         let tempPixels = []
//         let regionId = null
//         let line = false

//         neighboringPixels.forEach( pixel => {
//           let pixelIndex = pixel[2]
//           let pixelData = this.pixels[pixelIndex]
//           let candidateRegion = pixelData.region
//           let colorDifference = this.calculateColorDifference(currentColors, pixelData.colors)

//           if (candidateRegion === regionId) {
//             minDifference = Math.min(colorDifference, minDifference)
//             tempPixels.push(pixelIndex)
//           } else {
//             if (colorDifference < minDifference) {

//               regionId = candidateRegion
//               minDifference = colorDifference
//               if (tempPixels.length) {
//                 line = true
//                 tempPixels.forEach( linePixel => this.pixels[linePixel].line = true)
//               }
//               tempPixels = [pixelIndex]

//             } else {
//               this.pixels[pixelIndex].line = true
//               line = true
//             }
//           }
//         })

//         if (!regionId) {
//           this.regions[index] = new Region(index, currentDarkness, row, column)
//           regionId = index
//         } else {
//           this.regions[regionId].addPixel(index, currentDarkness, row, column)
//         }

//         this.pixels[index] = new Pixel(regionId, currentColors, line)
//       }
//     }
//   }

//   drawLines(){
//     for (let i = 0; i < 4 * this.numberOfPixels; i += 4) {
//       if (!(this.pixels[i / 4].line)) {
//         this.lineData.data[i] = 255
//         this.lineData.data[i + 1] = 255
//         this.lineData.data[i + 2] = 255
//       }
//       this.lineData.data[i + 3] = 255
//     }

//     this.lineCtx.putImageData(this.lineData, 0, 0)
//   }

//   pixelIndex(row, column){
//     return ((row * this.width) + column)
//   }

//   retrievePixelColors(index){
//     const colors = []
//     const precedingRGBvalues = 4 * index
//     colors.push(this.originalData.data[precedingRGBvalues])
//     colors.push(this.originalData.data[precedingRGBvalues + 1])
//     colors.push(this.originalData.data[precedingRGBvalues + 2])
//     return colors
//   }

//   calculateColorDifference(rgb1, rgb2){
//     let difference = 0

//     difference += Math.abs(rgb1[0] - rgb2[0])
//     difference += Math.abs(rgb1[1] - rgb2[1])
//     difference += Math.abs(rgb1[2] - rgb2[2])

//     return difference
//   }

//   calculateDarkness(arrayRGB){
//     let opacity = 0.0
//     opacity += 0.299 * arrayRGB[0]
//     opacity += 0.587 * arrayRGB[1]
//     opacity += 0.114 * arrayRGB[2]
//     return opacity
//   }

//   getNeighboringPixels(row, column){
//     const neighbors = []

//     if (column > 0) {
//       neighbors.push([row, column - 1, this.pixelIndex(row, column - 1)])
//       neighbors.push([row - 1, column - 1, this.pixelIndex(row - 1, column - 1)])
//     }

//     neighbors.push([row - 1, column, this.pixelIndex(row - 1, column)])

//     if (column < this.width - 1) neighbors.push([row - 1, column + 1, this.pixelIndex(row - 1, column + 1)])
    
//     return neighbors
//   }

// }


// let currentRegionId = null
//         let neighborPixelsInRegion = []
//         let currentColorDifference = this.lineSensitivity
//         let line = false

//         neighboringPixels.forEach( neighborData => {
//           let neighborIndex = neighborData[2]
//           let neighbor = this.pixels[neighborIndex]
//           let neighborRegionId = neighbor.region
//           let neighborColors = neighbor.colors
//           let neighborColorDifference = this.calculateColorDifference(currentColors, neighborColors)

//           if (neighborRegionId === currentRegionId) {
//             neighborPixelsInRegion.push(neighborIndex)
//             currentColorDifference = Math.min(currentColorDifference, neighborColorDifference)
//           } else {
//             if (neighborColorDifference < currentColorDifference) {
//               currentRegionId = neighborRegionId
//               currentColorDifference = neighborColorDifference

//               if (neighborPixelsInRegion.length > 0) {
//                 // line = true
//                 neighborPixelsInRegion.forEach( pixelToBeRemoved => {
                  
//                   this.pixels[pixelToBeRemoved].line = true
//                 })
//               }
//               neighborPixelsInRegion = [neighborIndex]
//             } else {
//               line = true
//               this.pixels[neighborIndex].line = true
//             }
//           }

// for (let row = 0; row < this.height; row++) {
//     for (let column = 0; column < this.width; column++) {
//       let currentIndex = this.pixelIndex(row, column)
//       let currentRGB = this.retrievePixelRGB(currentIndex)
//       let currentDarkness = this.calculateDarkness(currentRGB)

//       let neighboringPixels = this.retrieveNeighboringPixels(row, column)
//       let line = false

//       // console.log(`Outside column: ${column}`)

//       let regionId = neighboringPixels.reduce( (smallestDifference, neighborIndex) => {
//         let neighbor = this.pixels[neighborIndex]
//         // debugger
//         // console.log(`Inside column: ${column}`)
//         let neighborRGB = neighbor.colors
//         let colorDifference = this.calculateColorDifference(currentRGB, neighborRGB)
//         if (colorDifference < smallestDifference[0]) return [colorDifference, neighbor.region]
//         return smallestDifference
//       }, [this.lineSensitivity, null])[1]

//       let otherRegionPixels = neighboringPixels.filter( neighborIndex => this.pixels[neighborIndex].region !== regionId)

//       if (otherRegionPixels.length) {
//         line = true
//         otherRegionPixels.forEach( linePixelIndex => this.pixels[linePixelIndex].line = true)
//       }

//       if (regionId) {
//         this.regions[regionId].addPixel(currentIndex, currentDarkness, row, column)
//       } else {
//         regionId = currentIndex
//         this.regions[regionId] = new Region(currentIndex, currentDarkness, row, column)
//       }
//       this.pixels[currentIndex] = new Pixel(regionId, currentRGB, line)
//     }
//   }



















// import { Pixel } from "./pixel";
// import { Region } from "./region";

// export class Etching {
  
//   constructor(bitMap){
//     this.getVaraibles();
//     this.calculateDimensions(bitMap);
//     this.createCanvasesAndData(bitMap);
//     this.processImage()
//     if (this.line) this.drawLines();
//     // if (this.shade) this.shade();
//   }

//   getVaraibles(){
//     this.lineSensitivity = parseInt(document.querySelector("input[name='lineSensitivity']").value);

//     this.animate = Boolean(document.querySelector("input[name='animate']:checked").value === "true");

//     this.line = Boolean(document.querySelector("input[name='lineBoolean']:checked").value === "true");
//     this.shade = Boolean(document.querySelector("input[name='shadeBoolean']:checked").value === "true");
    
//     this.lineColor = document.querySelector("input[name='lineColor']").value;
//     this.lineColorStrings = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.lineColor);
//     this.lineRgb = { red: parseInt(this.lineColorStrings[1], 16), green: parseInt(this.lineColorStrings[2], 16), blue: parseInt(this.lineColorStrings[3], 16) };

//     this.shadeColor = document.querySelector("input[name='shadeColor']").value;
//     this.shadeColorStrings = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.shadeColor);
//     this.shadeRgb = { red: parseInt(this.shadeColorStrings[1], 16), green: parseInt(this.shadeColorStrings[2], 16), blue: parseInt(this.shadeColorStrings[3], 16) };
//   }

//   calculateDimensions(bitMap){
//     this.width = bitMap.width;    
//     this.height = bitMap.height;

//     const horizontalRatio = bitMap.width / 1080
//     const verticalRatio = bitMap.height / 1350
//     // const horizontalRatio = bitMap.width / 800
//     // const verticalRatio = bitMap.height / 800
//     let ratio = Math.max(horizontalRatio, verticalRatio)

//     if (ratio > 1) {
//       ratio = Math.ceil(ratio * 100) / 100
//       this.width = Math.floor(this.width / ratio) 
//       this.heigth = Math.floor(this.heigth / ratio) 
//     }

//     this.numberOfPixels = this.width * this.height
//   }

//    createCanvasesAndData(bitMap){
//     this.originalCanvas = document.getElementById('originalCanvas');
//     this.originalCtx = this.originalCanvas.getContext('2d');
//     this.originalCanvas.width = this.width;
//     this.originalCanvas.height = this.height;
//     this.originalCtx.drawImage(bitMap, 0, 0, this.width, this.height);

//     this.lineCanvas = document.getElementById('lineCanvas');
//     this.lineCtx = lineCanvas.getContext('2d');
//     this.lineCanvas.width = this.width;
//     this.lineCanvas.height = this.height;

//     this.shadeCanvas = document.getElementById('shadeCanvas');
//     this.shadeCtx = shadeCanvas.getContext('2d');
//     this.shadeCanvas.width = this.width;
//     this.shadeCanvas.height = this.height;

//     this.originalData = this.originalCtx.getImageData(0, 0, this.width, this.height);
//     this.lineData = this.lineCtx.createImageData(this.originalData);
//     this.shadeData = this.shadeCtx.createImageData(this.originalData);
//   }

//   processImage(){
//     this.regions = {}
//     this.allPixels = {}
//     let self = this

//     for (let row = 0; row < this.height; row++) {
//       for (let column = 0; column < this.width; column++) {
//         let currentIndex = this.pixelIndex(row, column)
//         let currentRGB = this.retrievePixelRGB(currentIndex)
//         let currentDarkness = this.calculateDarkness(currentRGB)

//         let neighboringPixels = this.retrieveNeighboringPixels(row, column)
//         let line = false

//         let regionId = null
//         let matchingRegions = []
//         let neighboringLines = []

//         neighboringPixels.forEach( neighborIndex => {
//           let neighbor = this.allPixels[neighborIndex]
//           let neighborRGB = neighbor.colors
//           let colorDifference = this.calculateColorDifference(currentRGB, neighborRGB);
//           (colorDifference < this.lineSensitivity) ? matchingRegions.push(neighbor.region) : neighboringLines.push(neighborIndex)
//         })

//         if (neighboringLines.length) {
//           line = true
//           neighboringLines.forEach( linePixelIndex => this.allPixels[linePixelIndex].line = true)
//         }

//         if (matchingRegions.length) {
//           regionId = (matchingRegions.length === 1) ? matchingRegions[0] : this.mergeRegions(matchingRegions)
//         }

//         if (regionId) {
//           self.regions[regionId].addPixel(currentIndex, currentDarkness, row, column)
//         } else {
//           regionId = currentIndex
//           self.regions[regionId] = new Region(currentIndex, currentDarkness, row, column)
//         }
//         self.allPixels[currentIndex] = new Pixel(regionId, currentRGB, line)
//       }
//     }
//   }

//   mergeRegions(matchingRegions){
//     let largestRegionId = matchingRegions.reduce( (currentLargestRegionId, candidateId) => {
//       let currentLength = this.regions[currentLargestRegionId].pixels.length
//       let candidateLength = this.regions[candidateId].pixels.length
//       return (candidateLength > currentLength) ? candidateId : currentLargestRegionId
//     })
//     let largestRegion = this.regions[largestRegionId]
//     let otherRegions = matchingRegions.filter( regionId => regionId !== largestRegionId)
//     let uniqueOtherRegions = []
//     otherRegions.forEach( regionId => {
//       if (!(uniqueOtherRegions.includes(regionId))) uniqueOtherRegions.push(regionId)
//     })
//     uniqueOtherRegions.forEach( regionId => {
//       let region = this.regions[regionId]
//       let regionPixels = region.pixels
//       let largestRegionPixels = largestRegion.pixels
//       largestRegion.pixels = largestRegionPixels.concat(regionPixels)
//       largestRegion.cumulativeOpacity += region.cumulativeOpacity

//       if (region.minX < largestRegion.minX) largestRegion.minX = region.minX
//       if (region.maxX > largestRegion.maxX) largestRegion.maxX = region.maxX
//       if (region.minY < largestRegion.minY) largestRegion.minY = region.minY
//       if (region.maxY > largestRegion.maxY) largestRegion.maxY = region.maxY

//       region.pixels.forEach( pixelId => this.allPixels[pixelId].region = largestRegionId)
//       delete this.regions[regionId]
//     })
//     return largestRegionId
//   }

//   drawLines(){
//     let linePixels = []
//     for (let i = 0; i < 4 * this.numberOfPixels; i += 4) {
//       if (!(this.allPixels[i / 4].line)) {
//         this.lineData.data[i] = 255
//         this.lineData.data[i + 1] = 255
//         this.lineData.data[i + 2] = 255
//       } else { linePixels.push(i) }
//       this.lineData.data[i + 3] = 255
//     }
//     this.lineCtx.putImageData(this.lineData, 0, 0)
//   }

//   pixelIndex(row, column){
//     return ((row * this.width) + column)
//   }

//   retrievePixelRGB(index){
//     const rgb = []
//     const precedingRGBvalues = 4 * index
//     rgb.push(this.originalData.data[precedingRGBvalues])
//     rgb.push(this.originalData.data[precedingRGBvalues + 1])
//     rgb.push(this.originalData.data[precedingRGBvalues + 2])
//     return rgb
//   }

//   calculateColorDifference(rgb1, rgb2){
//     let difference = 0

//     difference += Math.abs(rgb1[0] - rgb2[0])
//     difference += Math.abs(rgb1[1] - rgb2[1])
//     difference += Math.abs(rgb1[2] - rgb2[2])

//     return difference
//   }

//   calculateDarkness(arrayRGB){
//     let opacity = 0.0
//     opacity += 0.299 * arrayRGB[0]
//     opacity += 0.587 * arrayRGB[1]
//     opacity += 0.114 * arrayRGB[2]
//     return opacity
//   }

//   retrieveNeighboringPixels(row, column){
//     const neighbors = []

//     if (column > 0) neighbors.push(this.pixelIndex(row, column - 1))

//     if (row > 0) {
//       if (column > 0) neighbors.push(this.pixelIndex(row - 1, column - 1))
//       neighbors.push(this.pixelIndex(row - 1, column))
//       if (column < (this.width - 1)) neighbors.push(this.pixelIndex(row - 1, column + 1))
//     }
    
//     return neighbors
//   }

// }