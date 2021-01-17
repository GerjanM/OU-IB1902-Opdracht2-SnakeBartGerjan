"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeDirection = exports.einde = exports.init = void 0;
const model_1 = require("./model");
const environment_1 = require("./environment");
const view_1 = require("./view");
/***
De presenter zit tussen het domein en de view in. De presenter bekijkt
de events die het via de view krijgt, en brengt op basis daarvan veran-
deringen in het model aan (door het aanroepen van methoden).
Met behulp van de terugkeerwaarden van die methoden en (eventueel)
met behulp van events die het model afvuurt, besluit de presenter hoe
de view moet worden ge-update.
***/
const SLEEPTIME = 500; // aantal milliseconde voor de timer
var snakeTimer;
/**
@function init() -> void
@desc Haal eventueel bestaand voedsel en een bestaande slang weg, cre\"eer
      een slang, genereer voedsel, en teken alles
*/
function init() {
    model_1.setFoods([]);
    environment_1.setWidth(view_1.canvas.width());
    environment_1.setHeight(view_1.canvas.height());
    environment_1.setXMax(environment_1.width - 2 * environment_1.R);
    environment_1.setYMax(environment_1.height - 2 * environment_1.R);
    model_1.createStartSnake();
    model_1.createFoods();
    view_1.draw();
    snakeTimer = setInterval(function () { model_1.move(model_1.direction); view_1.draw(); }, SLEEPTIME);
}
exports.init = init;
/**
@function einde() -> void
@desc stopt het spel een zet de eindtekst op winst of verlies
@param {boolean} winst: bepaalt de eindtekst: true is winst, false is verlies
*/
function einde(winst) {
    model_1.setDirection(environment_1.DIRECTIONS.UP);
    clearInterval(snakeTimer);
    if (winst) {
        view_1.setEndText("Victory!");
    }
    else {
        view_1.setEndText("Game Over!");
    }
}
exports.einde = einde;
function changeDirection(new_direction) {
    switch (new_direction) {
        case environment_1.DIRECTIONS.LEFT:
            if (model_1.direction != environment_1.DIRECTIONS.RIGHT && model_1.movable) {
                model_1.setDirection(new_direction);
                model_1.setMovable(false);
            }
            break;
        case environment_1.DIRECTIONS.UP:
            if (model_1.direction != environment_1.DIRECTIONS.DOWN && model_1.movable) {
                model_1.setDirection(new_direction);
                model_1.setMovable(false);
            }
            break;
        case environment_1.DIRECTIONS.RIGHT:
            if (model_1.direction != environment_1.DIRECTIONS.LEFT && model_1.movable) {
                model_1.setDirection(new_direction);
                model_1.setMovable(false);
            }
            break;
        case environment_1.DIRECTIONS.DOWN:
            if (model_1.direction != environment_1.DIRECTIONS.UP && model_1.movable) {
                model_1.setDirection(new_direction);
                model_1.setMovable(false);
            }
            break;
    }
}
exports.changeDirection = changeDirection;
