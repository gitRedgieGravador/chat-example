var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');


var port = process.env.PORT || 3000;
var users = [];

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('chat message', function (msg) {
    users.forEach(element => {
      if(element.username == msg.username){
        msg = {username: msg.username, msg: msg.msg, source: element.source}
      }
    });
    io.emit('chat message', msg);
  });

  socket.on('online', function (msg) {
    if (!users.includes(msg.username)) {
      users.push(msg);
    }
    io.emit('online', users);
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});
