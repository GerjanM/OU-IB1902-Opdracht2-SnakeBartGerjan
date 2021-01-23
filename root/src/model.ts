/**
* @module model
* @desc Bevat de benodigde classes en functies voor de spellogica van snake
*/

import {getWidth, getHeight, getXMax, getYMax, ENV_CONSTANTS} from './environment.js';

/***************************************************************************
**                 Toelichting                                          **
*****************************************************************************
Het model is het domein. Het is de bedoeling dat het domein geheel
onafhankelijk is. Het model hoeft dus de rest van de applicatie niet te
kennen. Het model kan, indien nodig, events gebruiken om naar de
buitenwereld te communiceren. Het model roept dus niet direct func-
ties aan van de andere lagen.
***************************************************************************/
var   snake: Snake,                      // Slangobject
      foods: SnakeElement[],             // voedsel voor de slang
      movable: boolean,                  // hulp-boolean die ervoor zorgt dat je maar één
                                         // keer een directie kunt opgeven in een interval.
      winst: boolean|null = null;            // hulp-boolean op basis waarvan wordt bepaald of het spel is beëindigd
/***************************************************************************
**                 Constructors                                          **
***************************************************************************/
class Snake {

  private segments: SnakeElement[];
  private alive: boolean;

  /**
  *  @constructor Snake
  *  @param {SnakeElement[]} segments een array met aaneengesloten slangsegmenten
  *  Het laatste element van segments wordt de kop van de slang
  */
  constructor(segments: SnakeElement[]) {
    this.segments = segments;
    this.alive = true;
    //zet de kop van de slang op de juiste kleur
    this.segments[segments.length-1].color=ENV_CONSTANTS.COLORS.HEAD;
  }

  /**
   * @return {boolean} Retourneert of de slang leeft (true) of niet (false)
   */
  isAlive = (): boolean => {
    return this.alive;
  }

  /**
   * 
   * @return {SnakeElement[]} geeft een kopie (copy-by-value) van de segmenten van de slang terug 
   */
  getSegments = (): SnakeElement[] => {
    let copySegments = this.segments.slice();
    return copySegments;
  }
  
  /**
   * @param {string} direction de gewenste bewegingsrichting voor de slang (up, right, down, left)
   * @return {boolean} Boolean die aangeeft of de slang kan bewegen.
   */
  canMove = (direction: string): boolean => {
    let canMove = false;
    if (direction){
      //De beweging kan als het laatste segment (kop van slang) + step
      //binnen het canvas blijft
      var _head = this.segments[this.segments.length-1]
      switch(direction) {
        case ENV_CONSTANTS.DIRECTIONS.UP:
          canMove = _head.y - ENV_CONSTANTS.STEP >= 0;
          break;
        case ENV_CONSTANTS.DIRECTIONS.RIGHT:
          canMove = _head.x + ENV_CONSTANTS.STEP <= getXMax();
          break;
        case ENV_CONSTANTS.DIRECTIONS.DOWN:
          canMove = _head.y + ENV_CONSTANTS.STEP <= getYMax();
          break;
        case ENV_CONSTANTS.DIRECTIONS.LEFT:
          canMove = _head.x - ENV_CONSTANTS.STEP >= 0;
          break;
      }
    }
    return canMove;
  };

  /**
   * @param {string} direction De bewegingsrichting waarin de slang moet bewegen
   * @desc De slang zal bewegen in richting direction. Als de nieuwe locatie een deel
   *        van de staart van de slang bevat, zal de slang sterven.
   */
  doMove =  (direction: string) => {
    //pass by reference
    var _head = this.segments[this.segments.length-1],
    _new_head: SnakeElement,
    _new_y= _head.y,
    _new_x = _head.x;
    if (direction){
      switch(direction) {
        case ENV_CONSTANTS.DIRECTIONS.UP:
        _new_y = _head.y - ENV_CONSTANTS.STEP;
        break;
        case ENV_CONSTANTS.DIRECTIONS.RIGHT:
          _new_x = _head.x + ENV_CONSTANTS.STEP;
        break;
        case ENV_CONSTANTS.DIRECTIONS.DOWN:
          _new_y = _head.y + ENV_CONSTANTS.STEP;
        break;
        case ENV_CONSTANTS.DIRECTIONS.LEFT:
          _new_x = _head.x - ENV_CONSTANTS.STEP;
        break;
      }
      //maak een nieuwe kop op de hierboven bepaalde x, y
      _new_head = new SnakeElement(ENV_CONSTANTS.R, _new_x, _new_y, ENV_CONSTANTS.COLORS.HEAD);
      //_head is nu body, zet hem op de juiste kleur
      _head.color = ENV_CONSTANTS.COLORS.SNAKE;
      //controleer of we niet in onze staart bijten
      this.segments.forEach((item, i) => {
        if(detectCollision(item, _new_head)){
          this.alive = false;
          //bijt de rest van de staart eraf
          this.segments.splice(0,i);
        }
      });
      //voeg de kop toe.
      this.segments.push(_new_head);
      //zet een tijdelijke variabele, zodat we niet los op collisions
      //hoeven te zoeken
      var _remove_tail = true
      foods.forEach((item, i) => {
        if(detectCollision(item, _new_head)) {
          foods.splice(i,1);
          //staart niet verwijderen, want we zijn gegroeid door te eten.
          _remove_tail = false;
        }
      });
      if(_remove_tail) {
        //verwijder het laatste element van de staart, want we zijn verplaatst
        this.segments.splice(0,1);
      }
    }
  }
}

