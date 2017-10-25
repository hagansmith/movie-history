"use strict";

const tmdb = require('./tmdb');
const firebaseApi = require('./firebaseApi');
const dom = require('./dom.js');

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
      firebaseApi.getMovieList().then((results) => {
        dom.clearDom('moviesMine');
        dom.domString(results, tmdb.getImgConfig() ,'moviesMine');
      }).catch((err) => {
        console.log("error in get movies", err);
      });
    }
  });
};

const googleAuth = () => {
  $("#googleButton").click((e) => {
      firebaseApi.authenticateGoogle().then((result) => {
    }).catch((err) => {
      console.log("error in authenticateGoogle", err);
    });
  });
};

const wishListEvents = () => {
  $('body').on('click', '.wishlist', (e) => {
    console.log("wishListEvents", e);
    let mom = e.target.closest('.movie');

    let newMovie = {
      "title":$(mom).find('.title').html(),
      "overview":$(mom).find('.overview').html(),
      "poster_path":$(mom).find('.poster_path').attr('src').split('/').pop(),
      "rating": 0,
      "isWatched": false,
      "uid":""
    };
    console.log("new movie", newMovie);
    //firebaseApi.saveMoive().then().catch();

  });
};

module.exports = {pressEnter, myLinks, googleAuth, wishListEvents};
