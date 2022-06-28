export class Pixel {

    constructor(colors, darkness){
        this.colors = colors
        this.darkness = darkness
        this.neighbors = []
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
        return Boolean((weightedNumberOfLine / hypotheticalMax) > percentOfPixels)
    }

    static addColorDifference(pixel1, pixel2, colorDifference, weight) {
        pixel1.neighbors.push([colorDifference, weight])
        pixel2.neighbors.push([colorDifference, weight])
    }

}