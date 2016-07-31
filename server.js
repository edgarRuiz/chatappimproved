var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
	console.log('User connected via socket.io');

	socket.on('message', function(message){
		console.log('Mesage received: ' + message.text);
		io.emit('message', message);
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