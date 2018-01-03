let model = {
	boardSize: 10,
	numShips: 2,
	numDestroyers: 1,
	destroyerLength: 5,
	shipLength: 4,
	shipsSunk: 0,
	destroyerSunk: 0,

	ships: [
		{ locations: [0, 0, 0, 0], hits: ["", "", "", ""] },
		{ locations: [0, 0, 0, 0], hits: ["", "", "", ""] }
	],

	destroyers: [
		{ locations: [0, 0, 0, 0, 0], hits: ["", "", "", "", ""] }
	],

	fire: function (guess) {
		for (let i = 0; i < this.numShips; i++) {
			let ship = this.ships[i];
			let index = ship.locations.indexOf(guess);

			if (ship.hits[index] === "hit") {
				view.displayMessage("You already hit that location!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("*** HIT ***");

				if (this.isSunkShip(ship)) {
					view.displayMessage("*** SUNK ***");
					this.shipsSunk++;
				}
				return true;
			}
		};

		for (let i = 0; i < this.numDestroyers; i++) {
			let destroyer = this.destroyers[i];
			let index = destroyer.locations.indexOf(guess);
			if (destroyer.hits[index] === "hit") {
				view.displayMessage("You already hit that location!");
				return true;
			} else if (index >= 0) {
				destroyer.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("*** HIT ***");

				if (this.isSunkDestroyer(destroyer)) {
					view.displayMessage("*** SUNK ***");
					this.destroyerSunk++;
				}
				return true;
			}

		}

		view.displayMiss(guess);
		view.displayMessage("*** MISS ***");
		return false;
	},

	isSunkShip: function (ship) {
		for (let i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},

	isSunkDestroyer: function (destroyer) {
		for (let i = 0; i < this.destroyerLength; i++) {
			if (destroyer.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},

	generateShipLocations: function () {
		let locations;
		for (let i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},

	generateDestroyerLocations: function () {
		let locations;
		for (let i = 0; i < this.numDestroyers; i++) {
			do {
				locations = this.generateDestroyer();
			} while (this.collision(locations));
			this.destroyers[i].locations = locations;
		}
	},

	generateShip: function () {
		
		let direction = Math.floor(Math.random() * 2);
		let row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		let newShipLocations = [];
		for (let i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}

		console.log(newShipLocations);
		return newShipLocations

	},

	generateDestroyer: function () {
		let direction = Math.floor(Math.random() * 2);
		let row, col;
		
		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.destroyerLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.destroyerLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		let newDestroyerLocations = [];
		for (let i = 0; i < this.destroyerLength; i++) {
			if (direction === 1) {
				newDestroyerLocations.push(row + "" + (col + i));
			} else {
				newDestroyerLocations.push((row + i) + "" + col);
			}
		}

		console.log(newDestroyerLocations);
		return newDestroyerLocations
	},

	collision: function (locations) {
		for (let i = 0; i < this.numShips; i++) {
			for (let k = 0; k < this.numDestroyers; k++) {
				let ship = this.ships[i];
				let destroyer = this.destroyers[k];
				for (let j = 0; j < locations.length; j++) {
					let shipLocation = ship.locations.indexOf(locations[j]);				
					let destroyerLocation = destroyer.locations.indexOf(locations[j] + 1);	
					if (shipLocation >= 0 && destroyerLocation >= 0 && shipLocation !== destroyerLocation) {
						return true;
					}
				}
			}

		}
		return false;
	},

	showAll: function () {
		for (let index = 0; index < model.ships.length; index++) {
			for (let destIndex = 0; destIndex < model.destroyers.length; destIndex++) {
				for (let key of model.ships[index].locations) {
					for (let key2 of model.destroyers[destIndex].locations) {
						view.displayHit(key)
						view.displayHit(key2)
					}
				}
			}
		}

	}

};


let view = {
	displayMessage: function (msg) {
		let messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function (location) {
		if (location.length === 2) {
			let cell = document.getElementById(location);
			cell.setAttribute("class", "hit");
		}
	},

	displayMiss: function (location) {
		if (location.length === 2) {
			let cell = document.getElementById(location);
			cell.setAttribute("class", "miss");
		}
	},

};

let controller = {
	guesses: 0,

	processGuess: function (guess) {

		if (guess == 'SHOW') {
			model.showAll()
		}

		let location = parseGuess(guess);
		if (location) {
			this.guesses++;
			let hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				if (hit && model.destroyerSunk === model.numDestroyers) {
					view.displayMessage('Well done! You completed the game in ' + this.guesses + ' shots');
				}
			}
		}
	},
}


function parseGuess(guess) {
	let alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
	if (guess === null) {
		alert("Please enter a letter and a number on the board.");
	}
	else if (guess.length === 2) {
		let firstChar = guess.charAt(0);
		let row = alphabet.indexOf(firstChar);
		let column = guess.charAt(1);
		return row + column
	}
	return null;
}


function handleFireButton() {
	let guessInput = document.getElementById("guessInput");
	let guess = guessInput.value.toUpperCase();

	controller.processGuess(guess);

	guessInput.value = "";
}

function handleKeyPress(e) {
	let fireButton = document.getElementById("fireButton");
	e = e || window.event;

	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}

window.onload = init;

function init() {

	let fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;

	let guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocations();
	model.generateDestroyerLocations();

}


