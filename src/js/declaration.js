var state =  {"menu": 0, 
			  "lobby": 1, 
			  "currencySelection": 2,
			  "gamePlay": 3, 
			  "standings": 4} 
		    ;

var currentState = state.menu;
var width = 1100;
var height = 600; 
var gameLoop;
var fps = 30;
var canvas = document.getElementById("canvas");
	canvas.width = width;
	canvas.height = height;
var context = canvas.getContext("2d");


