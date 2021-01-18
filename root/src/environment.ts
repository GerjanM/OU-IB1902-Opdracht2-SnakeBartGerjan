const R  = 10,          // straal van een element
XMIN     = R,           // minimale x waarde
YMIN     = R,           // minimale y waarde
STEP     = 2*R,         // stapgrootte
DIRECTIONS = {
    LEFT     : "left",      // bewegingsrichtingen
    RIGHT    : "right",
    UP       : "up",
    DOWN     : "down",  
};

var width,                    // breedte van het tekenveld
height,                   // hoogte van het tekenveld
xMax,                     // maximale waarde van x = width - R
yMax;                     // maximale waarde van y = height - R

function setWidth(w: number){
    width=w;
  }
  
function setHeight(h: number) {
    height=h;
}

function setXMax(x: number) {
    xMax = x;
}

function setYMax(y: number){
    yMax = y;
}

export {setWidth, setHeight, setXMax, setYMax, R, STEP, XMIN, YMIN, DIRECTIONS, width, height, xMax, yMax}