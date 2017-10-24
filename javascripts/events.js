"use strict";

const tmdb = require('./tmdb');
const firebaseApi = require('./firebaseApi');

const pressEnter = () => {
  $(document).keypress((e) => {
    if (e.key === 'Enter') {
      let searchText = $('#searchBar').val();
      let query = searchText.replace(/\s/g, "%20");
      tmdb.searchMovies(query);
    }
  });
};

const myLinks = () => {
  $(".nav").click((event) => {
    console.log(event.target.id);
    if (event.target.id === "searchBtn") {
      $("#search").removeClass("hidden");
      $("#myMovies").addClass("hidden");
      $("#authScreen").addClass("hidden");
    }else if (event.target.id === "authBtn") {
      $("#search").addClass("hidden");
      $("#myMovies").addClass("hidden");
      $("#authScreen").removeClass("hidden");
    }else if (event.target.id === "myMoviesBtn") {
      $("#search").addClass("hidden");
      $("#myMovies").removeClass("hidden");
      $("#authScreen").addClass("hidden");
    }
  });
};

const googleAuth = () => {
  $("#googleButton").click((e) => {
    firebaseApi.authenticateGoogle().then((result) => {
      console.log("result", result);
    }).catch((err) => {
      console.log("error in authenticateGoogle", err);
    });
  });
};

module.exports = {pressEnter, myLinks, googleAuth};
