var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var index = require('./routes/index');
var users = require('./routes/users');
var mongo = require('mongodb').MongoClient;

var app = express();

//Creating the server and attach to socket.io to that server
var serve = http.createServer(app);
var io = require('socket.io')(serve);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Setting up the port
app.set('port',process.env.PORT || 3000);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

//Lunching the server for listening
serve.listen(app.get('port'),function () {
  console.log('Express server listening on port '+ app.get('port'));
})


//Notify the server after every user connected
io.on('connection',function (socket) {
  console.log('user connected');
    console.log('Test ssh');


    //Database
    /*mongo.connect(process.env.CUSTOMCONNSTER_MONGOLAB_URI,function (err, db) {
        if(err)
        {
            Console.warn(err.message);
        }
        else
        {
            var collection = db.collection('test');
            var stream
        }
    })*/

  //Notify the server after every user disconnected
   socket.on('disconnect',function (socket) {
   console.log('user disconnected');
   });


});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
