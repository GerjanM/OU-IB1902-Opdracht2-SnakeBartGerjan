import {foods, snake} from "./model.js";
import {DIRECTIONS, xMax, yMax, width, height } from "./environment.js";
import {init, stop, move} from "./presenter.js";

/***
De view is het zichtbare deel van de applicatie. In het geval van een
webapplicatie bestaat de view uit alle code die er voor zorgt dat de
DOM wordt aangepast. In dit geval is dat voornamelijk het canvas. De
view is passief. De view wordt door de presenter gevraagd om de DOM
te updaten, en krijgt daarvoor de gegevens mee. De view geeft events
van de gebruiker door aan de presenter zonder er zelf iets mee te doen.
***/


var endtext,
    canvas;


/***
Generieke eventhandlers
***/
$(document).ready(function() {
  canvas = $("#mySnakeCanvas");
  $("#startSnake").click(init);
  $("#stopSnake").click(stop);
  jQuery(document).keydown(function(e) {
    switch(e.which) {
      case 37:
        changeDirection(DIRECTIONS.LEFT);
      break;
      case 38:
        changeDirection(DIRECTIONS.UP);
      break;
      case 39:
        changeDirection(DIRECTIONS.RIGHT);
      break;
      case 40:
        changeDirection(DIRECTIONS.DOWN);
      break;
    }
    e.preventDefault();
  });
});

/**
@function draw() -> void
@desc Teken de slang en het voedsel
*/
function draw() {
  $("#mySnakeCanvas").clearCanvas();
  foods.forEach((item, i) => {
    drawElement(item,canvas);
  });
  snake.segments.forEach((item, i) => {
    drawElement(item,canvas);
  });
  if (endtext) {
    canvas.drawText({
      fillStyle: "#9cf",
      strokeStyle: "#25a",
      strokeWidth: 2,
      x: xMax/2, y: yMax/2,
      fontSize: 48,
      fontFamily: "Verdana, sans-serif",
      text: endtext
    });
  }
}

/**
@function drawElement(element, canvas) -> void
@desc Een element tekenen
@param {Element} element een Element object
@param  {dom object} canvas het tekenveld
*/
function drawElement(element, canvas) {
  canvas.drawArc({
    draggable : false,
    fillStyle : element.color,
    x : element.x,
    y : element.y,
    radius : element.radius
  });
}

function setEndText(t: string) {
  endtext = t;
}

export {draw, canvas};
