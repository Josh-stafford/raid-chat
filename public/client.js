var socket;
var name;
socket = io.connect('http://172.20.12.94:3000');

console.log('working');

socket.on('newMsg', showMessage);
socket.on('log', loadMessages);
socket.on('newUser', newUser);
socket.on('usrLeft', userLeft);

var messageBox;

function userLeft(data){
	console.log('User left');
	messageBox = document.getElementById('messageBox');
	messageBox.innerHTML =  data + " HAS DISCONNECTED<br/><hr><br/>" + messageBox.innerHTML;
}

function newUser(){
	console.log('New user');
	messageBox = document.getElementById('messageBox');
	messageBox.innerHTML =  "A NEW USER HAS CONNECTED<br/><hr><br/>" + messageBox.innerHTML;
}

function loadMessages(data){
	messageBox = document.getElementById('messageBox');
	for(var i = 0; i < data.length; i++){
		console.log('Loading message');
		messageBox.innerHTML = data[i].usrName + ": " + data[i].msg + "<br/><hr><br/>" + messageBox.innerHTML;
	}
}

function sendMessage(){
	console.log('sending');
	data = {
		usrName : name,
		msg : document.getElementById('message').value
	}
	socket.emit('newMessage', data);
	messageBox = document.getElementById('messageBox');
	messageBox.innerHTML = data.usrName + ": " + data.msg + "<br/><hr><br/>" + messageBox.innerHTML;
	document.getElementById('message').value = '';
}

function showMessage(data){
	if(data.usrName !== name){
		console.log(data.usrName + ": " + data.msg);
		messageBox = document.getElementById('messageBox');
		messageBox.innerHTML = data.usrName + ": " + data.msg + "<br/><hr><br/>" + messageBox.innerHTML;
		if(document.hidden && data.msg != ''){
			notifyMe((data.usrName + ": " + data.msg));
		}
	}
}

function setName(){
	name = document.getElementById('name').value;
	console.log(name);
	document.getElementById('topSection').innerHTML = 'Username: ' + name;
}

document.addEventListener('DOMContentLoaded', function () {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

function notifyMe(data) {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('New Message', {
      //icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
      body: data,
    });

    notification.onclick = function () {
      window.open("http://172.20.12.94:3000");      
    };

  }

}