class SnakeElement{
  radius: number;
  x: number;
  y: number;
  color: string;
  
  /**
  @constructor SnakeElement
  @param radius straal
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaat middelpunt
  @param {string} color kleur van het element
  */
  constructor(radius: number, x: number, y: number, color: string) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.color = color;
  }

   /**
   * @param {SnakeElement[]} elements Array van SnakeElement objecten
   * @desc retourneert of het element botst met een element uit elements
   * @return {boolean} true als er een botsing gedetecteerd is, anders false
   */ 
  collidesWithOneOf = (elements: SnakeElement[]): boolean => {
    var _numEquals = false;
    if (elements) {
      elements.forEach((item, i) => {
        //controleer niet op co\"ordinaat inclusief de radius
      if (detectCollision(item, this)) {
        _numEquals = true;
      }
    });
    }
    return _numEquals;
  }
}
/***************************************************************************
**                 HulpFuncties                                          **
***************************************************************************/
/**
 * 
@function detectCollision(a,b) -> boolean
@desc Controleert of twee elementen overlappende x en y coördinaten hebben.
@param {SnakeElement} a eerste element voor de vergelijking
@param {SnakeElement} b tweede element voor de vergelijking
@return {boolean} true als hun coördinaten overlappen, false wanneer dat niet zo is.
*/
function detectCollision(a: SnakeElement, b: SnakeElement): boolean {
  return a.x >= b.x-ENV_CONSTANTS.R && a.x <= b.x+ENV_CONSTANTS.R && a.y >= b.y -ENV_CONSTANTS.R && a.y <= b.y + ENV_CONSTANTS.R;
}

/**
@function getRandomInt(min: number, max: number) -> number
@desc Creërt een random geheel getal in het interval [min, max] dat deelbaar is door STEP.
@param {number} min een geheel getal als onderste grenswaarde
@param {number} max een geheel getal als bovenste grenswaarde (max > min)
@return {number} een random veelvoud van STEP waarvoor geldt: min <= x <= max
*/
function getRandomInt(min: number, max: number): number {
  return Math.floor((Math.random() * (max - min + 1) + min)/ENV_CONSTANTS.STEP)*ENV_CONSTANTS.STEP;
}

/**
 * @function getElementsForDrawing() -> SnakeElements
 * @desc Retourneert alle elementen in het spel, zodat zij op het canvast getekend kunnen worden.
 * @return {SnakeElement[]} array met alle elementen in het spel
 */
function getElementsForDrawing(): SnakeElement[] {
  let return_array: SnakeElement[] = [];
  foods.forEach((item, i) => {
    return_array.push(item);
  });
  snake.getSegments().forEach((item, i) => {
    return_array.push(item);
  });
  return return_array;
}

/**
 * @function getMovable(w) -> boolean
 * @desc getter for status movable
 * @return {boolean} retourneert true als er bewogen mag worden, false als de vorige move nog verwerkt moet worden.
 */
function getMovable(): boolean {
  return movable;
}

/**
 * @function setMovable(m) -> void
 * @desc setter voor movable
 * @param m {boolean} zet movable op m
 */
function setMovable(m: boolean) {
  movable = m;
}

/**
 * @function getGameOver(w) -> boolean|null
 * @desc getter for de globale status van het spel
 * @return {boolean|null} retourneert null als het spel nog bezig is,
 *        true als het spel gewonnen is,  false als het spel verloren is
 */
function getGameOver(): boolean | null{
  return winst;
}

/**
 * @function setGameOver(w) -> void
 * @desc setter for de globale status van het spel
 * @param w {boolean} zet winst op waarde w
 */
function setGameOver(overwinning: boolean|null) {
  winst = overwinning;
}
/***************************************************************************
**                 TestExports                                           **
***************************************************************************/
//Specifieke exports om unit testen op private classes te kunnen doen
//Mag niet in productie eindigen

