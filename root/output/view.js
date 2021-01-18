"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canvas = exports.setEndText = exports.draw = void 0;
const model_1 = require("./model");
const environment_js_1 = require("./environment.js");
const presenter_1 = require("./presenter");
/***
De view is het zichtbare deel van de applicatie. In het geval van een
webapplicatie bestaat de view uit alle code die er voor zorgt dat de
DOM wordt aangepast. In dit geval is dat voornamelijk het canvas. De
view is passief. De view wordt door de presenter gevraagd om de DOM
te updaten, en krijgt daarvoor de gegevens mee. De view geeft events
van de gebruiker door aan de presenter zonder er zelf iets mee te doen.
***/
var endtext, canvas;
exports.canvas = canvas;
/***
Generieke eventhandlers
***/
$(document).ready(function () {
    $("#startSnake").click(presenter_1.init);
    $("#stopSnake").click(stop);
    jQuery(document).keydown(function (e) {
        switch (e.which) {
            case 37:
                presenter_1.changeDirection(environment_js_1.DIRECTIONS.LEFT);
                break;
            case 38:
                presenter_1.changeDirection(environment_js_1.DIRECTIONS.UP);
                break;
            case 39:
                presenter_1.changeDirection(environment_js_1.DIRECTIONS.RIGHT);
                break;
            case 40:
                presenter_1.changeDirection(environment_js_1.DIRECTIONS.DOWN);
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
    model_1.foods.forEach((item, i) => {
        drawElement(item, canvas);
    });
    model_1.snake.segments.forEach((item, i) => {
        drawElement(item, canvas);
    });
    if (endtext) {
        canvas.drawText({
            fillStyle: "#9cf",
            strokeStyle: "#25a",
            strokeWidth: 2,
            x: environment_js_1.xMax / 2, y: environment_js_1.yMax / 2,
            fontSize: 48,
            fontFamily: "Verdana, sans-serif",
            text: endtext
        });
    }
}
exports.draw = draw;
/**
@function drawElement(element, canvas) -> void
@desc Een element tekenen
@param {Element} element een Element object
@param  {dom object} canvas het tekenveld
*/
function drawElement(element, canvas) {
    canvas.drawArc({
        draggable: false,
        fillStyle: element.color,
        x: element.x,
        y: element.y,
        radius: element.radius
    });
}
function setEndText(t) {
    endtext = t;
}
exports.setEndText = setEndText;
