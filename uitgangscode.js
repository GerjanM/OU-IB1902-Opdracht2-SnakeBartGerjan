const R  = 10,          // straal van een element
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
FOOD    = "Olive",       // kleur van voedsel
HEAD    = "DarkOrange"   // kleur van de kop van de slang

var snake,
foods = [],                                // voedsel voor de slang
width,                    // breedte van het tekenveld
height,                   // hoogte van het tekenveld
xMax,                     // maximale waarde van x = width - R
ymax,                     // maximale waarde van y = height - R
movable,                  // hulp-boolean die ervoor zorgt dat je maar \'e\'en
                          // keer een directie kunt opgeven in een interval.
direction = UP;

$(document).ready(function() {
  $("#startSnake").click(init);
  $("#stopSnake").click(stop);
  jQuery(document).keydown(function(e) {
    switch(e.which) {
      case 37:
      if (direction != RIGHT && movable){
        direction=LEFT;
        movable=false;
      }
      break;
      case 38:
      if (direction != DOWN && movable){
        direction=UP;
        movable=false;
      }
      break;
      case 39:
      if (direction != LEFT && movable){
        direction=RIGHT;
        movable=false;
      }
      break;
      case 40:
      if (direction != UP && movable){
        direction=DOWN;
        movable=false;
      }
      break;
    }
    e.preventDefault();
  });
});

/**
@function init() -> void
@desc Haal eventueel bestaand voedsel en een bestaande slang weg, cre\"eer
      een slang, genereer voedsel, en teken alles
*/
function init() {
  canvas = $("#mySnakeCanvas")
  foods = [];
  width = canvas.width();
  height = canvas.height();
  xMax = width - 2*R;
  yMax = height - 2*R;
  createStartSnake();
  createFoods();
  draw();
  snakeTimer = setInterval(function() {move(direction);}, SLEEPTIME);
}

function stop() {
  direction=UP;
  clearInterval(snakeTimer);
}
/**
@function move(direction) -> void
@desc Beweeg slang in aangegeven richting
tenzij slang uit canvas zou verdwijnen
@param   {string} direction de richting (UP, DOWN, LEFT of RIGHT)
*/
function move(direction) {
  //als het eten op is, hebben we gewonnen
  if(foods.length === 0) {
    endGame("Victory");
  } else if (snake.canMove(direction) && snake.isAlive()) {
    snake.doMove(direction);
    draw();
    //nu de move klaar is accepteren we weer nieuwe inputs van de gebruiker
    movable=true
  }
  else {
    endGame("Game Over");
  }
}

