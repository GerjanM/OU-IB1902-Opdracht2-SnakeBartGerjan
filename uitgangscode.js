const R        = 10,          // straal van een element
      STEP     = 2*R,         // stapgrootte
                              // er moet gelden: WIDTH = HEIGHT
      LEFT     = "left",      // bewegingsrichtingen 
      RIGHT    = "right",
      UP       = "up",
      DOWN     = "down",

      NUMFOODS = 5,          // aantal voedselelementen

      XMIN     = R,           // minimale x waarde 
      YMIN     = R,           // minimale y waarde 
	  
	  SLEEPTIME = 500,        // aantal milliseconde voor de timer

      SNAKE   = "DarkRed" ,   // kleur van een slangsegment
      FOOD    = "Olive",      // kleur van voedsel
	  HEAD    = "DarkOrange"  // kleur van de kop van de slang

var snake = null,
    foods = [],               // voedsel voor de slang
	width = 360,              // breedte van het tekenveld
    height = 360,             // hoogte van het tekenveld
	xMax = width - R,         // maximale waarde van x = width - R
	yMax = height - R,        // maximale waarde van y = height - R
	direction = UP;
	
$(document).ready(function() {
	$("#startSnake").click(init);  
	$("#stopSnake").click(stop);
});

/**
  @function init() -> void
  @desc Haal eventueel bestaand voedsel en een bestaande slang weg, cre\"eer een slang, genereer voedsel, en teken alles
*/
function init() {
snake = null;
foods = [];
canvas = document.getElementById("mySnakeCanvas");
context = canvas.getContext("2d");
createStartSnake();
createFoods();
draw();
// bepalen van de variabele direction
$(document).keydown(function (e) {
 switch (e.which) {
  case 37: // left
   direction = LEFT;
   break;
 case 38: // up
   direction = UP;
   break;
 case 39: // right
   direction = RIGHT;
   break;
 case 40: // down
   direction = DOWN;
   break;
 }
});
// laat de slang bewegen
snakeTimer = setInterval(function() {
move(direction);}, SLEEPTIME);
}

/**
  @function stop() -> void
  @desc Haal eventueel bestaand voedsel en een bestaande slang weg, cre\"eer een slang, genereer voedsel, en teken alles
*/
function stop() {
clearInterval(snakeTimer);
context.clearRect(0, 0, 360, 360);
snake = null;
foods = [];
}

/**
  @function move(direction) -> void
  @desc Beweeg slang in aangegeven richting
        tenzij slang uit canvas zou verdwijnen  
  @param   {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
*/
function move(direction) {
    if (foods.length == 0) {
    alert("U bent de winnaaaarrrr !");
    console.log("Winnaar");
    }
    else if (snake.snakeRaak()) {
    alert("Je hebt jezelf opgegeten : je hebt verloren :(");
    console.log("Verloren");
    }
	else if (snake.canMove(direction)) {
		snake.doMove(direction);
		draw();
	}
	else {
		console.log("snake cannot move " + direction);
	}
}

/**
  @function draw() -> void
  @desc Teken de slang en het voedsel
*/
function draw() {
    context.clearRect(0, 0, width, height);
	canvas = document.getElementById("mySnakeCanvas");
    context = canvas.getContext("2d");
    for (i = 0; i < snake.segments.length;i++) {
        drawElement(snake.segments[i], canvas, context);
    }
    for (i = 0; i < foods.length; i++) {
        drawElement(foods[i], canvas, context);
    }
}
/***************************************************************************
 **                 Constructors                                          **
 ***************************************************************************/
/**
   @constructor Snake
   @desc de slang krijgt ook een paar methoden: of hij mag bewegen, of hij kan bewegen en of hij zichzelf raakt
   @param {[Element] segments een array met aaneengesloten slangsegmenten
                   Het laatste element van segments wordt de kop van de slang 
*/ 
function Snake(segments) {
    this.segments = segments;
    this.oudeHead = this.segments[this.segments.length-1];
    this.doMove = function (direction) {
        var oudeHead = snake.segments[snake.segments.length-1];
        oudeHead.color=SNAKE;
        switch (direction) {   //de variabele nwHead bepalen op basis van direction
            case UP: {
                var nwHead = createSegmentHead(oudeHead.x, oudeHead.y - 2*R);
                break;
            }
            case DOWN: {
                var nwHead = createSegmentHead(oudeHead.x, oudeHead.y + 2*R);
                break;
            }
            case LEFT: {
                var nwHead = createSegmentHead(oudeHead.x - 2 * R, oudeHead.y);
                break;
            }
            case RIGHT: {
                var nwHead = createSegmentHead(oudeHead.x + 2 * R, oudeHead.y);
                break;
            }
        }
    // op de goede positie neerzetten, en eventueel laten groeien als er voedsel is opgegeten
        snake.segments.push(nwHead);
        if (!(nwHead.collidesWithOneOf(foods))) {
            snake.segments.shift();
        }
        else nwHead.removeFood(foods);
    };

    this.canMove = function (direction) {
        var headIndex=snake.segments.length-1;
        var head = snake.segments[headIndex];
        var canmove = true;
        switch (direction) { //variabele canmove bepalen obv direction en positie
            case UP: {
                if (head.y - 5 < YMIN) {
                canmove = false;
                }
            return canmove;
            break;
            }
            case DOWN: {
                if (head.y + 5 > yMax) {
                canmove = false;
                }
            return canmove;
            break;
            }
            case LEFT: {
                if (head.x - 5 < XMIN) {
                canmove = false;
                }
            return canmove;
            break;
            }
            case RIGHT: {
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
        var headIndex=snake.segments.length-1;
        var head = snake.segments[headIndex];
        var snakeZonderHead = snake.segments.slice(0,headIndex-1);
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
            collision = false;
            for (i=0; i < voedsel.length; i++) {
                if (Math.abs(this.x-voedsel[i].x) < 1.5 * R && Math.abs(this.y-voedsel[i].y) < 1.5 * R) {
                collision = true;
                }
            }
       return collision;
       };
       this.removeFood = function(voedsel) {
            for (i=0; i < voedsel.length; i++) {
                if (Math.abs(this.x-voedsel[i].x) < 1.5 * R && Math.abs(this.y-voedsel[i].y) < 1.5 * R) {
                voedsel.splice(i,1);
                }
            }
       //return collision;
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
  @function drawElement(element, canvas) -> void
  @desc Een element tekenen 
  @param {Element} element een Element object
  @param  {dom object} canvas het tekenveld
*/
function drawElement(element, canvas, context) {
    context.beginPath();
	context.arc(element.x, element.y, element.radius,0*Math.PI,2*Math.PI);
    context.fillStyle = element.color;
    context.fill();
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