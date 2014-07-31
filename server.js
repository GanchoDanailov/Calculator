/**
 * @author Gancho Danailov
 */

var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendfile('index.html');
});

//socket connection
io.on('connection', function(socket) {
	console.log('a user connected');

	//get parameters from client and send result
	socket.on('calculate', function(parm) {
		var firstInput = parseFloat(parm.firstInput);
		var operation = parm.operation;
		var secondInput = parseFloat(parm.secondInput);
		var result = calculate(firstInput, operation, secondInput);

		//Send result
		io.emit('result', result);
	});
});

function calculate(a, operator, b) {
	var result;
	
	if (!b)
	{
		return a;
	}
	
	switch (operator) {
		case "+":
			result = a + b;
			return checkNumberLn(result);
		case "-":
			result = a - b;
			return checkNumberLn(result);
		case "*":
			result = a * b;
			result = Math.round(result * 10000000000) / 10000000000;
			return checkNumberLn(result);
		case "/":
			if (b == 0)
				return "error";
			result = a / b;
			result = Math.round(result * 10000000000) / 10000000000;
			return checkNumberLn(result);
	}
}

function checkNumberLn(value) {
	var tmp = value.toString();

	if (tmp.indexOf(".") < 9 && tmp.indexOf(".") != -1 ) {
		while (tmp.length > 12) {
			tmp = tmp.slice(0, -1);
		}
		return parseFloat(tmp);
	}

	if (tmp.indexOf(".") > 10) {
		return "too much info";
	}

	if (tmp.length > 11) {
		return "too much info";
	} else {
		return tmp;
	}
}

http.listen(3000, function() {
	console.log('listening on *:3000');
});
