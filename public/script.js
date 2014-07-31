var calc = null;

window.onload = function() {
	calc = new Calculator();
};
function Calculator() {
	this.data = {
		firstInputValue : '0',
		secondInputValue : '0',
		operation : null,
		isOperationInput : false,
		tmpValue : [],
		socket : io()
	};

	this._buttonContainer = null;

	//create input
	this.createInput();
	//create help area
	this.createHelpArea();
	// create container
	this.createContainer();

	// create buttons
	this.createButtons();

	//get result and set it in the input tag
	this.data.socket.on('result', this.onResult.bind(this));

	document.getElementById('calculator').appendChild(this._input);
	document.getElementById('calculator').appendChild(this._helpArea);
	document.getElementById('calculator').appendChild(this._buttonContainer);

	//catch kayup event;
	document.addEventListener('keyup', this.keyCheck.bind(this));

}

Calculator.prototype.plusOp = function() {
	if (this.data.isOperationInput) {
		return;
	}
	this.data.firstInputValue = input.getValue();
	this.data.operation = "+";
	this.setHelperInfo(this.data.firstInputValue + " " + this.data.operation);
	this.data.tmpValue = [];
	input.setValue("");
	this.data.isOperationInput = true;

};
Calculator.prototype.minusOp = function() {

	if (input.getValue() == "" && (this.data.firstInputValue.length == 1 || this.data.secondInputValue.length == 1)) {
		this.concatenateInput(this.data.isOperationInput, "-");

	} else {
		this.data.operation = "-";
		this.data.isOperationInput = true;
		this.data.firstInputValue = input.getValue();
		this.setHelperInfo(this.data.firstInputValue + " " + this.data.operation);
		this.data.tmpValue = [];
		input.setValue("");
	}

};
Calculator.prototype.timesOp = function() {
	if (this.data.isOperationInput) {
		return;
	}
	this.data.firstInputValue = input.getValue();
	this.data.operation = "*";
	this.setHelperInfo(this.data.firstInputValue + " " + this.data.operation);
	this.data.tmpValue = [];
	input.setValue("");
	this.data.isOperationInput = true;
};

Calculator.prototype.obelusOp = function() {
	if (this.data.isOperationInput) {
		return;
	}
	this.data.firstInputValue = input.getValue();
	this.data.operation = "/";
	this.setHelperInfo(this.data.firstInputValue + " " + this.data.operation);
	this.data.tmpValue = [];
	input.setValue("");
	this.data.isOperationInput = true;
};

Calculator.prototype.equalOp = function() {
	var parm = {};

	if (!this.data.isOperationInput) {
		return;
	} else if (this.data.firstInputValue == "") {
		this.data.firstInputValue = 0;
	}

	this.data.secondInputValue = input.getValue();
	this.setHelperInfo(this.data.firstInputValue + " " + this.data.operation + " " + this.data.secondInputValue);
	parm.firstInput = this.data.firstInputValue;
	parm.secondInput = this.data.secondInputValue;
	parm.operation = this.data.operation;

	//send parameters to the server
	this.data.socket.emit('calculate', parm);

	//clean
	this.cleanValues();
};

Calculator.prototype.onResult = function(result) {
	console.log(result);
	input.setValue(result);
};

Calculator.prototype.keyCheck = function() {

	var KeyID = event.keyCode;

	if (KeyID == 107) {
		//oepration +
		this.plusOp();

	} else if (KeyID == 32) {
		return;
	} else if (KeyID == 109) {
		//operation -
		this.minusOp();

	} else if (KeyID == 106) {
		//operation *
		this.timesOp();

	} else if (KeyID == 111) {
		//operation /
		this.obelusOp();

	} else if (KeyID == 110 || KeyID == 190 || KeyID == 188) {
		// .
		this.concatenateInput(this.data.isOperationInput, '.');
	} else if (KeyID == 13) {
		//operation =
		this.equalOp();
	} else if (KeyID == 46 || KeyID == 27) {
		// ce
		//clean
		this.cleanValues();
		this.setHelperInfo("");
	} else if (KeyID == 8) {
		//nbs

	} else if (((KeyID > 95) && (KeyID < 106)) || ((KeyID > 47) && (KeyID < 58))) {
		var key;
		if (KeyID > 95 && KeyID < 106) {
			key = (KeyID - 96).toString();
		} else if (KeyID > 47 && KeyID < 58) {
			key = (KeyID - 48).toString();
		}
		this.concatenateInput(this.data.isOperationInput, key);
	}
	return true;
};

Calculator.prototype.setHelperInfo = function(value) {
	this._helpArea.innerHTML = value;
};

