import {createFoods, createStartSnake, move, setFoods, setMovable, setDirection, foods, snake, direction, movable} from "./model.js";
import {setWidth, setHeight, setXMax, setYMax, R, STEP, XMIN, YMIN, DIRECTIONS, width, height, xMax, yMax} from "./environment.js";
import {draw, canvas, setEndText} from "./view.js";
/***
De presenter zit tussen het domein en de view in. De presenter bekijkt
de events die het via de view krijgt, en brengt op basis daarvan veran-
deringen in het model aan (door het aanroepen van methoden).
Met behulp van de terugkeerwaarden van die methoden en (eventueel)
met behulp van events die het model afvuurt, besluit de presenter hoe
de view moet worden ge-update.
***/
const SLEEPTIME = 500;        // aantal milliseconde voor de timer
var snakeTimer;

/**
@function init() -> void
@desc Haal eventueel bestaand voedsel en een bestaande slang weg, cre\"eer
      een slang, genereer voedsel, en teken alles
*/
function init() {
  setFoods([]);
  setWidth(canvas.width());
  setHeight(canvas.height());
  setXMax(width - 2*R);
  setYMax(height - 2*R);
  createStartSnake();
  createFoods();
  draw();
  snakeTimer = setInterval(function() {move(direction);draw();}, SLEEPTIME);
}
/**
@function einde() -> void
@desc stopt het spel een zet de eindtekst op winst of verlies
@param {boolean} winst: bepaalt de eindtekst: true is winst, false is verlies
*/
function einde(winst) {
  setDirection(DIRECTIONS.UP);
  clearInterval(snakeTimer);
  if(winst) {
    setEndText("Victory!");
  } else {
    setEndText("Game Over!");
  }
}

function changeDirection(new_direction) {
  switch(new_direction) {
    case DIRECTIONS.LEFT:
      if (direction != DIRECTIONS.RIGHT && movable){
        setDirection(new_direction);
        setMovable(false);
      }
    break;
    case DIRECTIONS.UP:
      if (direction != DIRECTIONS.DOWN && movable){
        setDirection(new_direction);
        setMovable(false);
      }
    break;
    case DIRECTIONS.RIGHT:
      if (direction != DIRECTIONS.LEFT && movable){
        setDirection(new_direction);
        setMovable(false);
      }
    break;
    case DIRECTIONS.DOWN:
      if (direction != DIRECTIONS.UP && movable){
        setDirection(new_direction);
        setMovable(false);
      }
    break;
  }

}

export { init, einde, changeDirection};