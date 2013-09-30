var StandingsLoop = function(context){
    
    var standingsMenu = this;
    
    standingsMenu.init = function(){
        
        //go back to menu on enter
        window.addEventListener('keydown', initEvents,true);
		function initEvents(e){
			if(e.keyCode == 13)// enter key
			{
			    window.removeEventListener('keydown',initEvents,true);
				changeState(state.menu);
				
			}
		}
        
        // for(var i = 0; i < thisMenu.options; i++){
        //     var score;
        //     // get scores for each currency
        //     // TODO
        //     score = Math.floor(Math.random() * 10000);
        //     console.log(standingsMenu.scores);
        // }
    }
    
    
    standingsMenu.loop = function(){
		clear();
		context.fillStyle = "White";
		context.font = "40pt Arial";
		context.fillText("Currency Wars Standings!", width/3 - 200, 200);
		context.fillText("Canadian Dollar: 0", width/3 - 200, 300);
		context.fillText("American Dollar: 0", width/3 - 200, 400);
		context.fillText("The Euro: 0", width/3 - 200, 500);
	}
    
	
	return standingsMenu;
}
