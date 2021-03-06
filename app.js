var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var index = require('./routes/index');
var users = require('./routes/users');
//  var userHandlers = require('../controllers/userController.js');
var mongo = require('mongodb').MongoClient;

var app = express();

//Creating the server and attach to socket.io to that server
var serve = http.createServer(app);
var io = require('socket.io')(serve);
var socket= io;
app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});
app.get('/edit', function(req, res){
    res.render('edit-form');
});

//app.route ('/auth/sign_in').post(userHandlers.signin)

app.get('/tasks',function (req,res) {
    mongo.connect('mongodb://zytododb:KYnL6Fy4uTAqwFKFid2srWmD9aqJyXhbhOWXA1ROwAPpmB5e2953yJmHT6rC30deQTgOuaQVPpg1hmqfNM4jXA==@zytododb.documents.azure.com:10255/?ssl=true&replicaSet=globaldb',function (err,db) {
        if(err)
        {
            console.warn(err.message);
        }
        else
        {
            db.collection("ToDoList").find({}).toArray(function(err, result) {
                if (err) throw err;
                db.collection("ToDoList").find({}).count(function (erreur, number) {
                    if(erreur) throw  erreur;
                    res.render('tasks',{ results : result, numbers:number});
                    console.log("commit");
                })
                db.close();

            });


        }
    })
})

app.get('/current',function (req,res) {
    mongo.connect('mongodb://zytododb:KYnL6Fy4uTAqwFKFid2srWmD9aqJyXhbhOWXA1ROwAPpmB5e2953yJmHT6rC30deQTgOuaQVPpg1hmqfNM4jXA==@zytododb.documents.azure.com:10255/?ssl=true&replicaSet=globaldb',function (err,db) {
            if(err)
        {
            console.warn(err.message);
        }
        else
        {
            var date = new Date();
            var month = date.getUTCMonth() + 1; //months from 1-12
            var day = date.getUTCDate();
            var year = date.getUTCFullYear();
            if(month.length!=2)
                month="0"+month;
            var newdate = year+"-"+month+"-"+day;
            db.collection("ToDoList").find({date:newdate}).toArray(function(err, result) {
                if (err) throw err;
                db.collection("ToDoList").find({date:newdate}).count(function (erreur, number) {
                    if(erreur) throw  erreur;
                    res.render('current',{ results : result, numbers:number});
                })
                db.close();
            });
        }
    })
})

app.use('/', index);
app.use('/users', users);


//Lunching the server for listening
serve.listen(app.get('port'),function () {
  console.log('Express server listening on port '+ app.get('port'));
})


//Notify the server after every user connected
io.on('connection',function (socket) {
  console.log('user connected');
  socket.on('save',function(Title,date,description) {
      //Database
      mongo.connect('mongodb://zytododb:KYnL6Fy4uTAqwFKFid2srWmD9aqJyXhbhOWXA1ROwAPpmB5e2953yJmHT6rC30deQTgOuaQVPpg1hmqfNM4jXA==@zytododb.documents.azure.com:10255/?ssl=true&replicaSet=globaldb',function (err, db) {
          if(err)
          {
              Console.warn(err.message);
          }
          else
          {
              var collection = db.collection('ToDoList');
              var list = '{ "Title":"' +
                  Title   +
                  '", "date":"' +
                date    +
                  '" , "description":"' +
                description +
                  '"}'
              var JSONList = JSON.parse(list)
              collection.insert(JSONList,function (err,o) {
                  if(err)
                  {
                      Console.warn(err.message);
                  }
                  else
                  {
                      console.log("list inserted into db OK");
                  }

              })
          }
      })
  })
  socket.on('update',function (oldTitle,oldDescription,newTitre,newDesc) {
      mongo.connect('mongodb://zytododb:KYnL6Fy4uTAqwFKFid2srWmD9aqJyXhbhOWXA1ROwAPpmB5e2953yJmHT6rC30deQTgOuaQVPpg1hmqfNM4jXA==@zytododb.documents.azure.com:10255/?ssl=true&replicaSet=globaldb',function (err, db) {
          if(err)
          {
              Console.warn(err.message);
          }
          else
          {
              var collection = db.collection('ToDoList');
              db.ToDoList.update({Titre:oldTitle,description:oldDescription},{ Titre: newTitre, description:newDesc },{ upsert: true });
              console.log('Updating');
              db.close();
          }
      })

  })

  //Notify the server after every user disconnected
   socket.on('disconnect',function (socket) {
   console.log('user disconnectedd');
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
