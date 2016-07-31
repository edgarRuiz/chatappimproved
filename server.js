var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection', function(socket) {
	console.log('User connected via socket.io');

	socket.on('disconnect' , function(){
		var userData = clientInfo[socket.id];

		if(typeof userData !== 'undefined'){	
			socket.leave(userData.room);
			socket.broadcast.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + " has left the room",
				timestamp: moment().unix()
			});
			delete clientInfo[socket.id];
		}

	});

	socket.on('joinRoom', function(req){
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name:'System',
			timestamp: moment().unix(),
			text: req.name + ' joined ' + req.room
		});
	});

	socket.on('message', function(message){
		console.log('Mesage received: ' + message.text);
		io.to(clientInfo[socket.id].room).emit('message', message);
	});

	socket.emit('message', {
		name: 'System',
		timestamp: moment().unix(),
		text: 'Welcome to chat app!'
	})

});

http.listen(PORT, function() {
	console.log('Server started');
});