var express    = require('express');
var app        = express();
var port       = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var passport   = require('passport');
var morgan     = require('morgan');
var path       = require('path');
var router     =  express.Router();
var appRoutes  = require('./app/routes/api')(router);

//Midle ware -- ORDER IS IMPORTANT
app.use(morgan('dev'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);
//Database
var mongoose = require('mongoose');

mongoose.connect('mongodb://Dmakius:betaSeeker15@ds137360.mlab.com:37360/workdemo', function(err){
  if(err){
    console.log("not connected to Database: " + err);
  }else{
    console.log("succesfully connected to database");
  }
});

app.get('*', function(req, res){
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, function() {
    console.log('Running the server on port ' + port); // Listen on configured port
});
