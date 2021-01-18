"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yMax = exports.xMax = exports.height = exports.width = exports.DIRECTIONS = exports.YMIN = exports.XMIN = exports.STEP = exports.R = exports.setYMax = exports.setXMax = exports.setHeight = exports.setWidth = void 0;
const R = 10, // straal van een element
XMIN = R, // minimale x waarde
YMIN = R, // minimale y waarde
STEP = 2 * R, // stapgrootte
DIRECTIONS = {
    LEFT: "left",
    RIGHT: "right",
    UP: "up",
    DOWN: "down",
};
exports.R = R;
exports.XMIN = XMIN;
exports.YMIN = YMIN;
exports.STEP = STEP;
exports.DIRECTIONS = DIRECTIONS;
var width, // breedte van het tekenveld
height, // hoogte van het tekenveld
xMax, // maximale waarde van x = width - R
yMax; // maximale waarde van y = height - R
exports.width = width;
exports.height = height;
exports.xMax = xMax;
exports.yMax = yMax;
function setWidth(w) {
    exports.width = width = w;
}
exports.setWidth = setWidth;
function setHeight(h) {
    exports.height = height = h;
}
exports.setHeight = setHeight;
function setXMax(x) {
    exports.xMax = xMax = x;
}
exports.setXMax = setXMax;
function setYMax(y) {
    exports.yMax = yMax = y;
}
exports.setYMax = setYMax;
