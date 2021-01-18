"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movable = exports.direction = exports.foods = exports.snake = exports.setMovable = exports.setDirection = exports.setFoods = exports.move = exports.createStartSnake = exports.createFoods = void 0;
const presenter_1 = require("./presenter");
const environment_1 = require("./environment");
/***
Het model is het domein. Het is de bedoeling dat het domein geheel
onafhankelijk is. Het model hoeft dus de rest van de applicatie niet te
kennen. Het model kan, indien nodig, events gebruiken om naar de
buitenwereld te communiceren. Het model roept dus niet direct func-
ties aan van de andere lagen.
***/
const SNAKE = "DarkRed", // kleur van een slangsegment
FOOD = "Olive", // kleur van voedsel
HEAD = "DarkOrange", // kleur van de kop van de slang
// er moet gelden: WIDTH = HEIGHT
NUMFOODS = 5; // aantal voedselelementen
var snake, foods = [], // voedsel voor de slang
movable, // hulp-boolean die ervoor zorgt dat je maar \'e\'en
// keer een directie kunt opgeven in een interval.
direction = environment_1.DIRECTIONS.UP;
exports.snake = snake;
exports.foods = foods;
exports.movable = movable;
exports.direction = direction;
/***************************************************************************
**                 Constructors                                          **
***************************************************************************/
/**
@constructor Snake
@param {[Element] segments een array met aaneengesloten slangsegmenten
  Het laatste element van segments wordt de kop van de slang
  @param {boolean} lives: geeft aan of de slang nog leeft
  @param {function}isAlive(): geeft de boolean lives terug
  @param {function} canMove(): geeft aan of de volgende zet cf direction de
  slang niet van het canvas doet bewegen
  @param {function} doMove(): laat de slang in de beweging van direction happen
  eet voedsel op en kan zichzelf doodmaken door zichzelf op te eten
  */
