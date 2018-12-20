'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dns= require('dns');
var app = express();

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });

var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
 
// parse application/json
app.use(bodyParser.json());

var cors = require('cors');



// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

var urls=[];
/*
var urlSchema = new mongoose.Schema({
  url: String,
  num_url: String
});
var Short_Url = mongoose.model('Short_Url',urlSchema);
*/

var urlSchema1 = new mongoose.Schema({
  url: String,
  num_url: Number
  
});
var Short_Url1 = mongoose.model('Short_Url1',urlSchema1);

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post("/api/shorturl/new", function (req, res) {
  const t_URL = new URL(req.body.url);
  let s_URL =req.body;
  dns.lookup(t_URL.hostname, (err) =>{
    if(!err) {
      Short_Url1.find({}, function(erro, resultado){
		    Short_Url1.create({url: req.body.url, num_url: resultado.length+1}, function(err, resul){
			    if(err){ console.log(err)}
			    console.log(resul)
			    res.json({original_url:resul.url,short_url: resul.num_url})
		    })
	    }); 
    }else{
      res.json({error: 'invalid URL'});
    }
  //res.redirect('/')
  });   
    
  /*
  urls.push(req.body.url)
  res.json({original_url: req.body.url, short_url: urls.length});
  console.log(urls)
  */
});

app.get("/api/shorturl/:url", function (req, res) {//redirecionar para a url 
  Short_Url1.findOne({num_url: req.params.url}, function(erro, resultado){
    	res.redirect(resultado.url)
    })
  //console.log(Number(req.params.url));
  //res.redirect(urls[Number(req.params.url)-1])
  
});
app.get("/api/shorturl/todas", function (req, res) {//redirecionar para a url 
  Short_Url1.find({}, function(erro, resultado){
    	if(erro){
    		console.log(erro)
    	}
    	res.json(resultado)
    	
    })
  
  
});

app.get('/apagar', function(req, res) {
    Short_Url1.deleteMany({}, function (err, resultado) {
    res.send(resultado)
    })
});
app.listen(port, function () {
  console.log('Node.js listening ...');
});