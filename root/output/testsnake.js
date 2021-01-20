import * as environment from "./environment.js";
import * as model from "./model.js";
import * as presenter from "./presenter.js";
import * as view from "./view.js";

QUnit.module( "Het testen van view module" );
QUnit.test( "functie setEndTekst", function( assert ) {
    assert.expect(1);
	assert.equal(view.setEndText("Gewonnen"), "Gewonnen", "check op eindtekst");
});

QUnit.module( "Het testen van de presenter module" );
QUnit.test( "functie createStartSnake()", function( assert ) {
//testdata
	assert.expect(5);
	presenter.init();
	assert.equal(model.foods.length, 5, "check op aantal initiele voedseldeeltjes");
	assert.equal(model.foods[0].color, "Olive", "kleur voedsel is groen");
	assert.equal(model.snake.segments.length, 2, "check op aantal initiele snakesegmenten");
	assert.equal(model.snake.segments[1].color, "DarkOrange", "snakehead is laatste element en kleur is orange");
	assert.equal(model.snake.segments[0].color, "DarkRed", "kleur van  snakebody is rood");
	//assert.equal(presenter.einde(true),"gewonnen","gewonnen weergegeven");
});
/*
QUnit.module( "Het testen van de model module" );

QUnit.test( "functie canmove", function( assert ) {
	presenter.init();
	//model.move(UP);
	//assert.expect(3);
    //var _new_head=10;
    var x = model.setDirection("UP");
    var y = model.setMovable("true");
    //model.snake.canMove("UP");
    //model.snake.doMove("UP");
	assert.equal(model.setInt(5),5, "gelijk getal");
	//assert.equal(model.createFoods().length,5, "lengte foods");
	assert.equal(model.foods.length,5, "lengte foods");
	assert.equal(model.move("UP"), 2, "move");
	//assert.equal(model.snake.move("UP"), 2, "move");
	//ougame.earnLife();
	assert.ok(model.setMovable("true"), "moveable");
	assert.equal(model.setDirection("UP"),"UP", "Direction = UP");
	//ougame.takeLife();
	//assert.ok(ougame.isDead(), "dood na takeLife");
});
/*
//QUnit.module( "Het testen van de presenter module" );
//QUnit.test( "functie createStartSnake()", function( assert ) {
//testdata
	presenter.init();
	//model.direction.UP;
	assert.expect(5);
	//<canvas id="mySnakeCanvas" width="360" height="360"></canvas>
    var canvas = $("#mySnakeCanvas");
	//assert.equal(model.setInt(5),5, "gelijk getal");
	//assert.equal(model.createFoods().length,5, "lengte foods");
	assert.equal(model.foods.length, 5, "aantal initiele voedseldeeltjes");
	assert.equal(model.foods[0].color, "Olive", "kleur voedsel is groen");
	assert.equal(model.snake.segments.length, 2, "aantal initiele snakesegmenten");
	assert.equal(model.snake.segments[1].color, "DarkOrange", "snakehead is laatste element en kleur is orange");
	assert.equal(model.snake.segments[0].color, "DarkRed", "kleur van  snakebody is rood");
	//assert.equal(model.snake.segments[0].radius,10 , "straal van de segmenten = 10");
	//assert.equal(model.foods[0].x, 10 , "x coordinaat food");
	assert.equal($(canvas).width, "360" , "breedte veld = 360");
	//ougame.earnLife();
	//assert.notOk(ougame.isDead(), "niet dood na earnLife");
	//ougame.takeLife();
	//assert.ok(model.snake.canMove(UP), "de slang kan bewegen");
});


*/