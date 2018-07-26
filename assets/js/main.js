var map; // Holds API map object

// Initialize the map with the users coordinates
function initMap(coords) {
    console.log(coords);
    map = new google.maps.Map(document.getElementById('map-area'), {
        center: {
            lat: coords.lat,
            lng: coords.long
        },
        zoom: 10
    });
}

// Use html5 geolocation to try and get user's location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(formatJsonObj, geolocationError); // These params are callback functions
    } else {
        handleLocationError("Geolocation is not supported by this browser.");
    }
}
// Handle errors thrown by the geocode API
function geolocationError(error) {
    var suff = "Please enter a location manually.";
    var message;
    switch (error.code) {
        case error.PERMISSION_DENIED:
            message = "You denied the request for Geolocation. " + suff;
            break;
        case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable. " + suff;
            break;
        case error.TIMEOUT:
            message = "The request to get user location timed out. " + suff;
            break;
        case error.UNKNOWN_ERROR:
            message = "An unknown error occurred. " + suff;
            break;
    }
    handleLocationError(message);
}
// Format the obj returned by geolocation
function formatJsonObj(obj) {
    var lat = obj.coords.latitude;
    var lng = obj.coords.longitude;
    var latLngObj = {
        lat:lat,
        long: lng
    };
    console.log(latLngObj);
    initMap(latLngObj);
}
// Show an overlay over the map area prompting user to enter location manually
function handleLocationError(message) {
    console.log(message);
    var div = $("<div>").attr("id", "location-error");
    var mess = $("<p>");
    mess.html(message);
    div.append(mess);
    var input = $("<input>").attr("type", "text").attr("pattern", "[0-9]{5}").attr("title", "Five digit zip code").attr("id", "user-location");
    var button = $("<button>").attr("type", "button").addClass("btn").html("Go!");
    $("#map-area").append(mess).append(input).append(button);
    $(button).on("click", function() {
        var val = $("#user-location").val();
        getLocationByZipCity(val, initMap);
    });
}

// Use Geocode API to get a location lat long by zip code or city
function getLocationByZipCity(param, callback) {
    var jsonObj = {};
    $.get({
        url: "https://maps.googleapis.com/maps/api/geocode/json?address={" + param + "}"
    }).then(function(data) {
        var lat = data.results[0].geometry.location.lat;
        var long = data.results[0].geometry.location.lng;
        jsonObj = {
            lat: lat,
            long: long
        };
        callback(jsonObj);
    });
}

//movie api with results
//most used words in movie title array
var searchWords = ["dog", "cat", "comedy", "romance", "black", "love", "blood", "big", "ghost", "private", "new", "king", 
                  "girl", "american", "death", "pink", "doctor", "world", "sex", "children", "true", "Double", "Behind", "john",
                  'kill', 'amor', 'red', 'madame', 'hollywood', 'journey', 'hong', 'born', 'never', 'oh', 'house', 'inside',
                  'life', 'road', 'dark', 'time', 'heart', 'midnight', 'david', 'home', 'something', 'two', 'gun', 'seven', 'beyond',
                  'monster', 'christmas', 'last', 'deadly', 'max', 'escape', 'first', 'alice', 'boy', 'ten', 'mother', 'alien', 
                  'hotel', 'father', 'mr', 'dirty', 'digital', 'bad', 'take', 'wild', 'three', 'american', 'cold', 'star', 'five',
                  'blue', 'family', 'tales', 'dragon', 'shin', 'city', 'dream', 'adventure', 'kiss', 'space', 'women', 'angel',
                  'how', 'what', 'why', 'when', 'the', 'summer', 'spy' ];

//randomly picking a word from the array
var randomResult = searchWords[Math.floor(Math.random()*searchWords.length)];

    $.ajax({
        url:"http://www.omdbapi.com/?s="+ randomResult +"&apikey=39a85d37&limit=3",
        method: "GET"
    }).then(function(response){
        
        $("#randomMovie").on("click", function(){
            console.log(response);
        });
    });

//NY Times Book Search 
var searchBookWords = ['girl', 'you', 'dark', 'love', 'life', 'star', 'night', 'i', 'to be', 'heart', 'lie', 'me', 'fall', 'break', 
                       'shadow', 'world', 'last', 'we', 'other', 'end', 'dragon', 'war', 'night', 'dead', 'city', 'blood', 'magic',
                       'fire', 'dream', 'wolf', 'black', 'king', 'lord', 'book', 'light', 'moon', 'time', 'last', 'god', 'star', 'storm', 
                       'heart', 'demon', 'red', 'blue', 'hunt', 'knight', 'gate', 'man', 'gold', 'sword', 'spy' ];

var randomBookResult = searchBookWords[Math.floor(Math.random()*searchBookWords.length)];

var url = "https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json";
                url += '?' + $.param({
                'api-key': "9e0bbef14d9144aebbfee114118e2d76",
                'title': randomBookResult
            });
                $.ajax({
                    url: url,
                    method: 'GET',
                }).done(function(result) {
                    $("#randomBook").on("click", function(){
                    console.log(result);   
                    });
                }).fail(function(err) {
                    throw err;
            });