function Snake(segments) {
    this.segments = segments;
    this.lives = true;
    this.isAlive = function () {
        return this.lives;
    };
    //zet de kop van de slang op de juiste kleur
    this.segments[segments.length - 1].color = HEAD;
    this.canMove = function (direction) {
        var canMove = false;
        if (direction) {
            //De beweging kan als het laatste segment (kop van slang) + step
            //binnen het canvas blijft
            var _head = segments[segments.length - 1];
            switch (direction) {
                case environment_1.DIRECTIONS.UP:
                    canMove = _head.y - environment_1.STEP >= 0;
                    break;
                case environment_1.DIRECTIONS.RIGHT:
                    canMove = _head.x + environment_1.STEP <= environment_1.xMax;
                    break;
                case environment_1.DIRECTIONS.DOWN:
                    canMove = _head.y + environment_1.STEP <= environment_1.yMax;
                    break;
                case environment_1.DIRECTIONS.LEFT:
                    canMove = _head.x - environment_1.STEP >= 0;
                    break;
            }
        }
        return canMove;
    };
    //verplaats de slang naar de nieuwe locatie, maak hem langer in het geval
    //van eten, of laat hem sterven in het geval van het happen van de staart
    this.doMove = function (direction) {
        if (direction) {
            //pass by reference
            var _head = segments[segments.length - 1];
            var _new_head;
            switch (direction) {
                case environment_1.DIRECTIONS.UP:
                    _new_head = createSegment(_head.x, (_head.y - environment_1.STEP));
                    break;
                case environment_1.DIRECTIONS.RIGHT:
                    _new_head = createSegment((_head.x + environment_1.STEP), _head.y);
                    break;
                case environment_1.DIRECTIONS.DOWN:
                    _new_head = createSegment(_head.x, (_head.y + environment_1.STEP));
                    break;
                case environment_1.DIRECTIONS.LEFT:
                    _new_head = createSegment((_head.x - environment_1.STEP), _head.y);
                    break;
            }
            //_head is nu body, zet hem op de juiste kleur
            _head.color = SNAKE;
            //geef _new_head de juiste kleur en voeg toe aan de slang
            _new_head.color = HEAD;
            //controleer of we niet in onze staart bijten
            this.segments.forEach((item, i) => {
                if (detectCollision(item, _new_head)) {
                    this.lives = false;
                    //bijt de rest van de staart eraf
                    this.segments.splice(0, i);
                }
            });
            //voeg de kop toe.
            this.segments.push(_new_head);
            //zet een tijdelijke variabele, zodat we niet los op collisions
            //hoeven te zoeken
            var _remove_tail = true;
            foods.forEach((item, i) => {
                if (detectCollision(item, _new_head)) {
                    foods.splice(i, 1);
                    //staart niet verwijderen, want we zijn gegroeid door te eten.
                    _remove_tail = false;
                }
            });
            if (_remove_tail) {
                //verwijder het laatste element van de staart, want we zijn verplaatst
                this.segments.splice(0, 1);
            }
        }
    };
}
/**
@constructor SnakeElement
@param radius straal
@param {number} x x-coordinaat middelpunt
@param {number} y y-coordinaat middelpunt
@param {string} color kleur van het element
@param {function} prototype.collidesWithOneOf(arguments) bepaalt of iets uit
        de lijst gelijke waarde en type heeft voor de x en y co\"ordinaten
*/
function SnakeElement(radius, x, y, color) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.color = color;
}
// verplaatst naar prototype, omdat het een gedeelde functie is
SnakeElement.prototype.collidesWithOneOf = function (parameters) {
    var numEquals = 0;
    if (parameters) {
        parameters.forEach((item, i) => {
            //controleer niet op co\"ordinaat inclusief de radius
            if (detectCollision(item, this)) {
                numEquals++;
            }
        });
    }
    return numEquals > 0;
};
/***************************************************************************
**                 HulpFuncties                                          **
***************************************************************************/
/**
@function createSegment(x,y) -> Element
@desc Slangsegment creeren op een bepaalde plaats
@param {number} x x-coordinaat middelpunt
@param {number} y y-coordinaart middelpunt
@return: {Element} met straal R en color SNAKE
*/
function createSegment(x, y) {
    return new SnakeElement(environment_1.R, x, y, SNAKE);
}
/**
@function createFood(x,y) -> Element
@desc Voedselelement creeren op een bepaalde plaats
@param {number} x x-coordinaat middelpunt
@param {number} y y-coordinaart middelpunt
@return: {Element} met straal R en color FOOD
*/
function createFood(x, y) {
    return new SnakeElement(environment_1.R, x, y, FOOD);
}
/**
@function detectCollision(a,b)
@desc controleert of twee elementen overlappende x en y co\"ordinaten hebben
@param {Element} a eerste element voor de vergelijking
@param {Element} b tweede element voor de vergelijking
@return: true als hun co\"ordinaten overlappen, false wanneer dat niet zo is.
*/
function detectCollision(a, b) {
    return a.x >= b.x - environment_1.R && a.x <= b.x + environment_1.R && a.y >= b.y - environment_1.R && a.y <= b.y + environment_1.R;
}
/**
@function getRandomInt(min: number, max: number) -> number
@desc Creeren van random geheel getal in het interval [min, max]
@param {number} min een geheel getal als onderste grenswaarde
@param {number} max een geheel getal als bovenste grenswaarde (max > min)
@return {number} een random geheel getal x waarvoor geldt: min <= x <= max
*/
function getRandomInt(min, max) {
    return Math.floor((Math.random() * (max - min + 1) + min) / environment_1.STEP) * environment_1.STEP;
}
/**
@function createFoods() -> array met food
@desc [Element] array van random verdeelde voedselpartikelen
@return [Element] array met food
*/
function createFoods() {
    var i = 0, food;
    //we gebruiken een while omdat we, om een arraymethode te gebruiken,
    //eerst een nieuw array zouden moeten creëren (met NUMFOODS elementen)
    while (i < NUMFOODS) {
        food = createFood(environment_1.XMIN + getRandomInt(0, environment_1.xMax), environment_1.YMIN + getRandomInt(0, environment_1.yMax));
        if (!food.collidesWithOneOf(snake.segments)
            &&
                !food.collidesWithOneOf(foods)) {
            foods.push(food);
            i++;
        }
    }
}
exports.createFoods = createFoods;
/***************************************************************************
**                 Gamelogic                                              **
***************************************************************************/
/**
@function move(direction) -> void
@desc Beweeg slang in aangegeven richting
tenzij slang uit canvas zou verdwijnen
@param   {string} direction de richting (UP, DOWN, LEFT of RIGHT)
*/
function move(direction) {
    //als het eten op is, hebben we gewonnen
    if (foods.length === 0) {
        presenter_1.einde(true);
    }
    else if (snake.canMove(direction) && snake.isAlive()) {
        snake.doMove(direction);
    }
    else {
        presenter_1.einde(false);
    }
    //nu de move klaar is accepteren we weer nieuwe inputs van de gebruiker
    exports.movable = movable = true;
}
exports.move = move;
/**
@function createStartSnake() -> Snake
@desc Slang creëren, bestaande uit  twee segmenten,
in het midden van het veld
@return: slang volgens specificaties
*/
function createStartSnake() {
    var segments = [createSegment(environment_1.R + environment_1.width / 2, environment_1.R + environment_1.height / 2),
        createSegment(environment_1.R + environment_1.width / 2, environment_1.height / 2 - environment_1.R)];
    exports.snake = snake = new Snake(segments);
}
exports.createStartSnake = createStartSnake;
function setFoods(f) {
    exports.foods = foods = f;
}
exports.setFoods = setFoods;
function setDirection(d) {
    exports.direction = direction = d;
}
exports.setDirection = setDirection;
function setMovable(m) {
    exports.movable = movable = m;
}
exports.setMovable = setMovable;
