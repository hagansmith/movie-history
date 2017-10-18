"use strict";

const domString = (movieArray) => {
  let domString = "";
  for (let i = 0; i < movieArray.length; i++){
    if (i % 3 === 0) {
    domString += `<div class="row">`;
    }
    domString += `<div class="col-sm-6 col-md-4">`;
    domString +=  `<div class="thumbnail">`;
    domString +=    `<img src="" alt="">`;
    domString +=    `<div class="caption">`;
    domString +=      `<h3>${movieArray[i].title} <h6>${movieArray[i].release_date}<h6></h3>`;
    domString +=      `<p>${movieArray[i].overview}</p>`;
    domString +=      `<p><a href="#" class="btn btn-primary" role="button">Review</a> <a href="#" class="btn btn-default" role="button">Wishlist</a></p>`;
    domString +=      `</div>`;
    domString +=    `</div>`;
    domString +=    `</div>`;
    if (i % 3 === 2 || i === movieArray.length - 1){
    domString += `</div>`;
    }
  }
  printToDom(domString);
};

const printToDom = (movie) => {
  $("#movies").append(movie);
};

const clearDom = () => {
  $("#movies").empty();
};

module.exports = {domString, clearDom};
