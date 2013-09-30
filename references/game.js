var width = 320, 
  height = 500,
  gLoop,
  bLoop,
  points=0,
  state = true;
  c = document.getElementById('c'), 
  ctx = c.getContext('2d');
      
  c.width = width;
  c.height = height;

  //sound
  var bgmusic = new Audio('piano.mp3');
  

var clear = function(){
  ctx.fillStyle = '#d0e7f9';
  
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.closePath();
  ctx.fill();
};

//clouds
var howManyCircles = 10, circles =[];
 for( var i=0; i<howManyCircles; i++)
 {
	//x,y,radius,transparency
	//math.random gets a num 0-1
	circles.push([Math.random() * width, Math.random() * height, Math.random() * 100, Math.random() / 2]);
 }
 
 var DrawCircles = function()
 {
	for(var i=0; i< howManyCircles; i++)
	{
		//fill with white with transparency
		ctx.fillStyle = 'rgba(255,255,255, ' + circles[i][3] + ')';

		//arc
		ctx.beginPath();
		//x,y,radius, theta
		ctx.arc(circles[i][0], circles[i][1],circles[i][2],0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
	}
 };
 
 //move circles
 var MoveCircles = function(deltaY)
 {
	for(var i=0; i < howManyCircles; i++)
	{
		//keep circle in bounds
		if(circles[i][1] - circles[i][2] > height)
		{
			circles[i][0] = Math.random() * width; //new x
			circles[i][2] = Math.random() * 100; //new radius
			circles[i][1] = 0-circles[i][2]; //start abv screen
			circles[i][3] = Math.random()/2; 
		}
		else
		{
			circles[i][1] += deltaY;
		}
	}
 };
 
 //player
 var player = new (function() {
	var that = this;
	that.image = new Image();
	that.image.src = "http://images.virtualdesign.pl/images/99444maluszek.png";
	
	that.width  =65;
	that.height = 95;
	
	that.X =0;
	that.Y=0;
	
	that.isJumping = false;
	that.isFalling = false;
	
	that.jumpSpeed =0;
	that.fallSpeed =0;
	
	//methods
	that.setPosition = function(x,y)
	{
		that.X =x;
		that.Y =y;
	}
	
	//jumping
	that.jump = function()
	{
		if(!that.isJumping && !that.isFalling)
		{
			that.fallSpeed = 0;
			that.isJumping = true;
			that.jumpSpeed = 17;
		}
	}
	
	that.checkJump = function() 
	{
		if(that.Y>height*0.4)
		{
			that.setPosition(that.X,that.Y-that.jumpSpeed);
		} else{
			if(that.jumpSpeed>10) points++;
			MoveCircles(that.jumpSpeed *0.5);
			platforms.forEach(function(platform,ind)
			{
				platform.y += that.jumpSpeed;
				
				if(platform.y > height)
				{
					var type = ~~(Math.random()*5);
					if(type ==0) type =1;
					else type =0;
					
					platforms[ind] = new Platform(Math.random()*
									(width-platformWidth),
									platform.y-height,
									type);
				}
			});
		}
		
		that.jumpSpeed--;
		
		if( that.jumpSpeed ==0)
		{
			that.isJumping = false;
			that.isFalling = true;
			that.fallSpeed = 1;
		}
	}
	
	that.checkFall = function()
	{
		if(that.Y < height - that.height)
		{
			that.setPosition(that.X,that.Y + that.fallSpeed);
			that.fallSpeed++;
		}else
		{
			if(points ==0)
				that.fallStop();
			else
				GameOver();
		}
	}
	
	that.fallStop = function()
	{
		that.isFalling = false;
		that.fallSpeed = 0;
		that.jump();
	}
	
	//movement
	that.moveLeft = function()
	{
		if(that.X>0)
		{
			that.setPosition(that.X - 10, that.Y);
		}
		else
		{
			that.X = width-that.width;
			that.setPosition(that.X,that.Y);
		}
	}
	
	that.moveRight = function()
	{
		if(that.X + that.width < width)
		{
			that.setPosition(that.X + 10, that.Y);
		}
		else
		{
			that.X = 0;
			that.setPosition(that.X,that.Y);
		}
	}
	
	//framing
	that.frames =1;
	that.actualFrame =0;
	that.interval =0;
	
	that.draw = function()
	{
		try{
			ctx.drawImage(that.image,0,that.height*that.actualFrame,
			that.width, that.height,
			that.X,that.Y, that.width, that.height);
			}
		catch(e)
		{};
		
		if(that.interval ==14)
		{
			if(that.actualFrame == that.frames)
			{
				that.actualFrame=0;
			}
			else
			{
				that.actualFrame++;
			}
			that.interval =0;
		}
		that.interval++;
	}
	})();
	
//platform class
var Platform = function(x,y,type)
{
	var that = this;
	
	that.firstColor = '#FF8C00';
	that.secondColor= '#EEEE00';
	that.onCollide = function()
	{
		player.fallStop();
	};
	
	//moving platforms
	that.isMoving = ~~(Math.random()*2);
	that.direction = ~~(Math.random()*2) ? -1:1;
	
	if(type ==1)
	{
		that.firstColor = '#AADD00';
		that.secondColor= '#698B22';
		that.onCollide = function()
		{
			player.fallStop();
			player.jumpSpeed = 50;
		};
	}
	
	that.x = ~~x;
	that.y = y;
	that.type = type;
	
	that.draw = function(){
		ctx.fillSyle = 'rgba(255,255,255,1)';
		var gradient = ctx.createRadialGradient(that.x+ (platformWidth/2),
		that.y +(platformHeight/2), 5,that.x +(platformWidth/2),that.y+
		(platformHeight/2),45);
		
		gradient.addColorStop(0,that.firstColor);
		gradient.addColorStop(1,that.secondColor);
		ctx.fillStyle = gradient;
		ctx.fillRect(that.x,that.y,platformWidth, platformHeight);
	};
	
	
	return that;
};

var nrOfPlatforms = 6,
platforms = [],
platformWidth = 70,
platformHeight= 20;

var generatePlatforms = function()
{
	var position = 0, type;
	
	for(var i=0;i<nrOfPlatforms;i++)
	{
		type = ~~(Math.random()*5);
		if(type ==0) type =1;
		else type = 0;
		
		platforms[i] = new Platform(Math.random()*(width-platformWidth),
		position,type);
		
		if(position < height - platformHeight)
			position += ~~(height/nrOfPlatforms);
	}
		
}();

//collision detect
var checkCollision = function()
{
	platforms.forEach(function(e,ind)
	{	
		if((player.isFalling) && 
			//only when player is falling
			(player.X < e.x + platformWidth) && 
			(player.X + player.width > e.x) && 
			(player.Y + player.height > e.y) && 
			(player.Y + player.height < e.y + platformHeight)
			//and is directly over the platform
			) 
		{
			e.onCollide();
		}
	})
}

//event handlers
document.onkeydown = function(e)
{
	if(e.keyCode == 37)//left arrow
	{
		player.moveLeft();
		
			
	}
	if(e.keyCode == 39)//right arrow
	{
		player.moveRight();
	}
	if(e.keyCode == 13)// enter key
	{
		if(state == false)
		{
			points=0;
			state = true;
			clearTimeout(bLoop);
			GameLoop();
		}
	}
}

document.onmousemove = function(e)
{
	if(e.webkitMovementX>0)
	{
		player.moveRight();
	}
	else if(e.webkitMovementX<0)
	{
		player.moveLeft();
	}
}
	
//~~ floors the float
player.setPosition(~~((width-player.width)/2),~~((height-player.height)/2));
player.jump();
 
 var GameLoop = function()
 {
	//update
	clear();
	MoveCircles(1);
	if(player.isJumping) player.checkJump();
	if(player.isFalling) player.checkFall();
	checkCollision();
	
	//draw
	DrawCircles();
	//draw platforms
	platforms.forEach(function(platform,index)
	{
		
		if(platform.isMoving)
		{
			if(platform.x<0)
			{
				platform.direction =1;
			}else if(platform.x>width - platformWidth)
			{
				platform.direction=-1;
			}
			
			platform.x += platform.direction *(index/2)* ~~(points/100);
		}
		platform.draw();
	});
	player.draw();
	
	//print points
	ctx.fillStyle = "Black";
	ctx.fillText("Points: "+points, 10, height-10);
	
	if(state)
		gLoop = setTimeout(GameLoop,1000/50);
 };
 
 var GameOver = function()
 {
	//set game state to false
	state = false;
	clearTimeout(gLoop);
	
	bLoop = setTimeout(function()
	{
		//wait for already called frames to be cleard
		clear();
		ctx.fillStyle = "Black";
		ctx.font = "10pt Arial";
		ctx.fillText("Game Over", width/2 - 60, height/2-50);
		ctx.fillText("Your Result: " + points, width/2-60, height/2-30);
		ctx.fillText("Press Enter to Restart", width/2-80, height/2+50);
		player.draw();
		
	},100);
 }
 
 GameLoop();
 
 //sound loop
 var soundLength = 15000;
 var soundLoop;
 var soundLoopfunc = function()
 {
	bgmusic.play();
	soundLoop = setTimeout(soundLoopfunc,soundLength);
 };
 soundLoopfunc();