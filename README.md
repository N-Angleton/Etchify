# Etchify

## Description

Etchify is a single page website that creates etchings from user uploaded photos. This is achieved through line recongition and shading that matches the percieved luminosity of the original image. Users are able to customize the produced etching through a variety of settings. The user experience is streamlined so that users need only make essential choices, and can explore more advanced settings if they wish.

## Live

Create an etching [here](https://etchify.io)!

## Table of Contents

- [Description](#description)
- [Live link](#live)
- [Languages & Technologies](#languages--technologies)
- [On Features & Functions](#on-features--functions)
- [On Pixel Logic & Code](#on-pixel-logic--code)
- [Future considerations](#future-considerations)
- [Footnotes](#footnotes)

## Languages & Technologies

- Node.js
- Vanilla DOM manipulation
- HTML5
- SCSS
- Canvas API
- Webpack for bundling javascript
- Npm for managing dependencies

## On Features & Functions

For the etching, users are directed to upload an image, select a color, and select one of four styles: **Shade**, **Outline**, **Shade & Outline**, and **Silhouette**. Of additional note, among the advanced settings, users can decide the shading and outline colors separately and can opt for **Refine Outline**.

As an example image to be processed, we will use *The Great Wave off Kanagawa* by Hokusai.[^1] The woodblock print's contrast in brightness and solid colors are well-suited for the software, though great results can be achieved with a wide variety of images.

<p align="center">
  <img width="450px" src="./src/assets/images/The_Great_Wave_off_Kanagawa.jpeg" alt="The Great Wave off Kanagawa by Hokusai">
</p>

- **Shade** will analyze the original image as a grid of *n* by *n* cells, and will match the percieved luminance of each cell with an appropriate amount of shading. The percieved lumninance of each pixel in the cell is calculated from its *RGB* values using an industry standard formula:<p align="center">Luminance = .299(R) + .587(G) + .114(B)[^2]</p>The size of *n* is referred to as the **Dimension of the Cell** and can be adjusted as an advanced setting. Increasing the **Dimension of the Cell** has a twofold impact: it simultaneously increases the pixellation of the resulting image, while also increasing the number of tones.

<p align="center">
  <img width="450px" src="./src/assets/images/shade.png" alt="Shading of The Great Wave off Kanagawa">
</p>

- **Outline** employs line recongition to trace the original image. A candidate pixel is designated as a line if it differs enough from its neighbors. This calculation is performed with a five by five kernel centered on the candidate pixel. The neighboring pixels each "vote" on if the candidate pixel is a line. With each neighboring pixel, their vote depends on if their color difference exceeds the **Color Difference Threshold**, an advanced setting, and is weighted according to the inverse square of their distance from the candidate pixel. If the overall vote exceeds the **Minimum Percent of Neighbors**, an additional advanced setting, the candidate pixel is considered part of the outline.

<p align="center">
  <img width="450px" src="./src/assets/images/outline.png" alt="Outline of The Great Wave off Kanagawa">
</p>

- **Refine Outline** is an advanced option that allows the user to reduce the "noise" produced by the **Outline** algorithm. It achieves this by removing any line pixels that are not part of a sufficiently large contiguous line complex. This threshold can be adjusted as the **Minimum Contiguous Line Size**. Currently this features employs a 2d array of line pixels, which while functional, has poor time and space complexity, and is in need of refactoring with a linked list.

<p align="center">
  <img width="450px" src="./src/assets/images/outline-refined.png" alt="Refined Outline of The Great Wave off Kanagawa">
</p>

- **Shade & Outline** merely employs both the **Shading** and the **Outline** algorithms at once, with the outline resting atop the shading.

<p align="center">
  <img width="450px" src="./src/assets/images/shade-outline.png" alt="Combined shading and outline of The Great Wave off Kanagawa">
</p>

- **Silhouette** is actually a particular application of the **Shading** algorithm, produced by setting the **Dimension of the Cell** to one. The result is that each pixel is considered its own cell, which means that there is essentially no pixellation, but each pixel can only be one of two tones: the background color or the shading color.

<p align="center">
  <img width="450px" src="./src/assets/images/silhouette.png" alt="Silhouette of The Great Wave off Kanagawa">
</p>

## On Pixel Logic & Code



## Future Considerations

## Footnotes

[^1]: The source for this image can be found [here](https://en.wikipedia.org/wiki/File:Tsunami_by_hokusai_19th_century.jpg).
[^2]: This formula is typically used to calculate the *Y* component in *RGB* to *YIQ* conversion. Documentation can be found [here](https://www.eembc.org/techlit/datasheets/yiq_consumer.pdf).
