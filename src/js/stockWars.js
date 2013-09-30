//prototyping
var MenuObj = new Menu(context);
var LobbyObj = new Lobby(context);
var CurrencySelectorObj = new CurrencySelector(context);
var GamePlayLoop= new gamePlay(context);
var Standingsobj= new StandingsLoop(context);
var counter = 0;

var GameInit = function(){
	//init
	//choose state to int
	if (currentState == state.menu) {
		MenuObj.init();
	}
	else if (currentState == state.lobby) {
		LobbyObj.init();
	}
	else if (currentState == state.currencySelection) {
		CurrencySelectorObj.init();
	}
	else if (currentState == state.gamePlay) {
		GamePlayLoop.init();
	}
	else if (currentState == state.standings) {
		Standingsobj.init()
	}
	
	GameLoop();
}

var GameLoop = function() {

	//choose state
	if (currentState == state.menu) {
	
		MenuObj.loop();
	}
	else if (currentState == state.lobby) {
		LobbyObj.loop();
	}
	else if (currentState == state.currencySelection) {
		CurrencySelectorObj.loop();
	}
	else if (currentState == state.gamePlay) {
		GamePlayLoop.loop();
	}
	else if (currentState == state.standings) {
		Standingsobj.loop();
	}
	
	gameLoop = setTimeout(GameLoop, 1000/fps);
};

//Clears game loop, moves to next state and calls gameInit()
var changeState = function(nextState) {
    console.log("Changing State From: " + currentState + " to: " + nextState);
	clear();
	clearTimeout(gameLoop);
	currentState = nextState;
	GameInit();
};

var clear = function(){
  context.fillStyle = '#000000';
  
  context.beginPath();
  context.rect(0, 0, width, height);
  context.closePath();
  context.fill();
};

GameInit();

