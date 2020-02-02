require("dotenv").config();
var fs = require("fs");
var axios = require("axios");

//need to type node liri.js case-statement

var inputString = process.argv;
var action = process.argv[2];
// var value = process.argv[3];




// axios
//   .get("https://en.wikipedia.org/wiki/Kudos_(granola_bar)")
//   .then(function(response) {
//     console.log(response.data);
//   })
//   .catch(function(error) {
//     if (error.response) {
//       console.log(error.response.data);
//       console.log(error.response.status);
//       console.log(error.response.headers);
//     } else if (error.request) {
//       console.log(error.request);
//     } else {
//       console.log("Error", error.message);
//     }
//     console.log(error.config);
//   });

switch(inputString[2]) {
    case 'concert-this':
        concertThis();
    break;
    case 'spotify-this-song': 
        spotifySong();
    break;
    case 'movie-this': 
        movieThis();
    break;
    case 'do-what-it-says':
        doThis();
    break;
    default: 
        defaultChoice();
    break;
}

function concertThis() {
    var artist = 'George Strait'; //change to argv[3]
    var bandURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
axios
  .get(bandURL)
  .then(function(response) {
    console.log(response.data[0]);
    var venueName = response.data[0].venue.name;
    var venueLocation = response.data[0].venue.city + ', ' + response.data[0].venue.region + ' ' + response.data[0].venue.country + ' Planet Earth';
    var eventDate = response.data[0].datetime; //convert with moment
    console.log('Name of the venue: ' + venueName);
    console.log('Venue location: ' + venueLocation);
    console.log('Date of the Event: ' + eventDate);
  })
  .catch(function(error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
    console.log(error.config);
  });
}

function spotifySong(){
    var Spotify = require('node-spotify-api');

    var spotify = new Spotify({
      id: process.env.SPOTIFY_ID,
      secret: process.env.SPOTIFY_SECRET
    });
    var songName = 'The Sign';     

    spotify
      .search({ type: 'track', query: songName })
      .then(function(data) {
        if(songName === null){
            var songName = 'The Sign';
        } else {
            var songName = data.tracks.items[0].name; 
            var artists = data.tracks.items[0].artists[0].name;
            var previewLink = data.tracks.items[0].external_urls.spotify;
            var album = data.tracks.items[0].album.name;
        }
        console.log('Artist(s): ' + artists);
        console.log('Song name: ' + songName);
        console.log('Preview link: ' + previewLink);
        console.log('Album: ' + album);  
      })
      .catch(function(err) {
        console.error('Error occurred: ' + err); 
      });
}

function movieThis(){
        // if(movie === null){
    //     var movie = 'Mr Nobody';
    // } else {

    // }
    //if(movieName === )//argv is null
    var movieName = 'the matrix';
    var omdbURL = "http://www.omdbapi.com/?i=tt3896198&apikey=1b760dd7" + "&t=" + movieName;

axios
  .get(omdbURL)
  .then(function(response) {

    var title = response.data.Title;
    var yearReleased = response.data.Year;
    var IMDBrating = response.data.Ratings[0].Value;
    var rottenTomatoes = response.data.Ratings[1].Value;
    var countryProduced = response.data.Country;
    var language = response.data.Language;
    var plot = response.data.Plot;
    var actors = response.data.Actors;

    console.log('Title: ' + title);
    console.log('Year released: ' + yearReleased);
    console.log('IMDB raiting: ' + IMDBrating);
    console.log('Rotten Tommatoes rating: ' + rottenTomatoes);
    console.log('Country produced: ' + countryProduced);
    console.log('Language: ' + language);
    console.log('Plot: ' + plot);
    console.log('Actors: ' + actors);
  })
  .catch(function(error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
    console.log(error.config);
  });
}

function doThis(){
    console.log('4');
    spotifySong(fs.readFile("./random.txt", function(err, data){
        resizeBy.write(data);
    }));
}

function defaultChoice(){
    console.log('default');
    console.log('Something went wrong with the input. Please try again.');
}
