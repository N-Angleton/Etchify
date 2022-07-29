# Etchify

## Description

Etchify is a single page website that creates etchings from user uploaded photos. This is achieved through line recongition and shading that matches the percieved luminosity of the original image. Users are able to customize the produced etching through a variety of settings. The decision making process is streamlined so that users need only make essential choices, and can explore more advanced settings if they wish.

## Live

Upload an image [here](https://etchify.io)!

## Table of Contents

- [Description](#description)
- [Live link](#live)
- [Languages and Technologies](#languages-and-technologies)
- [Functionalities](#functionalities)
- [Future considerations](#future-considerations)

## Languages and Technologies

- Node.js
- Vanilla DOM manipulation
- HTML5
- SCSS
- Canvas API
- Webpack for bundling javascript
- Npm for managing dependencies

## On Features & Functions

For the etching, users are able to select from four styles: **Shade**, **Outline**, **Shade & Outline**, and **Silhouette**. Of additional note

**Shade** will analyze the original image as a grid of *n* by *n* cells, and will match the percieved luminance of each cell with an appropriate amount of shading. The size of *n* can is referred to as the **Dimension of the Cell** adjusted as an advanced setting. Adjusting the **Dimension of the Cell** actually has a twofold impact: it 

**Outline** employs line recongition to trace the original image. A candidate pixel is designated as a line if it differs enough from its neighbors. This calculation is performed with a five by five kernel centered on the candidate pixel. The neighboring pixels each "vote" on if the candidate pixel is a line. For each neighbor pixel, their vote depends on if their color difference exceeds the **Color Difference Threshold**, an advanced setting, and is weighted according to the inverse square of their distance from the candidate pixel. If the overall vote exceeds the **Minimum Percent of Neighbors** the candidate pixel is considered part of the outline.

**Shade & Outline** merely employs both the **Shading** and the **Outline** algorithms at once, with the outline resting atop the shading.

**Silhouette** is actually a particular application of the **Shading** algorithm, produced by setting the **Dimension of the Cell** to one. The result is that only 

## The Pixel Logic



## Future Considerations

