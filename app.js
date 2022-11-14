'use strict'

var express = require('express');
var bodyParse = require('body-parser');

var app = express();

var user_routes = require('./routes/user')
var artist_routes = require('./routes/artist')
var album_routes = require('./routes/album')


app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());

app.use('/api',user_routes);
app.use('/api',artist_routes);
app.use('/api',album_routes);


app.get('/pruebas', function(req,res){
	res.status(200).send({message:'bienvenido al curso'})
});

module.exports = app;
