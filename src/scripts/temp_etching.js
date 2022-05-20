export class Etching {
  
  constructor(bitMap){
    this.getVaraibles(bitMap);
    this.createCanvasesAndData(bitMap);
    if (this.shade) this.shade();
    if (this.line) this.line();
  }

  getVaraibles(bitMap){
    this.unit = parseInt(document.querySelector("input[name='unit']").value);
    this.area = this.unit * this.unit;

    this.lineConstant = (101 - parseInt(document.querySelector("input[name='lineSensitivity']").value)) / 4;

    this.animate = Boolean(document.querySelector("input[name='animate']:checked").value === "true");
    this.animationDelay = 10;

    this.shade = Boolean(document.querySelector("input[name='shadeBool']:checked").value === "true");
    this.line = Boolean(document.querySelector("input[name='lineBool']:checked").value === "true");

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
  }

   createCanvasesAndData(bitMap){
    this.originalCanvas = document.getElementById('originalCanvas');
    this.originalCtx = this.originalCanvas.getContext('2d');
    this.originalCtx.drawImage(bitMap, 0, 0, this.width, this.height);

    this.shadeCanvas = document.getElementById('shadeCanvas');
    this.shadeCanvas.width = this.width;
    this.shadeCanvas.height = this.height;
    this.shadeCtx = shadeCanvas.getContext('2d');

    this.lineCanvas = document.getElementById('lineCanvas');
    this.lineCanvas.width = this.width;
    this.lineCanvas.height = this.height;
    this.lineCtx = lineCanvas.getContext('2d');

    this.originalData = this.originalCtx.getImageData(0, 0, this.width, this.height);
    this.shadeData = this.shadeCtx.createImageData(this.originalData);
    this.lineData = this.lineCtx.createImageData(this.originalData);
  }

}