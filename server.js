//require the express nodejs module
var express = require('express'),
	//set an instance of exress
	app = express(),
	//require the body-parser nodejs module
	bodyParser = require('body-parser'),
	//require the path nodejs module
	path = require("path");

//support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

//tell express that www is the root of our public web folder
app.use(express.static(path.join(__dirname, 'www')));

var request = require('request');

//tell express what to do when the /form route is requested
app.post('/form',function(req, res){
	res.setHeader('Content-Type', 'application/json');


    //mimic a slow network connection
	setTimeout(function(){

		var inputText = req.body.inputText;
        request.post({url:'https://tweet-analyzer-watson.mybluemix.net/analyze', form: {text: inputText}}, function(err,httpResponse,body){
        	var newData = JSON.parse(body);
        	console.log("Incoming Data from Watson: ", newData);

            var score = newData["score"];
            var positive = newData["positive"];
            var negative = newData["negative"];
            var tokens = newData["tokens"];

            res.send(JSON.stringify({
                score: score || "0",
                positive: positive || "",
								negative: negative || "",
								tokens: tokens || null
            }));
        });

	}, 1000);
});

//wait for a connection
app.listen(3000, function () {
  console.log('Server is running. Point your browser to: http://localhost:3000');
});
