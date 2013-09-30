var Lobby = function(context){
	
	var thisLobby = this;

	thisLobby.init = function() {
        console.log("Lobby.init() called!");
        
		// Tell server you're single
		socket.emit("RequestMatch", {"data": "Unecessary"});
		
		// Wait for server Matching
		socket.on("MatchFound", function(data){ 
			//TODO Display Match Occured
            
            opponent = data.opponent;
			changeState(state.currencySelection);
		});
	};
	
	thisLobby.loop = function() {
        console.log("Lobby.loop() called!");
		thisLobby.draw();
	};
	
	thisLobby.draw = function() {
		context.fillStyle = "White";
		context.font = "10pt Arial";
			
		context.fillText("Waiting...", width/2 - 20, height/2);
	};
	
	
};
