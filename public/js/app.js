var socket = io();

socket.on('connect', function(){
	console.log('Connected to socket.io server!');
});

socket.on('message', function(message){
	console.log(message.text);
	jQuery('.messages').append('<p> <strong>'+ moment.unix(message.timestamp).format('MMM Do YYYY, h:mma')+ '</strong>'  + ": " +message.text +  '</p>');
});

//Handles message submission

var $form = jQuery("#message-form");

$form.on('submit', function(event){

	event.preventDefault();
	socket.emit('message',{
		timestamp: moment().unix(),
		text: $form.find('input[name=message]').val()
	});

	$form.find('input[name=message]').val('');

});