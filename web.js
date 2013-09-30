//lib to give all static files to client
var express = require("express");
var request = require("request");

var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);
  
app.use(express.static(__dirname + '/src'));
server.listen(process.env.PORT, process.env.IP);

io.set('log level', 1);

var uniqueId = 0;

var clients = {};
var playersWaiting = [];
io.sockets.on('connection', function(socket) {
    
  socket.on('set username', function(userName) {
      
    userName = userName + uniqueId++;
      
    console.log("Player " + userName + " joined...");  
      
    clients[socket.id] = {};
    clients[socket.id].username = userName;
    userJoined(userName);
    
    console.log(clients)
  });
  
  // Client is looking to match-make!
  socket.on("RequestMatch", function(data) {
        playersWaiting.push(socket.id);
        console.log("Players MatchMaking: " + playersWaiting.length);
        if (playersWaiting.length >= 2) { 
            
            var playerOne = playersWaiting.pop();
            var playerTwo = playersWaiting.pop();
            
            console.log("Matching " + clients[playerOne].username + " vs " + clients[playerTwo].username);
            
            clients[playerOne].opponent = playerTwo;
            clients[playerTwo].opponent = playerOne;
            
            io.sockets.sockets[playerOne].emit("MatchFound", {"opponent": clients[playerTwo].username});
            io.sockets.sockets[playerTwo].emit("MatchFound", {"opponent": clients[playerOne].username});
        }
  });
  
  socket.on("Currency Selected", function(data) {
     clients[socket.id].currency = data.currency;
     io.sockets.sockets[clients[socket.id].opponent].emit("OpponentSelection", {"currency": data.currency});
     if (clients[clients[socket.id].opponent].currency) {
         // Sign up to Oanda
         
         // TODO: Sign up
         
         // Both are ready
         io.sockets.sockets[socket.id].emit("StartMatch", {});
         io.sockets.sockets[clients[socket.id].opponent].emit("StartMatch", {});
         
     }
  });
  
  socket.on("Fired", function(data) {
      if (!clients[socket.id] || !clients[socket.id].opponent) return;
      io.sockets.sockets[clients[socket.id].opponent].emit("OpponentFired", {});
  })
  
  socket.on("ShipMovement", function(data) {
      if (!clients[socket.id] || !clients[socket.id].opponent) return;
      io.sockets.sockets[clients[socket.id].opponent].emit("OpponentMoved", {"x": data.x, "y": data.y});
  })
  
  socket.on('disconnect', function() {

    for (var i = 0; i < playersWaiting.length; i++) {
        if (playersWaiting[i] == socket.id) {
            playersWaiting.splice(i, 1);
        }
    }

    if (clients[socket.id]) {
        var uName = clients[socket.id].username;
        delete clients[socket.id];
        
        console.log("User " + uName + " has left the world...");
     
        userLeft(uName); 
    }
  });
 
 socket.on('requestData', function (data) {
    request("http://api-sandbox.oanda.com/v1/history?instrument=CAD_JPY&count=30&granularity=S30&candleFormat=midpoint", function(error, response, body) {
      io.sockets.emit('serveData', body);
    });
  });
});
 
function userJoined(uName) {
    Object.keys(clients).forEach(function(sId) {
      io.sockets.sockets[sId].emit('userJoined', { "userName": uName });
    })
};
 
function userLeft(uName) {
    io.sockets.emit('userLeft', { "userName": uName });
}