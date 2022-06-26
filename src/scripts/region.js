export class Region {
  
    constructor(firstPixelIndex, opacity, row, column){
        this.id = firstPixelIndex

        this.pixels = [firstPixelIndex]
        this.cumulativeOpacity = opacity

        this.minX = column
        this.maxX = column

        this.minY = row
        this.maxY = row
    }

    addPixel(pixelIndex, opacity, row, column){
        this.pixels.push(pixelIndex);
        this.cumulativeOpacity += opacity

        if (column < this.minX) this.minX = column
        if (column > this.maxX) this.maxX = column

        if (row < this.minY) this.minY = row
        if (row > this.maxY) this.maxY = row
    }

    averageDarkness(){
        return (this.cumulativeOpacity / this.pixels.length)
    }

}