/**
 * @typedef TESTING een custom object met diverse functies die 
 *      voor testdoeleinden gebruikt kunnen worden
 * @property {function} TESTING.getSnakeForTesting: Retourneert de snake voor testdoeleinden
 * @property {function} TESTING.getFoodsForTesting: Retourneert de foods[] voor testdoeleinden
 * @property {function} TESTING.createSnakeElementForTesting: Maakt een snakesegment voor testdoeleinden
 * @property {function} TESTING.setFoodsForTesting(f): Zet foods op f voor testdoeleinden
 * @property {function} TESTING.setGameOverForTesting(v): Zet de gamestatus op v (boolean|null) voor testdoeleinden
 */
var TESTING = {

  /** 
   * @desc Haalt de snake op voor testdoeleinden
   * @return {Snake} snake
  */
  getSnakeForTesting: (() => {
    return snake;
  }),

  /**
   * @desc retourneert de gebruikte foods array in de gamelogic
   *       voor testdoeleinden
   * @return {SnakeElement[] foods
   */
  getFoodsForTesting: (() => {
    return foods
  }),

  /**
   * @desc Voor testdoeleinden om buiten de logica van het spel elementen te kunnen creëren
   * @return {SnakeElement} retourneert een nieuw SnakeElement
   */
  createSnakeElementForTesting: ((x: number, y: number) => {
    return new SnakeElement(ENV_CONSTANTS.R, x, y, ENV_CONSTANTS.COLORS.SNAKE);
  }),

  /**
   * @desc Voor testdoeleinden mag de voedsel van buitenaf leeg gemaakt worden
   */
  setFoodsForTesting: (() => {
    foods = [];
  }),

  /**
   * @param {boolean|null} value de waarde die gamestatus moet krijgen (true, false, null)
   * @desc Voor testdoeleinden mag de gamestatus overruled worden met waarde: value van buitenaf
   */
  setGameOverForTesting: ((value: boolean|null) => {
    setGameOver(value);
  }),
}
/***************************************************************************
**                 Gamelogic                                              **
***************************************************************************/
/**
 * @function setStartPositions() -> void
 * @desc zet de initiele startpositie van voedsel en de start-slang
 *       de gamestatus moet naar null gezet worden
 */

function setStartPositions(){
  foods = [];
  createStartSnake();
  createFoods();
  setGameOver(null);
}

/**
@function move(direction) -> void
@desc Beweeg slang in aangegeven richting
tenzij slang uit canvas zou verdwijnen
@param   {string} direction de richting (UP, DOWN, LEFT of RIGHT)
@return: de te nemen actie
*/

function move(direction: string) {
    //als het eten op is, hebben we gewonnen
    if (foods.length === 0) {
        setGameOver(true);
    }
    else if (snake.canMove(direction) && snake.isAlive()) {
        snake.doMove(direction);
    }
    else {
        setGameOver(false);
    }
    //nu de move klaar is accepteren we weer nieuwe inputs van de gebruiker
    setMovable(true);
}

/**
@function createStartSnake() -> Snake
@desc Slang creëren, bestaande uit  twee segmenten,
in het midden van het veld
@return: {Snake} slang volgens specificaties
*/
function createStartSnake() {
  var segments   = [new SnakeElement(ENV_CONSTANTS.R, ENV_CONSTANTS.R + getWidth()/2, ENV_CONSTANTS.R + getHeight()/2, ENV_CONSTANTS.COLORS.SNAKE),
                    new SnakeElement(ENV_CONSTANTS.R, ENV_CONSTANTS.R + getWidth()/2, getHeight()/2 - ENV_CONSTANTS.R, ENV_CONSTANTS.COLORS.SNAKE)];
  snake = new Snake(segments);
}


/**
@function createFoods() -> array met food
@desc Maakt een array van random verdeelde voedselelementen
@return {SnakeElement[]} array met food
*/
function createFoods(): SnakeElement[]|void {
  var  i = 0,
  food: SnakeElement;
  //we gebruiken een while omdat we, om een arraymethode te gebruiken,
  //eerst een nieuw array zouden moeten creëren (met NUMFOODS elementen)
  while (i < ENV_CONSTANTS.NUMFOODS ) {
    food = new SnakeElement(
      ENV_CONSTANTS.R,
      ENV_CONSTANTS.XMIN + getRandomInt(0, getXMax()),
      ENV_CONSTANTS.YMIN + getRandomInt(0, getYMax()),
      ENV_CONSTANTS.COLORS.FOOD
    );
    if (
        !food.collidesWithOneOf(snake.getSegments())
          &&
        !food.collidesWithOneOf(foods)
        ) {
      foods.push(food);
      i++
    }
  }
}

export {setStartPositions, move, getMovable, setMovable, getGameOver, getElementsForDrawing, TESTING}