Calculator.prototype.onClick = function(event) {
	var btnValue = event.target.textContent;

	switch (btnValue) {
		case '/':
			this.obelusOp();
			break;
		case 'x' :
			this.timesOp();
			break;
		case '+' :
			this.plusOp();
			break;
		case '-':
			this.minusOp();
			break;
		case '=':
			this.equalOp();
			break;
		default :
			this.concatenateInput(this.data.isOperationInput, btnValue);
			break;
	}
};

Calculator.prototype.createContainer = function() {
	this._buttonContainer = document.createElement('div');
	this._buttonContainer.id = 'btnContainer';
};

Calculator.prototype.createHelpArea = function() {
	this._helpArea = document.createElement('div');
	this._helpArea.id = 'currentValues';
};

Calculator.prototype.createButtons = function() {
	var callback = this.onClick.bind(this);

	this._buttons = [];
	this._buttons.push(new Button('7', callback, this._buttonContainer));
	this._buttons.push(new Button('8', callback, this._buttonContainer));
	this._buttons.push(new Button('9', callback, this._buttonContainer));
	this._buttons.push(new Button('/', callback, this._buttonContainer));
	this._buttons.push(new Button('4', callback, this._buttonContainer));
	this._buttons.push(new Button('5', callback, this._buttonContainer));
	this._buttons.push(new Button('6', callback, this._buttonContainer));
	this._buttons.push(new Button('x', callback, this._buttonContainer));
	this._buttons.push(new Button('1', callback, this._buttonContainer));
	this._buttons.push(new Button('2', callback, this._buttonContainer));
	this._buttons.push(new Button('3', callback, this._buttonContainer));
	this._buttons.push(new Button('-', callback, this._buttonContainer));
	this._buttons.push(new Button('0', callback, this._buttonContainer));
	this._buttons.push(new Button('.', callback, this._buttonContainer));
	this._buttons.push(new Button('=', callback, this._buttonContainer));
	this._buttons.push(new Button('+', callback, this._buttonContainer));
};

Calculator.prototype.createInput = function() {
	this._input = document.createElement('div');
	this._input.id = 'inputNumber';
	input = new InputField(this._input.id);
};

Calculator.prototype.concatenateInput = function(isOperationInput, value) {
	if (!isOperationInput) {
		if (this.data.firstInputValue.length == 1 && value == "-") {

			this.data.tmpValue.push(value);

		} else if (this.data.firstInputValue.length < 10 && value != "-") {

			this.data.tmpValue.push(value);

		}
		this.data.firstInputValue = this.data.tmpValue.join("");
		input.setValue(this.data.firstInputValue);
	} else {
		if (this.data.secondInputValue.length < 10) {

			this.data.tmpValue.push(value);

		} else if (this.data.secondInputValue == 1 && this.data.operation == "-") {

			this.data.tmpValue.push(value);

		}
		this.data.secondInputValue = this.data.tmpValue.join("");
		input.setValue(this.data.secondInputValue);
	}
};

Calculator.prototype.cleanValues = function() {
	input.setValue("");
	this.data.firstInputValue = '0';
	this.data.secondInputValue = '0';
	this.data.operation = "";
	this.data.tmpValue = [];
	this.data.isOperationInput = false;
};

function InputField(id) {
	this.id = id;
}

InputField.prototype.getValue = function() {
	return document.getElementById(this.id).innerHTML;
};

InputField.prototype.setValue = function(value) {
	document.getElementById(this.id).innerHTML = value;
};

function Button(text, cb, container) {
	this._pressed = false;
	this._text = text;
	this._callbacks = {
		select : cb,
		down : this._onDown.bind(this),
		up : this._onUp.bind(this),
		leave : this._onLeave.bind(this)
	};
	this._container = container;
	this._element = document.createElement('div');
	this.setText(text);
	this._element.className = 'btnCalc';
	this._element.innerText = this._text;
	this._element.addEventListener('click', this._callbacks.select);
	this._element.addEventListener('mousedown', this._callbacks.down);
	this._container.appendChild(this._element);
}

Button.prototype.setText = function(text) {
	this._element.innerText = text;
};

Button.prototype._onDown = function(e) {
	this._element.classList.add('active');
	document.addEventListener('mouseup', this._callbacks.up, false);
	document.addEventListener('mouseleave', this._callbacks.leave, false);
};

Button.prototype._onUp = function(e) {
	this._element.classList.remove('active');
	document.removeEventListener('mouseup', this._callbacks.up);
	document.removeEventListener('mouseleave', this._callbacks.leave);
};

Button.prototype._onLeave = function(e) {
	console.log('leave');
	this._onUp(e);
};
