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
var width, // breedte van het tekenveld
height, // hoogte van het tekenveld
xMax, // maximale waarde van x = width - R
yMax; // maximale waarde van y = height - R
/**
 * @function setWidth(w) -> void
 * @desc setter for width
 * @param w {number} sets width to w
 */
function setWidth(w) {
    width = w;
}
/**
 * @function setHeight(h) -> void
 * @desc setter for height
 * @param h {number} sets height to h
 */
function setHeight(h) {
    height = h;
}
/**
 * @function setXMax(x) -> void
 * @desc setter for xMax
 * @param x {number} sets xMax to x
 */
function setXMax(x) {
    xMax = x;
}
/**
 * @function setYMax(y) -> void
 * @desc setter for yMax
 * @param y {number} sets yMax to y
 */
function setYMax(y) {
    yMax = y;
}
export { setWidth, setHeight, setXMax, setYMax, R, STEP, XMIN, YMIN, DIRECTIONS, width, height, xMax, yMax };
