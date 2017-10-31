var express = require('express');
var msgLog = [];
var lastMessage;

var app = express();
var server = app.listen(3000);
console.log('Listening on port 3000');

app.use(express.static('public'));

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
  console.log('New Connection: ' + socket.id);
  socket.emit('log', msgLog);
  io.sockets.emit('newUser');
  socket.on('newMessage', emitMsg);

  function emitMsg(data){
  	socket.username = data.usrName;
    console.log(data);
    msgLog.push(data);
    if(lastMessage !== data.msg){
    	io.sockets.emit('newMsg', data);
	} else {
		console.log('Spam blocked');
	}
	lastMessage = data.msg;
  }

  socket.on('disconnect', function(){
    if(socket.username == ''){
      io.sockets.emit('usrLeft', socket.id);
    } else {
      io.sockets.emit('usrLeft', socket.username);
    }
    console.log('Connection lost to: ' + socket.id);
  });
}
