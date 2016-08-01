var socket = io();
var name = getQueryVariable('name') || 'Anon';
var room = getQueryVariable('room');

jQuery('.room').append(room);

socket.on('connect', function(){
	console.log('Connected to socket.io server!');
	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});

socket.on('message', function(message){
	console.log(message.text);
	var $messages = jQuery('.messages');
	var $message = jQuery('<li class="list-group-item"> </li>');
	$message.append('<p><strong>' +message.name + ' ' + moment.unix(message.timestamp).format('MMM Do YYYY, h:mma')+'</strong></p>');
	$message.append('<p>'  +message.text + '</p>');
	$messages.append($message);
});

//Handles message submission

var $form = jQuery("#message-form");

$form.on('submit', function(event){

	event.preventDefault();
	socket.emit('message',{
		name: name,
		timestamp: moment().unix(),
		text: $form.find('input[name=message]').val()
	});

	$form.find('input[name=message]').val('');

});