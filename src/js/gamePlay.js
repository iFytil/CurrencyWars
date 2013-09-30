var gamePlay = function(context){
    
    var thisGame = this;
 
        
    function initEvents(e){
            if(e.keyCode == 32)//space
            {
                var s = thisGame.myShip;
                thisGame.bulletsofOne.push(new Bullet(s.x + 150, s.y + 60, 10, 0));
                socket.emit("Fired", {});
            }
            if(e.keyCode == 37)//left arrow
            {
                thisGame.myShip.xvel = thisGame.myShip.xvel - 1;
                if(thisGame.myShip.xvel<-10){
                    thisGame.myShip.xvel = -10;
                }
            }
            if(e.keyCode == 38)//up arrow
            {
                thisGame.myShip.yvel = thisGame.myShip.yvel - 1;
    			if(thisGame.myShip.yvel < -10){
    			    thisGame.myShip.yvel=-10;
    			}
    			
    				
    		}if(e.keyCode == 39)//right arrow
    		{
    			thisGame.myShip.xvel = thisGame.myShip.xvel + 1;
    			if(thisGame.myShip.xvel > 10){
    			    thisGame.myShip.xvel =10;
    			}
    			
    				
    		}
    		if(e.keyCode == 40)//down arrow
    		{
    			thisGame.myShip.yvel = thisGame.myShip.yvel +1;
    			if(thisGame.myShip.yvel > 10){
    			    thisGame.myShip.yvel = 10;
    			}

    		}
    		if(e.keyCode == 13)// enter key
    		{
    			
    		}
    		
    		socket.on("OpponentFired", function(data) {
    		   var es = thisGame.enemyShip;
    		   thisGame.bulletsoftwo.push(new Bullet(es.x + 70, es.y + 60, -10, 0));
    		});
    		
    		socket.on("OpponentMoved", function(data) { 
    	        var es = thisGame.enemyShip;
                thisGame.enemyShip.x = width - data.x - thisGame.enemyShip.width;
                thisGame.enemyShip.y = data.y
    	    });
    		
		}
    
    thisGame.init = function(){
        thisGame.myShip     = new Ship( 50, 300, "../images/enterprise1.png");
        thisGame.barOne     = new HealthBar(0,0);
        thisGame.powerOne   = new PowerBar(0,0);
        thisGame.enemyShip  = new Ship(width - 500 , 300, "../images/enterprise.png");
        thisGame.barTwo     = new HealthBar(width/2,0);
        thisGame.powerTwo   = new PowerBar(width-25,0);

        thisGame.background = new Background();
        thisGame.bulletsofOne    = [];
        thisGame.bulletsoftwo    = [];
                 
        window.addEventListener('keydown', initEvents,true);
        
		
    }
    

    var hackyloopcount = 0;
    thisGame.loop = function(){
        hackyloopcount++;
        
        clear();

        if (hackyloopcount % 10 == 0) socket.emit("ShipMovement", {"x":thisGame.myShip.x ,"y":thisGame.myShip.y})
        
        thisGame.update();
        
        //draw components
        thisGame.background.draw();
        thisGame.myShip.draw();
        thisGame.enemyShip.draw();
        thisGame.barOne.draw();
        thisGame.barTwo.draw();
        thisGame.powerOne.draw();
        thisGame.powerTwo.draw();
        
        //update all bullets
        for(var i=0;i<thisGame.bulletsofOne.length;i++){
            thisGame.bulletsofOne[i].draw();
        }
        //update all bullets
        for(var i=0;i< thisGame.bulletsoftwo.length;i++){
            thisGame.bulletsoftwo[i].draw();
        }
        
        
    }
    
    thisGame.update = function () {
        
        thisGame.background.update();
        
        //collision detection
        if(false){
            //health bar decrease
        }
        
        //update ships
        thisGame.myShip.update();
        thisGame.enemyShip.update();
        
        //check for ships crossing bounds
        if(thisGame.myShip.x>width/2-thisGame.myShip.width){
            thisGame.myShip.x = width/2 - thisGame.myShip.width;
            thisGame.myShip.yvel =0;
        }
        if(thisGame.enemyShip.x<width/2){
            thisGame.enemyShip.x = width/2;
            thisGame.enemyShip.xvel =0;
        }
        
        //update all bullets
        for(var i=0;i<thisGame.bulletsofOne.length;i++){
            var b = thisGame.bulletsofOne[i];
            b.update();
            
            if(b.xpos>width || b.xpos <0 || b.ypos > height || b.ypos<0){
                thisGame.bulletsofOne.splice(i,1);
            }
        }
        
        //update all bullets
        for(var i=0;i< thisGame.bulletsoftwo.length ;i++){
            var b = thisGame.bulletsoftwo[i];
            b.update();
            
            if(b.xpos>width || b.xpos <0 || b.ypos > height || b.ypos<0){
                thisGame.bulletsoftwo.splice(i,1);
            }
        }
        
        //check collision bullet v ship
        for(var i=0;i<thisGame.bulletsoftwo.length;i++){
            var b = thisGame.bulletsoftwo[i];
            var s = thisGame.myShip;
            
            //distance sq < radius of ship?
            if(b.xpos < s.x && (b.ypos > s.y && b.ypos < s.y+s.height) ){
                thisGame.myShip.health = thisGame.myShip.health - Math.abs(b.xvel);   
                thisGame.barOne.decrease(-1*b.xvel);
                thisGame.bulletsoftwo.splice(i,1);
            }
        }
        
        for(var i=0;i<thisGame.bulletsofOne.length;i++){
            var b = thisGame.bulletsofOne[i];
            var s = thisGame.enemyShip;  
   
            //distance sq < radius of ship?
            if( b.xpos >s.x && (b.ypos > s.y && b.ypos < s.y+s.height)){
                thisGame.enemyShip.health = thisGame.enemyShip.health - Math.abs(b.xvel);  
                thisGame.barTwo.decrease(b.xvel);
                thisGame.bulletsofOne.splice(i,1);
            }
        }
        
        
        
        if(thisGame.myShip.health<=1){
            
            changeState(state.menu);
            thisGame.winner = "enemy";
            window.removeEventListener('keydown',initEvents,true);
        }
        else if(thisGame.enemyShip.health<=1){
            
            
            changeState(state.menu);
            thisGame.winner = "local";
            window.removeEventListener('keydown',initEvents,true);
        }
    }
    
    //define a ship 
    var Ship = function(xpos, ypos, imgSrc){
        var thisShip = this;
        
        thisShip.x =xpos;
        thisShip.y =ypos;
        thisShip.xvel= 0;
        thisShip.yvel= 0;
        
        thisShip.color = "red";
        thisShip.image = new Image();
        thisShip.image.src = imgSrc; 
        
        //health same number as health bar for easier math
        thisShip.health = width/2- width/8;
        
        thisShip.height = 75;
        thisShip.width = 250;
        
        
        thisShip.draw = function(){
       
            context.fillStyle = thisShip.color;
            //context.fillRect(thisShip.x, thisShip.y, thisShip.width, thisShip.height);
            context.drawImage(thisShip.image, thisShip.x, thisShip.y);
        }
        
        thisShip.update = function(){
            thisShip.x += thisShip.xvel;
            thisShip.y += thisShip.yvel;
            
            if(thisShip.x < 0){
                thisShip.x=0;
                thisShip.xvel =0;
            }
            if(thisShip.x> width-thisShip.width){
                thisShip.x = width-thisShip.width;
                thisShip.xvel =0;
            }
            
            if(thisShip.y<0){
                thisShip.y =0;
                thisShip.yvel =0;
            }
            
            if(thisShip.y>height - thisShip.height){
                thisShip.y = height - thisShip.height;
                thisShip.yvel =0;
            }
        }
        
    }
    
    var Bullet = function(xpos,ypos,xvel,yvel){
        var thisBullet = this;
        
        thisBullet.xpos = xpos;
        thisBullet.ypos = ypos;
        thisBullet.xvel = xvel;
        thisBullet.yvel = yvel;
        
        thisBullet.update = function(){
            thisBullet.xpos +=  thisBullet.xvel;
            thisBullet.ypos +=  thisBullet.yvel;
        }
        
        thisBullet.draw = function () {
            
            context.fillStyle = 'purple';
            context.font = "bold 14pt Impact"
            
            if(thisBullet.xvel>0){
                context.fillText('>',thisBullet.xpos,thisBullet.ypos);
            }
            else{
                context.fillText('<',thisBullet.xpos,thisBullet.ypos);    
            }
        }
        
        return thisBullet;
    }
    
    var Background = function(){
        var thisBg = this;
        thisBg.color = "Black";
        
        thisBg.numberOfStars = 25;
        thisBg.farStars=[];
        thisBg.closeStars=[];
        
        for(var i = 0; i< thisBg.numberOfStars;i++){
            thisBg.farStars.push(new star(Math.floor((Math.random()*width)+1),Math.floor((Math.random()*height)+1)));
            thisBg.closeStars.push(new star(Math.floor((Math.random()*width)+1),Math.floor((Math.random()*height)+1)));
        }
        
        thisBg.update = function(){
            //move stars
            for(var i=0;i<thisBg.numberOfStars;i++){
                thisBg.closeStars[i].x = thisBg.closeStars[i].x - 1;
                
                if(thisBg.closeStars[i].x < 0){
                    thisBg.closeStars[i].x = width;
                }
            }
        }
        
        thisBg.draw = function(){
            
            //draw close stars
            for(var i=0; i<thisBg.numberOfStars;i++){
                context.beginPath();
                context.fillStyle = "yellow";
                context.arc(thisBg.closeStars[i].x,thisBg.closeStars[i].y,4,0,2*Math.PI);
                context.arc(thisBg.farStars[i].x,thisBg.farStars[i].y,2,0,2*Math.PI);
                context.fill();
                context.stroke();
            }
            
        };
    };
    
    var star = function(xpos,ypos){
        var thisStar = this;
        
        thisStar.x  = xpos;
        thisStar.y = ypos;
        
        return thisStar;
        
    };
    
    var HealthBar = function(xpos,ypos){
        var thisBar = this;
        
        thisBar.x = xpos;
        thisBar.y = ypos;
        thisBar.width = 25;
        thisBar.length = width/2- width/8;
         
        thisBar.decrease = function(amount){
            thisBar.length = thisBar.length - amount;
            if(thisBar.length<1){
                thisBar.length = 1;
            }
        }
         
        thisBar.draw = function(){
            context.fillStyle = "green";
            context.fillRect(thisBar.x+width/16,thisBar.y,thisBar.length,thisBar.width);
        }
    }
    
    var PowerBar = function(xpos,ypos){
        var thisBar = this;
        
        thisBar.x = xpos;
        thisBar.y = ypos;
        thisBar.length = 25;
        thisBar.width = 10;
         
        thisBar.increase = function(amount){
            thisBar.length = thisBar.length + amount;
            if(thisBar.length > height/2){
                thisBar.length = height/2;
            }
        };
         
        thisBar.draw = function(){
            context.fillStyle = "red";
        };
    };
    
    return thisGame;
};
