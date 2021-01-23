/**
* @module testbestand
*/

import * as environment from "./../environment.js";
import * as model from "./../model.js";
import * as presenter from "./../presenter.js";
import * as view from "./../view.js";
/**
* @name   inititialisatie game
* @desc   QUnit module om de initialisatie van de game te testen
*/
QUnit.module( "Het testen van initialisatie van de game" );
QUnit.test( "functie init()", function( assert ) {
	assert.expect(7);
	//testdata initialisatie
    presenter.init();
    var x = $("#mySnakeCanvas").width();
	var y = $("#mySnakeCanvas").height();
	//properties van het startscherm checken
	assert.equal(model.TESTING.getFoodsForTesting().length, environment.ENV_CONSTANTS.NUMFOODS, "check op aantal initiele voedseldeeltjes");
	assert.equal(model.TESTING.getFoodsForTesting()[0].color, environment.ENV_CONSTANTS.COLORS.FOOD, "kleur voedsel is groen");
	assert.equal(model.TESTING.getSnakeForTesting().getSegments().length, 2, "check op aantal initiele snakesegmenten");
	assert.equal(model.TESTING.getSnakeForTesting().getSegments()[1].color, environment.ENV_CONSTANTS.COLORS.HEAD, "snakehead is laatste element en kleur is orange");
	assert.equal(model.TESTING.getSnakeForTesting().getSegments()[0].color, environment.ENV_CONSTANTS.COLORS.SNAKE, "kleur van  snakebody is rood");
	assert.equal(model.TESTING.getSnakeForTesting().getSegments()[1].x, x/2 + 10, "x-coordinaat van de head van de startsnake staat midden op het canvas");
	assert.equal(model.TESTING.getSnakeForTesting().getSegments()[1].y, y/2 - 10, "y-coordinaat van de head van de startsnake staat midden op het canva");
});
/**
* @name Bewegen van de slang
* @desc QUnit module om het bewegen van de slang te testen
*
*/
QUnit.module( "Het testen van het bewegen van de slang" );
QUnit.test( "functie move()", function( assert ) {
    assert.expect(4);
    //testdata klaarzetten
    presenter.init();
    //verifieren of de snake kan bewegen en nog "leeft"
    assert.ok(model.TESTING.getSnakeForTesting().canMove("up"), "snake kan omhoog bewegen");
    assert.ok(model.TESTING.getSnakeForTesting().isAlive(), "en hij is alive");
    let initxCoordHead = model.TESTING.getSnakeForTesting().getSegments()[0].x;
    let inityCoordHead = model.TESTING.getSnakeForTesting().getSegments()[0].y;
    //laat de snake een stap omhoog bewegen
    model.TESTING.getSnakeForTesting().doMove("up");
    //en kijk of de coordinaten juist gewijzigd zijn
    assert.equal(model.TESTING.getSnakeForTesting().getSegments()[0].x,initxCoordHead , "bij een step up blijft de x-coordinaat gelijk");
    assert.equal(model.TESTING.getSnakeForTesting().getSegments()[0].y,inityCoordHead-20 , "bij een step up verminderd de y-coordinaat met 20");
});
/**
* @name Collision detectie
* @desc QUnit module om de collision tussen 2 segmenten te testen
*
*/
QUnit.module( "Het testen van een collision" );
QUnit.test( "functie collidesWithOneOf()", function( assert ) {
    //assert.expect(4);
    //testdata klaarzetten
    presenter.init();
    //kijk of een segment van de snake zelf botst met een zichzelf (zichzelf opeet)
    assert.ok(model.TESTING.getSnakeForTesting().getSegments()[0].collidesWithOneOf(model.TESTING.getSnakeForTesting().getSegments()), "een element van de snake zelf heeft (uiteraard) een collision met de snake");
    model.TESTING.getSnakeForTesting().segments.push(model.TESTING.createSnakeElementForTesting(190,190));
    //maak een element aan ver weg van de snake, en deze zou niet mogen colliden met de snake
    assert.notOk(model.TESTING.createSnakeElementForTesting(300,300).collidesWithOneOf(model.TESTING.getSnakeForTesting().getSegments()), "een element ver weg van de snake heeft geen collision met de snake");
});
/**
* @name Einde game
* @desc QUnit module om het einde van het spel te testen
*
*/
QUnit.module( "Het testen van het einde van de game" );
QUnit.test( "functie move()", function( assert ) {
    //testdata klaarzetten
    presenter.init();
    //beweeg de slang in een onmogelijke directie
    model.move("onzin_direction")
    //de getGameOver moet nu status false hebben
    assert.notOk(model.getGameOver(), "je verliest als er voedseldeeltjes zijn, maar niet meer kan bewegen");
    //set game terug in ongoing status
    model.TESTING.setGameOverForTesting(null);
    //hij kan nu weer bewegen
    model.move("up");
    //en nu zijn de voedseldeeltjes op. Dan heb je gewonnen!
    model.TESTING.setFoodsForTesting([]);
    assert.ok(model.TESTING.getFoodsForTesting().length === 0, "het aantal initiele voedseldeeltjes is nu 0");
    //beweeg de slang nu het voedsel op is
    model.move("up")
    //het voedsel is op, dus de gamestatus moet winst zijn
    assert.ok(model.getGameOver(), "je wint als de voedseldeeltjes op zijn");
    //En nog even checken of de setEndText en de draw() functie werkt (zie tespagina onderaan).
    view.setEndText("Einde test ...");
    view.draw(model.getElementsForDrawing());
});