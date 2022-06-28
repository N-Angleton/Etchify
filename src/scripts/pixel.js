export class Pixel {

    constructor(colors, darkness){
        this.colors = colors
        this.darkness = darkness
        this.neighbors = []
        this.lineBool = false
    }

    line(colorDiffThreshold, percentOfPixels){
        let weightedNumberOfLine = 0.0
        let hypotheticalMax = 0.0
        this.neighbors.forEach( (neighborValues) => {
            let colorDifference = neighborValues[0]
            let weight = neighborValues[1]
            hypotheticalMax += weight
            if (colorDifference >= colorDiffThreshold) weightedNumberOfLine += weight
        })
        this.line = Boolean((weightedNumberOfLine / hypotheticalMax) > percentOfPixels)
        return this.lineBool
    }

    static addColorDifference(pixel1, pixel2, colorDifference, weight) {
        pixel1.neighbors.push([colorDifference, weight])
        pixel2.neighbors.push([colorDifference, weight])
    }

}