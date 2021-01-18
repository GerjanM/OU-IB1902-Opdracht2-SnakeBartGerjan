import {} from './presenter.js';
import {setWidth, setHeight, setXMax, setYMax, R, STEP, XMIN, YMIN, DIRECTIONS, width, height, xMax, yMax} from './environment.js';

const   NUMFOODS = 5,          // aantal voedselelementen
        SNAKE   = "DarkRed" ,   // kleur van een slangsegment
        FOOD    = "Olive",      // kleur van voedsel
	    HEAD    = "DarkOrange" // kleur van de kop van de slang

var snake: { segments: string | any[]; snakeRaak: () => any; canMove: (arg0: string) => any; doMove: (arg0: string) => void; } | null = null,
    foods: any[] = [],              // voedsel voor de slang
    direction = DIRECTIONS.UP;


/***************************************************************************
 **                 Constructors                                          **
 ***************************************************************************/
/**
   @constructor Snake
   @desc de slang krijgt ook een paar methoden: of hij mag bewegen, of hij kan bewegen en of hij zichzelf raakt
   @param {[Element] segments een array met aaneengesloten slangsegmenten
                   Het laatste element van segments wordt de kop van de slang
*/
function Snake(this: any, segments) {
    this.segments = segments;
    this.oudeHead = segments[segments.length-1];
    this.doMove = function (direction) {
        var oudeHead = segments[segments.length-1];
        oudeHead.color=SNAKE;
        switch (direction) {   //de variabele nwHead bepalen op basis van direction
            case DIRECTIONS.UP: {
                var nwHead = createSegmentHead(oudeHead.x, oudeHead.y - STEP);
                break;
            }
            case DIRECTIONS.DOWN: {
                var nwHead = createSegmentHead(oudeHead.x, oudeHead.y + STEP);
                break;
            }
            case DIRECTIONS.LEFT: {
                var nwHead = createSegmentHead(oudeHead.x - STEP, oudeHead.y);
                break;
            }
            case DIRECTIONS.RIGHT: {
                var nwHead = createSegmentHead(oudeHead.x + STEP, oudeHead.y);
                break;
            }
        }
    // op de goede positie neerzetten, en eventueel laten groeien als er voedsel is opgegeten
        segments.push(nwHead);
        if (!(nwHead.collidesWithOneOf(foods))) {
            segments.shift();
        }
    };

    this.canMove = function (direction: any) {
        var headIndex=segments.length-1;
        var head = segments[headIndex];
        var canmove = true;
        switch (direction) { //variabele canmove bepalen obv direction en positie
            case DIRECTIONS.UP: {
                if (head.y - 5 < YMIN) {
                canmove = false;
                }
            return canmove;
            break;
            }
            case DIRECTIONS.DOWN: {
                if (head.y + 5 > yMax) {
                canmove = false;
                }
            return canmove;
            break;
            }
            case DIRECTIONS.LEFT: {
                if (head.x - 5 < XMIN) {
                canmove = false;
                }
            return canmove;
            break;
            }
            case DIRECTIONS.RIGHT: {
                if (head.x + 5 > xMax) {
                canmove = false;
                }
            return canmove;
            break;
            }
        }
    };

    this.snakeRaak = function () {
        var snaakRaak = false;
        var headIndex=segments.length-1;
        var head = segments[headIndex];
        var snakeZonderHead = segments.slice(0,headIndex-1);
        if (head.collidesWithOneOf(snakeZonderHead)) {
            snaakRaak = true;
        }
        return snaakRaak;
    };
 }

/**
   @constructor Element
   @desc krijgt ook een methode om te bepalen of hij botst
   @param radius straal
   @param {number} x x-coordinaat middelpunt
   @param {number} y y-coordinaat middelpunt
   @param {string} color kleur van het element
*/
function Element(radius, x, y, color) {
       this.radius = radius;
       this.x = x;
       this.y = y;
       this.color = color;
       this.collidesWithOneOf = function(voedsel) {
            var collision = false;
            for (var i=0; i < voedsel.length; i++) {
                if (Math.abs(this.x-voedsel[i].x) < 1.5 * R && Math.abs(this.y-voedsel[i].y) < 1.5 * R) {
                collision = true;
                }
            }
       return collision;
       };
};

/***************************************************************************
 **                 Hulpfuncties                                          **
 ***************************************************************************/

/**
  @function createStartSnake() -> Snake
  @desc Slang creëren, bestaande uit  twee segmenten,
        in het midden van het veld
  @return: slang volgens specificaties
*/
function createStartSnake() {
	var segments   = [createSegment(R + width/2, R + height/2),
	                  createSegmentHead(R + width/2, height/2 - R),
	                  ];
    snake = new Snake(segments);
}
/**
  @function createSegment(x,y) -> Element
  @desc Slangsegment creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaart middelpunt
  @return: {Element} met straal R en color SNAKE
*/
function createSegment(x, y) {
	return new Element(R, x, y, SNAKE);
}
/**
  @function createSegmentHead(x,y) -> Element
  @desc de Head van de slang creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaart middelpunt
  @return: {Element} met straal R en color HEAD
*/
function createSegmentHead(x, y) {
	return new Element(R, x, y, HEAD);
}

/**
  @function createFood(x,y) -> Element
  @desc Voedselelement creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaart middelpunt
  @return: {Element} met straal R en color FOOD
*/
function createFood(x, y) {
	return new Element(R, x, y, FOOD);
}


/**
  @function getRandomInt(min: number, max: number) -> number
  @desc Creeren van random geheel getal in het interval [min, max]
  @param {number} min een geheel getal als onderste grenswaarde
  @param {number} max een geheel getal als bovenste grenswaarde (max > min)
  @return {number} een random geheel getal x waarvoor geldt: min <= x <= max
*/
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
  @function createFoods() -> array met food
  @desc [Element] array van random verdeelde voedselpartikelen
  @return [Element] array met food
*/
function createFoods() {
    var  i = 0,
        food;
   //we gebruiken een while omdat we, om een arraymethode te gebruiken, eerst een nieuw array zouden moeten creëren (met NUMFOODS elementen)
    while (i < NUMFOODS ) {
        food = createFood(XMIN + getRandomInt(0, xMax), YMIN + getRandomInt(0, yMax));
        if (!food.collidesWithOneOf(snake.segments) && !food.collidesWithOneOf(foods) ) {
            foods.push(food);
            i++
        }
    }
}

function removeFood()  {
    var headIndexSnake=snake.segments.length-1;
    var head = snake.segments[headIndexSnake];
    for (let i=0; i < foods.length; i++) {
        if (Math.abs(head.x-foods[i].x) < 1.5 * R && Math.abs(head.y-foods[i].y) < 1.5 * R) {
            foods.splice(i,1);
        }
    }
}

export {removeFood, createFoods, createStartSnake, snake, foods, direction};