"use strict";

var outputDiv = $('#dinosaurs');

var domString = function(dinosaur) {
	var domStrang = '';
      domStrang += `<div class=${dinosaur.info === 'Carnivore' ? 'card-bad' : 'card-good'}>`;
      domStrang +=   `<h1>${dinosaur.type}</h1>`;
			domStrang +=   `<h4>${dinosaur.bio}</h4>`;
			if (dinosaur.info === 'Carnivore') {
				domStrang += `<h4>Has some tasty snacks.</h4>`;
			} else {
				domStrang += `<h4>Has some adorable friends.</h4>`;
			}
			domStrang += `<div class='card-holder'>`;
			dinosaur.snacks.forEach((cat) => {
				domStrang += `<div class='card'>`;
				domStrang += 	`<h5>${cat.name}</h5>`;
				domStrang += 	`<div class='card-img'>`;
				domStrang += 		`<img src=${cat.imageUrl}>`;
				domStrang += 	`</div>`;
				domStrang += 	`<p class='card-description'>${cat.specialSkill}</p>`;
				domStrang += `</div>`;
			});
      domStrang += `</div>`;
			domStrang += `</div>`;
	printToDom(domStrang);
};


var printToDom = function(strang) {
	outputDiv.append(strang);
};

module.exports = domString;
