import { createFoods, createStartSnake, foods, snake, direction, removeFood } from "./model.js";
import { setWidth, setHeight, setXMax, setYMax, R, width, height } from "./environment.js";
import { draw, canvas } from "./view.js";
/***
De presenter zit tussen het domein en de view in. De presenter bekijkt
de events die het via de view krijgt, en brengt op basis daarvan veran-
deringen in het model aan (door het aanroepen van methoden).
Met behulp van de terugkeerwaarden van die methoden en (eventueel)
met behulp van events die het model afvuurt, besluit de presenter hoe
de view moet worden ge-update.
***/
var SLEEPTIME = 500; // aantal milliseconde voor de timer
var snakeTimer;
/**
@function init() -> void
@desc Haal eventueel bestaand voedsel en een bestaande slang weg, cre\"eer
      een slang, genereer voedsel, en teken alles
*/
function init() {
    setWidth(canvas.width); // breedte van het tekenveld
    setHeight(canvas.height); // hoogte van het tekenveld
    setXMax(width - 2 * R); // maximale waarde van x = width - R
    setYMax(height - 2 * R); // maximale waarde van y = height - R
    createStartSnake();
    createFoods();
    draw();
    // laat de slang bewegen
    snakeTimer = setInterval(function () {
        move(direction);
    }, SLEEPTIME);
}
function stop() {
    //direction=DIRECTONS.UP;
    clearInterval(snakeTimer);
}
/**
@function move(direction) -> void
@desc Beweeg slang in aangegeven richting
tenzij slang uit canvas zou verdwijnen
@param   {string} direction de richting (UP, DOWN, LEFT of RIGHT)
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
        removeFood();
        draw();
    }
    else {
        console.log("snake cannot move " + direction);
    }
}
export { init, stop, move };
