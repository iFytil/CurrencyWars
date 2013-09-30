var Menu = function(context){

	var thisMenu = this;
	
	//define options
	thisMenu.options = ["lobby", "standings"];

	thisMenu.loop = function(){
		//update
		
		//draw
		for(var i =0; i< thisMenu.options.length; i++){
		
			if(thisMenu.highligted == i){
				context.fillStyle = "Red";
				context.font = "14pt Arial";
			}
			else {
				context.fillStyle = "White";
				context.font = "14pt Arial";
			}
			
			context.fillText(thisMenu.options[i], width/2 - i*20, (i+2)*height/5);
		}
		context.fillStyle = "White";
		context.font = "40pt Arial";
		context.fillText("Currency Wars!", width/3 + 20, 1*height/5);
	}

	thisMenu.init = function(){
	    
	     clear();
	
		//set highligted option
		thisMenu.highligted = 0 ;
		
		//event handlers
		window.addEventListener('keydown', initEvents,true);
		
		function initEvents(e){
		
			if(e.keyCode == 38)//up arrow
			{
				//previous option
				thisMenu.highligted = (thisMenu.highligted + thisMenu.options.length -1) % thisMenu.options.length;
					
			}
			if(e.keyCode == 40)//down arrow
			{
				thisMenu.highligted = (thisMenu.highligted + thisMenu.options.length +1) % thisMenu.options.length;
			}
			if(e.keyCode == 13)// enter key
			{
			    window.removeEventListener('keydown',initEvents,true);
				if(thisMenu.highligted == 0 ){
					changeState(state.lobby);
				}
				else if(thisMenu.highligted == 1){
					changeState(state.standings);
				}
			}
		}
		
	}
	
	
	return thisMenu;
	
}