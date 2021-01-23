/**
* @module environment
* @desc bevat een aantal constanten die door de module model gebruikt worden om de spelregels te bepalen
*       ontvangt events van model om fixed waarden te zetten voor aanvang van het spel
*/

//hulpvariabele om CONSTANTS te zetten
let _straal = 10;

/**
 * @typedef ENV_CONSTANTS een custom object met diverse parameters die 
 *      als constanten voor het spel ingelezen kunnen worden
 * @property {number} ENV_CONSTANTS.R de straal van een element in het canvas
 * @property {number} ENV_CONSTANTS.XMIN de minimale waarde op de x-as waar een element zich kan bevinden
 * @property {number} ENV_CONSTANTS.YMIN de minimale waarde op de y-as waar een element zich kan bevinden
 * @property {number} ENV_CONSTANTS.STEP de mimimale verplaatsing van de slang
 * @property {object} ENV_CONSTANTS.DIRECTIONS een enum met toegestane directies voor de slang (left, right, up, down)
 * @property {number} ENV_CONSTANTS.NUMFOODS het aantal voedselemenenten dat bij start van het spel gezet wordt
 * @property {object} ENV_CONSTANTS.COLORS de kleuren op het canvas (SNAKE, FOOD, HEAD)
 * @property {number} ENV_CONSTANTS.SLEEPTIME de tijd in ms die het spel wacht voordat de slang beweegt.
 */
const ENV_CONSTANTS = {
    R           : _straal,           // straal van een element
    XMIN        : _straal,            // minimale x waarde
    YMIN        : _straal,            // minimale y waarde
    STEP        : 2*_straal,          // stapgrootte
    DIRECTIONS  : {
        LEFT    : "left",      // toegestane bewegingsrichtingen
        RIGHT   : "right",
        UP      : "up",
        DOWN    : "down",  
    },
    NUMFOODS     :5,            // aantal voedselelementen
    COLORS       : {
        SNAKE    : "DarkRed" ,   // kleur van een slangsegment
        FOOD     : "Olive",      // kleur van voedsel
        HEAD     : "DarkOrange" // kleur van de kop van de slang
    },
    SLEEPTIME    : 500        // aantal milliseconde voor de timer
};
//zorg dat ze niet meer gewijzigd kunnen worden
Object.freeze(ENV_CONSTANTS);

var width   : number,       // breedte van het tekenveld
height      : number,       // hoogte van het tekenveld
xMax        : number,       /// maximale waarde van x = width - R
yMax        : number;       /// maximale waarde van y = height - R

/**
 * @function getWidth() -> number
 * @desc getter voor width
 * @return {number} width
 */
function getWidth(){
    return width;
}

/**
 * @function setWidth(w) -> void
 * @desc setter voor width
 * @param w {number} zet width op w
 */
function setWidth(w: number){
    width=w;
}

/**
 * @function getHeight() -> number
 * @desc getter voor height
 * @return {number} height
 */
function getHeight(){
    return height;
}

/**
 * @function setHeight(h) -> void
 * @desc setter voor height
 * @param h {number} zet height op h
 */
function setHeight(h: number) {
    height=h;
}

/**
 * @function getXMax() -> number
 * @desc getter voor xMax
 * @return {number} xMax
 */
function getXMax(){
    return xMax;
}

/**
 * @function setXMax(x) -> void
 * @desc setter voor xMax
 * @param x {number} zet xMax op x
 */
function setXMax(x: number) {
    xMax = x;
}

/**
 * @function getYMax(() -> number
 * @desc getter voor yMax
 * @return {number} yMax
 */
function getYMax(){
    return yMax;
}

/**
 * @function setYMax(y) -> void
 * @desc setter voor yMax
 * @param y {number} zet yMax op y
 */
function setYMax(y: number){
    yMax = y;
}


export {getWidth, setWidth, getHeight, setHeight, getXMax, setXMax, getYMax, setYMax, ENV_CONSTANTS}