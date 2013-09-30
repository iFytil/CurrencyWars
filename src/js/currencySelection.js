var CurrencySelector = function(context){
	
	var thisMenu = this;
	
	thisMenu.selected = false;
	
	// Different Currencies: 
	thisMenu.options = [ {"name": "USD", "src": "../images/america.png"}, 
	                     {"name": "CAD", "src": "../images/canada.png"}, 
	                     {"name": "EUR", "src": "../images/europe.png"}
	                   ];
	
	thisMenu.init = function() {
	    // Load and draw all the images
	    for (var i = 0; i < thisMenu.options.length; i++) {
		    drawMe(i)
		}
		
		// Initialize event handling for the three Options: 
		var rects = [[125 + 300*(0), 80, 256, 200], [125 + 300*(1), 80, 256, 200], [125 + 300*(2), 80, 256, 200]];

        // Click detection
        $("#canvas").click(function(e) {
            if (!thisMenu.selected) {
                var x = e.offsetX,
                    y = e.offsetY;
                
                for(var i=0;i<rects.length;i++) {
                    if(x > rects[i][0]
                    && x < rects[i][0] + rects[i][2]
                    && y > rects[i][1]
                    && y < rects[i][1] + rects[i][3]) {
                        thisMenu.selectCurrency(i);
                        socket.emit("Currency Selected", {"currency": thisMenu.options[i].name});
                        thisMenu.selected = true;
                    }
                }
            }
        });
		
		socket.on("OpponentSelection", function(data) {
		    for (var i = 0; i < thisMenu.options.length; i++) {
		        if (data.currency === thisMenu.options[i].name) {
	                thisMenu.selectCurrency(i);
		        }
		    }
		});
		
		socket.on("StartMatch", function(data) {
		    changeState(state.gamePlay); 
		});
	};
	
	thisMenu.selectCurrency = function(i) {
	    context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.fillRect(125 + 300*(i), 80, 256, 200);
	}
	
	drawMe = function(i) {
	    var imageObj = new Image(); 
	    imageObj.src = thisMenu.options[i].src;
	    imageObj.onload = function() {
	        context.drawImage(this, 125 + 300*(i), 50);    
	    }
	}
	
	thisMenu.loop = function() {
		  thisMenu.Draw();
	};

	thisMenu.Draw = function() {
        
        
		context.fillStyle = "white"; 
		context.font = "22pt Arial"; 
		context.fillText("Select Your Currency!", width/3 + 50, 3*height/5);
		context.fillText("Vs.", width/3 + 175, 4*height/5);
		context.font = "40pt Arial"; 
		context.fillText("You", width/3 - 100, 4*height/5);
		context.fillText(opponent, width/3 + 300, 4*height/5);
	};
};