var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var USER_NAMES = []; // create an empty array
var names=[];
var AYLIENTextAPI = require('aylien_textapi');
var textapi = new AYLIENTextAPI({
  application_id: "be8862f5",
  application_key: "873f2bb1ab151d51d050114c84018841"
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/login_page.html');
});

app.get('/index.html', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

    console.log('server '+socket.id);
    socket.on('my event connection',function(json){
        USER_NAMES[socket.id]=json['user_name'];
        console.log(USER_NAMES);
        names=[];
        for (var key in USER_NAMES)
            {
             names.push(USER_NAMES[key]);
             }
         io.emit('connect event',names)
    });
    socket.on('disconnect', function(){
        console.log('user disconnected');
        io.emit('chat message', USER_NAMES[socket.id]+' left the chat');
        delete USER_NAMES[socket.id]
        names=[];
        for (var key in USER_NAMES)
            {
             names.push(USER_NAMES[key]);
             }
        io.emit('connect event',names)
    });
    socket.on('chat message', function(json){
        name= USER_NAMES[socket.id];
        msg= json['message'];
        var feeling;
        var emoji;

        textapi.sentiment({
          'text': msg
            }, function(error, response) {
              if (error === null) {
                feeling=response['polarity'];
                if (feeling=='positive'){
                    emoji=":)";
                }
                if (feeling=='negative'){
                    emoji=":(";
                }
                if (feeling=='neutral') {
                    emoji=":|";
                }

                var msg_emoji= msg+ " "+emoji;

                var text=name +': '+msg_emoji;
                io.emit('chat message', text);

              }
        });
    });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});


