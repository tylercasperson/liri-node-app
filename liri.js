require("dotenv").config();
var fs = require("fs");
var axios = require("axios");


const { createLogger, format, transports } = require('winston');
const { combine, label, timestamp, printf } = format;
const myFormat = printf(info => `${info.timestamp} - ${info.message}`);

const logger = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'main' }),
    timestamp(),
    myFormat
  ),
  transports: [
    
    new transports.File({
      filename: 'log.txt',
      options: { flags: 'a', mode: 0o666 }
    })
  ]
});

var inputString = process.argv;

switch(inputString[2]) {
    case 'concert-this':
        concertThis();
    break;
    case 'spotify-this-song': 
        spotifySong((process.argv.splice(3, process.argv.length - 1)).toString().replace(",","+"));
    break;
    case 'movie-this': 
        movieThis((process.argv.splice(3, process.argv.length - 1)).toString().replace(",","+"));
    break;
    case 'do-what-it-says':
        doThis();
    break;
    default: 
        defaultChoice();
    break;
}

function concertThis() {
    var artist = (process.argv.splice(3, process.argv.length - 1)).toString().replace(",","+");
    var bandURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
axios
  .get(bandURL)
  .then(function(response) {
    var venueName = response.data[0].venue.name;
    var venueLocation = response.data[0].venue.city + ', ' + response.data[0].venue.region + ' ' + response.data[0].venue.country + ' Planet Earth';
    var eventDate = response.data[0].datetime; //convert with moment
    console.log('Name of the venue: ' + venueName);
    console.log('Venue location: ' + venueLocation);
    console.log('Date of the Event: ' + eventDate);
    console.log('------------------------------------------------------------------------------'); 
    logger.info((process.argv.splice(2, process.argv.length - 1)).toString().replace(","," ") + " " + artist.replace("+"," "));
    logger.info('Name of the venue: ' + venueName);
    logger.info('Venue location: ' + venueLocation);
    logger.info('Date of the Event: ' + eventDate);
    logger.info('------------------------------------------------------------------------------'); 
  })
  .catch(function(error) {
    defaultChoice();
  });
}

function spotifySong(songName){

    var Spotify = require('node-spotify-api');
    var spotify = new Spotify({
      id: process.env.SPOTIFY_ID,
      secret: process.env.SPOTIFY_SECRET
    });

    spotify
      .search({ type: 'track', query: songName || 'Ace of Base The Sign'})
      .then(function(data) {
          for (var i = 0; i < data.tracks.items.length;i++){
            var song = data.tracks.items[i].name; 
            var artists = data.tracks.items[i].artists[0].name;
            var previewLink = data.tracks.items[i].external_urls.spotify;
            var album = data.tracks.items[i].album.name;
            console.log('Artist(s): ' + artists);
            console.log('Song name: ' + song);
            console.log('Preview link: ' + previewLink);
            console.log('Album: ' + album); 
            console.log('------------------------------------------------------------------------------'); 
            logger.info(process.argv[2]);
            logger.info('Artist(s): ' + artists);
            logger.info('Song name: ' + songName);
            logger.info('Preview link: ' + previewLink);
            logger.info('Album: ' + album);    
            logger.info('------------------------------------------------------------------------------'); 
          }
      })
      .catch(function(err) {
        console.error('Error occurred: ' + err); 
      });  
}

function movieThis(movieName){
    if(movieName === null || movieName === ""){
        var movieName = 'Mr Nobody';
    } 
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
    console.log('------------------------------------------------------------------------------');
    logger.info(process.argv[2] + " " + title); 
    logger.info('Title: ' + title);
    logger.info('Year released: ' + yearReleased);
    logger.info('IMDB raiting: ' + IMDBrating);
    logger.info('Rotten Tommatoes rating: ' + rottenTomatoes);
    logger.info('Country produced: ' + countryProduced);
    logger.info('Language: ' + language);
    logger.info('Plot: ' + plot);
    logger.info('Actors: ' + actors);
    logger.info('------------------------------------------------------------------------------'); 
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

    fs.readFile("./random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        switch(data.substring(0,data.search(","))){
            case 'concert-this':
                concertThis();
            break;
            case 'spotify-this-song': 
                spotifySong(data.substring(data.search('"')+1,data.length-1));
            break;
            case 'movie-this': 
                movieThis(data.substring(data.search('"')+1,data.length-1));
            break;
            case 'do-what-it-says':
                doThis();
            break;
            default: 
                defaultChoice();
            break;
        }
    });
}

function defaultChoice(){
    console.log('Something went wrong with the input. Please try again. The options are: ');
    console.log('concert-this (enter artist/band name)');
    console.log('spotify-this-song (enter song name)');
    console.log('movie-this (enter movie name)');
    console.log('do-what-it-says');
}
