import {ENV_CONSTANTS} from "./environment.js";
import {init, finish, changeDirection} from "./presenter.js";

/***
De view is het zichtbare deel van de applicatie. In het geval van een
webapplicatie bestaat de view uit alle code die er voor zorgt dat de
DOM wordt aangepast. In dit geval is dat voornamelijk het canvas. De
view is passief. De view wordt door de presenter gevraagd om de DOM
te updaten, en krijgt daarvoor de gegevens mee. De view geeft events
van de gebruiker door aan de presenter zonder er zelf iets mee te doen.
***/

/**
* @module view
* @desc Vangt events van de gebruiker af, geeft deze door aan de presenter.
*       Verantwoordelijk voor het tekenen van het canvas.
*/

var endtext: any,
    canvas: any;

/***
Generieke eventhandlers
***/
$(document).ready(function() {
  canvas = $("#mySnakeCanvas");
  $("#startSnake").click(init);
  $("#stopSnake").click(finish);
  jQuery(document).keydown(function(e) {
    switch(e.which) {
      case 37:
        changeDirection(ENV_CONSTANTS.DIRECTIONS.LEFT);
      break;
      case 38:
        changeDirection(ENV_CONSTANTS.DIRECTIONS.UP);
      break;
      case 39:
        changeDirection(ENV_CONSTANTS.DIRECTIONS.RIGHT);
      break;
      case 40:
        changeDirection(ENV_CONSTANTS.DIRECTIONS.DOWN);
      break;
    }
    e.preventDefault();
  });
});

/**
@function draw(drawelements) -> void
@desc Teken de slang en het voedsel
*/
function draw(drawelements: {color: string; x: number; y: number; radius: number;}[]) {
  canvas.clearCanvas();
  
  drawelements.forEach((item, i) => {
    drawElement(item,canvas);
  });
  if (endtext) {
    canvas.drawText({
      fillStyle: "#9cf",
      strokeStyle: "#25a",
      strokeWidth: 2,
      x: canvas.width()/2, y: canvas.height()/2,
      fontSize: 48,
      fontFamily: "Verdana, sans-serif",
      text: endtext
    });
  }
}

/**
@function drawElement(element, canvas) -> void
@desc Een element tekenen
@param {{color: string, x: number, y:number, radius: number}}} element een Element object
@param  {HTMLElement} canvas het tekenveld
*/
function drawElement(element: { color: string; x: number; y: number; radius: number; }, canvas: any) {
  canvas.drawArc({
    draggable : false,
    fillStyle : element.color,
    x : element.x,
    y : element.y,
    radius : element.radius
  });
}
/**
 * @function setEndText(t) -> void
 * @desc Zet de eindtekst van het spel
 * @param t {string} tekst die gedisplayed moet worden in het canvas
 */
function setEndText(t?: string) {
  endtext = t;
}
export {draw, setEndText, canvas};