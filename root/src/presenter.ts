import {setStartPositions, move, getMovable, setMovable, getGameOver, getElementsForDrawing} from "./model.js";
import {setWidth, setHeight, setXMax, setYMax, ENV_CONSTANTS} from "./environment.js";
import {draw, canvas, setEndText} from "./view.js";
/***
De presenter zit tussen het domein en de view in. De presenter bekijkt
de events die het via de view krijgt, en brengt op basis daarvan veran-
deringen in het model aan (door het aanroepen van methoden).
Met behulp van de terugkeerwaarden van die methoden en (eventueel)
met behulp van events die het model afvuurt, besluit de presenter hoe
de view moet worden ge-update.
***/

/**
* @module presenter
* @desc Handelt events van de view af, geeft model de opdracht het spel te starten, en view de opdracht een nieuw scherm te tekenen
*/

var snakeTimer: any,
    direction: string =  ENV_CONSTANTS.DIRECTIONS.UP; //hulpwaarde om de geldigheid van de move te valideren

/**
@function init() -> void
@desc Haal eventueel bestaand voedsel en een bestaande slang weg, cre\"eer
      een slang, genereer voedsel, en teken alles
*/
function init() {
  //schoon mogelijke vervuiling door een eerdere start op
  if (snakeTimer !== undefined) {
    clearInterval(snakeTimer);
  }
  setEndText();
  //initialiseer het spel
  setWidth(canvas.width());
  setHeight(canvas.height());
  setXMax(canvas.width());
  setYMax(canvas.height());
  setStartPositions();
  draw(getElementsForDrawing());
  snakeTimer = setInterval(function() {move(direction);isFinished();draw(getElementsForDrawing());}, ENV_CONSTANTS.SLEEPTIME);
}

/**
 * @function isFinished() -> void
 * @desc Bepaalt aan de hand van de modelstatus (winst) of het spel doorgang vindt.
 *       Zet de eindtext in de view als er sprake is van een overwinning of verlies
 */
function isFinished(){
  switch (getGameOver()){
    case null:
      break;
    case true:
      setEndText("Victory!")
      finish();
      break;
    case false:
      setEndText("Game Over!")
      finish();
  }
}
/**
 * @function finish() -> void
 * @desc stopt het spel
 */
function finish() {
  setDirection(ENV_CONSTANTS.DIRECTIONS.UP);
  clearInterval(snakeTimer);
}

/**
 * @function changeDirection(new_direction) -> void
 * @desc sets the snake direction to new direction, and disallows setting it until the 
 *      snake moved. Allowes new_directions for any direction but the opposite
 * @param new_direction {string} set direction to new_direction
 */
function changeDirection(new_direction: string) {
  switch(new_direction) {
    case ENV_CONSTANTS.DIRECTIONS.LEFT:
      if (direction != ENV_CONSTANTS.DIRECTIONS.RIGHT && getMovable()){
        setDirection(new_direction);
        setMovable(false);
      }
    break;
    case ENV_CONSTANTS.DIRECTIONS.UP:
      if (direction != ENV_CONSTANTS.DIRECTIONS.DOWN && getMovable()){
        setDirection(new_direction);
        setMovable(false);
      }
    break;
    case ENV_CONSTANTS.DIRECTIONS.RIGHT:
      if (direction != ENV_CONSTANTS.DIRECTIONS.LEFT && getMovable()){
        setDirection(new_direction);
        setMovable(false);
      }
    break;
    case ENV_CONSTANTS.DIRECTIONS.DOWN:
      if (direction != ENV_CONSTANTS.DIRECTIONS.UP && getMovable()){
        setDirection(new_direction);
        setMovable(false);
      }
    break;
  }

}

/**
 * @function setDirection(d) -> void
 * @desc zet de hulpvariable die de richting van de slang bijhoudt op d
 * @param d {string}
 */

function setDirection(d: string) {
  direction = d;
}

export {init, finish, changeDirection};