/**
@function draw() -> void
@desc Teken de slang en het voedsel
*/
function draw() {
  var canvas = $("#mySnakeCanvas").clearCanvas();
  foods.forEach((item, i) => {
    drawElement(item,canvas);
  });
  snake.segments.forEach((item, i) => {
    drawElement(item,canvas);
  });
}
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
    this.isAlive = function() {
      return this.lives;
    }
    //zet de kop van de slang op de juiste kleur
    this.segments[segments.length-1].color=HEAD;
    this.canMove = function(direction) {
      canMove = false;
      if (direction){
        //De beweging kan als het laatste segment (kop van slang) + step
        //binnen het canvas blijft
        _head = segments[segments.length-1]
        switch(direction) {
          case UP:
          canMove = _head.y - STEP >= 0;
          break;
          case RIGHT:
          canMove = _head.x + STEP <= xMax;
          break;
          case DOWN:
          canMove = _head.y + STEP <= yMax;
          break;
          case LEFT:
          canMove = _head.x - STEP >= 0;
          break;
        }
      }
      return canMove;
    };
    //bepaal nieuw hoofd, kleur
    this.doMove = function (direction) {
      if (direction){
        //pass by reference
        _head = segments[segments.length-1]
        switch(direction) {
          case UP:
          _new_head = createSegment(_head.x, (_head.y - STEP));
          break;
          case RIGHT:
          _new_head = createSegment((_head.x + STEP), _head.y);
          break;
          case DOWN:
          _new_head = createSegment(_head.x, (_head.y + STEP));
          break;
          case LEFT:
          _new_head = createSegment((_head.x - STEP), _head.y);
          break;
        }
        //_head is nu body, zet hem op de juiste kleur
        _head.color = SNAKE;
        //geef _new_head de juiste kleur en voeg toe aan de slang
        _new_head.color = HEAD;
        //controleer of we niet in onze staart bijten
        this.segments.forEach((item, i) => {
          if(detectCollision(item, _new_head)){
            this.lives = false;
            //bijt de rest van de staart eraf
            this.segments.splice(0,i);
          }
        });
        //voeg de kop toe.
        this.segments.push(_new_head);
        //zet een tijdelijke variabele, zodat we niet los op collisions
        //hoeven te zoeken
        _remove_tail = true
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
  /**
  @constructor Element
  @param radius straal
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaat middelpunt
  @param {string} color kleur van het element
  @param {function} prototype.collidesWithOneOf(arguments) bepaalt of iets uit
          de lijst gelijke waarde en type heeft voor de x en y co\"ordinaten
  */
  function Element(radius, x, y, color) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.color = color;
  }
  // verplaatst naar prototype, omdat het een gedeelde functie is
  Element.prototype.collidesWithOneOf = function(arguments) {
    noGelijken = 0;
    if (arguments) {
      arguments.forEach((item, i) => {
        //controleer niet op co\"ordinaat inclusief de radius
        if (detectCollision(item, this)) {
          noGelijken++
        }
      });
    }
    return noGelijken > 0;
  }
  /***************************************************************************
  **                 Hulpfuncties                                          **
  ***************************************************************************/
  /**
  @function detectCollision(a,b)
  @desc controleert of twee elementen overlappende x en y co\"ordinaten hebben
  @param {Element} a eerste element voor de vergelijking
  @param {Element} b tweede element voor de vergelijking
  @return: true als hun co\"ordinaten overlappen, false wanneer dat niet zo is.
  */
  function detectCollision(a, b) {
    return a.x >= b.x-R && a.x <= b.x+R && a.y >= b.y -R && a.y <= b.y + R
  }


  /**
  @function createStartSnake() -> Snake
  @desc Slang creëren, bestaande uit  twee segmenten,
  in het midden van het veld
  @return: slang volgens specificaties
  */
  function createStartSnake() {
    var segments   = [createSegment(R + width/2, R + height/2),
      createSegment(R + width/2, height/2 - R)];
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
    function drawElement(element, canvas) {
      canvas.drawArc({
        draggable : false,
        fillStyle : element.color,
        x : element.x,
        y : element.y,
        radius : element.radius
      });
    }

    /**
    @function getRandomInt(min: number, max: number) -> number
    @desc Creeren van random geheel getal in het interval [min, max]
    @param {number} min een geheel getal als onderste grenswaarde
    @param {number} max een geheel getal als bovenste grenswaarde (max > min)
    @return {number} een random geheel getal x waarvoor geldt: min <= x <= max
    */
    function getRandomInt(min, max) {
      return Math.floor((Math.random() * (max - min + 1) + min)/STEP)*STEP;
    }

    /**
    @function createFoods() -> array met food
    @desc [Element] array van random verdeelde voedselpartikelen
    @return [Element] array met food
    */
    function createFoods() {
      var  i = 0,
      food;
      //we gebruiken een while omdat we, om een arraymethode te gebruiken,
      //eerst een nieuw array zouden moeten creëren (met NUMFOODS elementen)
      while (i < NUMFOODS ) {
        food = createFood(
          XMIN + getRandomInt(0, xMax),
          YMIN + getRandomInt(0, yMax)
        );
        if (
            !food.collidesWithOneOf(snake.segments)
              &&
            !food.collidesWithOneOf(foods)
            ) {
          foods.push(food);
          i++
        }
      }
    }

    function endGame(endtext) {
      stop();
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
