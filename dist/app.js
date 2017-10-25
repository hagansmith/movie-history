(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

const tmdb = require('./tmdb.js');
const firebaseApi = require('./firebaseApi.js');

const apiKeys = ( ) => {
  return new Promise ((resolve, reject) => {
    $.ajax('./db/apiKeys.json').done((data) => {
      resolve(data.apiKeys);
    }).fail((error) => {
      reject(error);
    });
  });
};

const retrieveKeys = () => {
  apiKeys().then((results) => {
    tmdb.setKey(results.tmdb.apiKey);
    firebaseApi.setKey(results.firebaseKeys);
    firebase.initializeApp(results.firebaseKeys);
  }).catch((error) => {
    console.log('error in retrieve keys', error );
  });
};


module.exports = {retrieveKeys};

},{"./firebaseApi.js":4,"./tmdb.js":6}],2:[function(require,module,exports){
"use strict";

const domString = (movieArray, imgConfig, divName) => {
  let domString = "";
  for (let i = 0; i < movieArray.length; i++){
    if (i % 3 === 0) {
    domString += `<div class="row">`;
    }
    domString += `<div class="col-sm-6 col-md-4 movie">`;
    domString +=  `<div class="thumbnail">`;
    domString +=    `<img class="poster_path" src="${imgConfig.base_url}/w342/${movieArray[i].poster_path}" alt="">`;
    domString +=    `<div class="caption">`;
    domString +=      `<h3 class="title">${movieArray[i].title} <h6>${movieArray[i].release_date}<h6></h3>`;
    domString +=      `<p class="overview">${movieArray[i].overview}</p>`;
    domString +=      `<p>`;
    domString +=        `<a class="btn btn-primary review" role="button">Review</a>`;
    domString +=        `<a class="btn btn-default wishlist" role="button">Wishlist</a>`;
    domString +=       `</p>`;
    domString +=      `</div>`;
    domString +=    `</div>`;
    domString +=    `</div>`;
    if (i % 3 === 2 || i === movieArray.length - 1){
    domString += `</div>`;
    }
  }
  printToDom(domString, divName);
};

const printToDom = (domString, divName) => {
  $(`#${divName}`).append(domString);
};

const clearDom = (divName) => {
  $(`#${divName}`).empty();
};

module.exports = {domString, clearDom};

},{}],3:[function(require,module,exports){
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
    firebaseApi.saveMoive(newMovie).then((results) => {
      $(mom).remove();
    }).catch((err) => {
      console.log("error in save movie", err);
    });

  });
};

const reviewEvents = () => {
  $('body').on('click', '.review', (e) => {
    let mom = e.target.closest('.movie');

    let newMovie = {
      "title":$(mom).find('.title').html(),
      "overview":$(mom).find('.overview').html(),
      "poster_path":$(mom).find('.poster_path').attr('src').split('/').pop(),
      "rating": 0,
      "isWatched": true,
      "uid":""
    };
    console.log("new movie", newMovie);
    firebaseApi.saveMoive(newMovie).then((results) => {
      $(mom).remove();
    }).catch((err) => {
      console.log("error in save movie", err);
    });

  });
};

const init = () => {
  myLinks();
  googleAuth();
  pressEnter();
  wishListEvents();
  reviewEvents();
};

module.exports = {init};

},{"./dom.js":2,"./firebaseApi":4,"./tmdb":6}],4:[function(require,module,exports){
"use strict";

let firebaseKey = "";
let userUid = "";

const setKey = (key) => {
  firebaseKey = key;
};

//Firebase: GOOGLE - Use input credentials to authenticate user.
  let authenticateGoogle = () => {
    return new Promise((resolve, reject) => {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider)
        .then((authData) => {
        	userUid = authData.user.uid;
            resolve(authData.user);
        }).catch((error) => {
            reject(error);
        });
    });
  };

const getMovieList = () => {
  let movies = [];
  return new Promise ((resolve, reject) => {
    $.ajax(`${firebaseKey.databaseURL}/movies.json?orderBy="uid"&equalTo="${userUid}"`).then((fbMovies) => {
      if (fbMovies != null) {
      Object.keys(fbMovies).forEach((key) => {
        fbMovies[key].id = key;
        movies.push(fbMovies[key]);
        });
      }
        resolve(movies);
      }).catch((err) => {
        reject(err);
      });
  });
};

const saveMoive = (movie) => {
  movie.uid = userUid;
  return new Promise((resolve, reject) => {
      $.ajax({
        method: "POST",
        url: `${firebaseKey.databaseURL}/movies.json`,
        data: JSON.stringify(movie)
      }).then((result) => {
        resolve(result);
      }).catch((error) => {
        reject(error);
      });
  });

};

module.exports = {setKey, authenticateGoogle, getMovieList, saveMoive};

},{}],5:[function(require,module,exports){
"use strict";

let events = require('./events');
let apiKeys = require('./apiKeys');

apiKeys.retrieveKeys();
events.init();

},{"./apiKeys":1,"./events":3}],6:[function(require,module,exports){
"use strict";

let tmdbKey;
let imgConfig;
const dom = require('./dom');


const searchTMDB = (query) => {
  return new Promise((resolve, reject) => {
    $.ajax(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&language=en-US&page=1&include_adult=false&query=${query}`).done((data) => {
      resolve(data.results);
    }).fail((error) => {
      reject(error);
    });
  });
};

const tmdbConfiguration = () => {
  return new Promise((resolve, reject) => {
    $.ajax(`https://api.themoviedb.org/3/configuration?api_key=${tmdbKey}`).done((data) => {
      resolve(data.images);
    }).fail((error) => {
      reject(error);
    });
  });
};

const getConfig = () => {
  tmdbConfiguration().then((results) => {
    imgConfig = results;
  }).catch((error) => {
    console.log("error in getConfig", error);
  });
};

const searchMovies = (query) => {
  searchTMDB(query).then((data) => {
    showResults(data);
  }).catch((error) => {
    console.log("error in search movies", error);
  });
};

const setKey = (apiKey) => {
  tmdbKey = apiKey;
  getConfig();
};

const showResults = (movieArray) => {
  dom.clearDom('movies');
  dom.domString(movieArray, imgConfig, 'movies');
};

const getImgConfig = () => {
  return imgConfig;
};

module.exports = {setKey, searchMovies, getImgConfig};

},{"./dom":2}]},{},[5]);
