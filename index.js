var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var USER_NAMES = []; // create an empty array
var AYLIENTextAPI = require('aylien_textapi');
var textapi = new AYLIENTextAPI({
  application_id: "be8862f5",
  application_key: "873f2bb1ab151d51d050114c84018841"
});

//textapi.sentiment({
//  'text': 'John is a very good football player!'
//}, function(error, response) {
//  if (error === null) {
//    console.log(response);
//    console.log(response['polarity']);
//  }
//});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/login_page.html');
});

app.get('/index.html', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//io.on('connection', function(socket){
//  console.log('a user connected');
//  socket.on('disconnect', function(){
//    console.log('user disconnected');
//  });
//});

io.on('connection', function(socket){

    console.log('server '+socket.id);
    socket.on('my event connection',function(json){
        USER_NAMES[socket.id]=json['user_name'];
        console.log(USER_NAMES);
        var names=[]
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


//app = Flask(__name__)
//app.config['SECRET_KEY'] = 'mysecret'
//socketio = SocketIO(app,cors_allowed_origins='*')
//
//client = textapi.Client("be8862f5", "873f2bb1ab151d51d050114c84018841")
//
//def messageReceived(methods=['GET', 'POST']):
//    print('message was received!!!')
//
//
//
//@socketio.on('my event message')
//def handle_my_custom_event(json, methods=['GET', 'POST']):
//	if str(json['message'])!='':
//		msg=json['message']
//		sentiment = client.Sentiment({'text': json['message']})['polarity']
//		if sentiment=='positive':
//			emoji=":)"
//		elif sentiment=='negative':
//			emoji=":("
//		else:
//			emoji=":|"
//		print('Message: ' + msg)
//		msg_emoji= msg+ " "+emoji
//		json['message']=msg_emoji
//		json['user_name']=USER_NAMES[json['user_id']]
//		socketio.emit('my response', json, callback=messageReceived)
//	print('received my event: ' + str(json))
//
//@socketio.on('my event connection')
//def handle_my_connection(json, methods=['GET', 'POST']):
//	//USER_NAMES[json['user_id']]=json['user_name']
//
//	USER_NAMES.push({
//    key:   "keyName",
//    value: "the value"
//    });
//
//	print('user_names dict',USER_NAMES)
//	socketio.emit('my response connection',USER_NAMES, callback=messageReceived)
//	print('received my event: ' + str(json))