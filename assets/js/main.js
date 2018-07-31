var map; // Holds API map object

// Initialize the map with the users coordinates
function initMap(coords) {
    localStorage.setItem("lat", coords.lat);
    localStorage.setItem('lng', coords.long);
    map = new google.maps.Map(document.getElementById('map-area'), {
        center: {
            lat: coords.lat,
            lng: coords.long
        },
        zoom: 12
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
        lat: lat,
        long: lng
    };
    initMap(latLngObj);
}
// Show an overlay over the map area prompting user to enter location manually
function handleLocationError(message) {
    var div = $("<div>").attr("id", "location-error");
    var mess = $("<p>");
    mess.html(message);
    div.append(mess);
    var input = $("<input>").attr("type", "text").attr("pattern", "[0-9]{5}").attr("title", "Five digit zip code").attr("id", "user-location").addClass('text-dark');
    var button = $("<button>").attr("type", "button").addClass("btn").html("Go!");
    $("#map-area").append(mess).append(input).append(button);
    $(button).on("click", function () {
        var val = $("#user-location").val();
        getLocationByZipCity(val, initMap);
    });
}

// Use Geocode API to get a location lat long by zip code or city
function getLocationByZipCity(param, callback) {
    var jsonObj = {};
    $.get({
        url: "https://maps.googleapis.com/maps/api/geocode/json?address={" + param + "}"
    }).then(function (data) {
        if (data.status === "ZERO_RESULTS") {
            // Ephemeral modal saying no results, try again.
            showModal("general_message", "Location not found, please try again.");
            hideModal("general_message", 3000);
        }
        var lat = data.results[0].geometry.location.lat;
        var long = data.results[0].geometry.location.lng;
        jsonObj = {
            lat: lat,
            long: long
        };
        callback(jsonObj);
    });
}

// Functions to trigger / deal with modals

function showModal(target, content) {
    $("#" + target + "_content").html(content);
    $("#" + target).modal("show");
}

function hideModal(target, time) {
    var wait;
    if (time) {
        wait = time;
    }
    else {
        wait = 0;
    }
    setTimeout(function () {
        $("#" + target).modal("hide");
    }, wait);
}

// On page load show modal if first time user
$(function () {
    if (!localStorage.getItem('visited')) {
        localStorage.setItem("visited", true);
        $("#intro").modal("show");
    }
});

// End MODAL functions

// Prevent default on form submition
$("#food-input").keydown(function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        var food = $("#food-input").val();
        // Handle food mapping function here...
        return false;
    }
});

//Randomize Button Function

var $beerInput = $('#beer-checkbox');
var $wineInput = $('#wine-checkbox');
var $novelInput = $('#novel-checkbox');
var $movieInput = $('#movie-checkbox');
var $pizzaInput = $('#pizza-checkbox');
var $chineseInput = $('#chinese-checkbox');
var $burgerInput = $('#burger-checkbox');
var $tacoInput = $('#taco-checkbox');
var $chickenInput = $('#chicken-checkbox');

function makeMarkers(results, status) {
    console.log(results);
    console.log(status);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            console.log(place);
            var marker = new google.maps.Marker({
                map: map,
                place: {
                    placeId: place.place_id,
                    location: place.geometry.location,
                    title: place.name
                }
            });
        }
    }
}
function placesRequest(keyword) {
    var loc = new google.maps.LatLng(localStorage.getItem("lat"), localStorage.getItem("lng"));
    console.log(loc);
    var request = {
        location: loc,
        radius: 5000,
        keyword: keyword
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, makeMarkers);
}

$('#randomizer').on('click', function () {

    // Use modal to say nothing chosen if checkboxes all unchecked
    var textinputs = document.querySelectorAll('input[type=checkbox]');
    var empty = [].filter.call(textinputs, function (el) {
        return !el.checked;
    });
    if (textinputs.length == empty.length) {
        showModal("general_message", "No options chosen!");
        hideModal("general_message", 2000);
    }
    // Display the chosen options
    else {
        var options = {};
        if ($beerInput.is(":checked")) {
            options.beer = beerSearch();
        }
        if ($wineInput.is(":checked")) {
            options.wine = wineSearch();
        }
        if (book != null) {
            options.book = book;
            bookSearch();
        }
        if (movie != null) {
            options.movie = movie;
            movieSearch();
        }
        // Put the options on the page.
        var formattedOptions = formatOptions(options);
        if (($beerInput.is(":checked")) && ($wineInput.is(":checked")) && (book != null) && (movie != null)) {
            formattedOptions.prepend("<hr>");
        }
        $("#randomNight").prepend(formattedOptions);

        if ($pizzaInput.is(":checked")) {
            placesRequest("pizza");
        }
        if ($chineseInput.is(":checked")) {
            placesRequest("chinese");
        }
        if ($burgerInput.is(":checked")) {
            placesRequest("burger");
        }
        if ($tacoInput.is(":checked")) {
            placesRequest("taco");
        }
        if ($chickenInput.is(":checked")) {
            placesRequest("chicken");
        }
    }
});
// Given an object of the users choices, format them to put on the page
function formatOptions(obj) {
    var $div = $("<div>");
    var $p = $("<p>");
    var $favImg = $("<img>").attr("src", "assets/imgs/favorite.png").addClass("heart").addClass("img-fluid");
    if (obj.beer) {
        var b = $p.clone();
        b.html(obj.beer);
        $div.append($favImg.clone()).append(b).append("<br><br>");
    }
    if (obj.wine) {
        var w = $p.clone();
        w.html(obj.wine);
        $div.append($favImg.clone()).append(w).append("<br><br>");
    }
    if (obj.book) {
        var tit = obj.book.title;
        var auth = obj.book.author;
        var bk = $p.clone();
        bk.html("<strong>" + tit + "</strong>" + " by " + auth);
        var review = obj.book.reviews[0];
        console.log(review);
        if (review.book_review_link) {
            bk.append(" - <a href='" + review.book_review_link + "' target='_blank'>Review</a>");
        }
        else if (review.sunday_review_link) {
            bk.append(" - <a href='" + review.sunday_review_link + "' target='_blank'>Review</a>");
        }
        $div.append($favImg.clone()).append(bk).addClass("book").append("<br><br>");
    }
    if (obj.movie) {
        console.log(obj.movie);
        var $link = $("<a>");
        $link.html(obj.movie.Title);
        $link.attr("href", "https://www.imdb.com/title/" + obj.movie.imdbID);
        $link.attr("target", "_blank");
        var $img = $("<img>").attr("src", obj.movie.Poster).addClass("movie-poster");
        $div.append($favImg.clone()).append($link).append($img).append("<br><br>");
    }
    return $div;
}

function changeHeart(targ) {
    var src = $(targ).attr("src");
    if (src == "assets/imgs/favorite.png") {
        src = "assets/imgs/favorite-filled.png";
    }
    else {
        src = "assets/imgs/favorite.png";
    }
    $(targ).attr("src", src);
}

//Handle clicking a favorite heart
$(document).on("click", ".heart", function (event) {
    var $targ = $(this);
    changeHeart($targ[0]);
});

//movie api with results
//most used words in movie title array
function movieSearch() {
    var searchWords = ["dog", "cat", "comedy", "romance", "black", "love", "blood", "big", "ghost", "private", "new", "king", "girl", "american", "death", "pink", "doctor", "world", "sex", "children", "true", "Double", "Behind", "john", 'kill', 'amor', 'red', 'madame', 'hollywood', 'journey', 'hong', 'born', 'never', 'oh', 'house', 'inside', 'life', 'road', 'dark', 'time', 'heart', 'midnight', 'david', 'home', 'something', 'two', 'gun', 'seven', 'beyond', 'monster', 'christmas', 'last', 'deadly', 'max', 'escape', 'first', 'alice', 'boy', 'ten', 'mother', 'alien', 'hotel', 'father', 'mr', 'dirty', 'digital', 'bad', 'take', 'wild', 'three', 'american', 'cold', 'star', 'five', 'blue', 'family', 'tales', 'dragon', 'shin', 'city', 'dream', 'adventure', 'kiss', 'space', 'women', 'angel', 'how', 'what', 'why', 'when', 'the', 'summer', 'spy'];

    //randomly picking a word from the array
    var randomResult = searchWords[Math.floor(Math.random() * searchWords.length)];

    $.get({
        url: "https://www.omdbapi.com/?s=" + randomResult + "&apikey=39a85d37&limit=3"
    }).then(function (response) {
        if (response.Response == "False") {
            movieSearch();
        }
        else {
            var rand = Math.floor(Math.random() * 10);
            var movie = response.Search[rand];
            moviesCallback(movie);
        }
    });
}

//NY Times Book Search
function bookSearch() {
    var searchBookWords = ['girl', 'you', 'dark', 'love', 'life', 'star', 'night', 'i', 'to be', 'heart', 'lie', 'me', 'fall', 'break',
        'shadow', 'world', 'last', 'we', 'other', 'end', 'dragon', 'war', 'night', 'dead', 'city', 'blood', 'magic',
        'fire', 'dream', 'wolf', 'black', 'king', 'lord', 'book', 'light', 'moon', 'time', 'last', 'god', 'star', 'storm',
        'heart', 'demon', 'red', 'blue', 'hunt', 'knight', 'gate', 'man', 'gold', 'sword', 'spy'];

    var randomBookResult = searchBookWords[Math.floor(Math.random() * searchBookWords.length)];

    var url = "https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json";
    url += '?' + $.param({
        'api-key': "9e0bbef14d9144aebbfee114118e2d76",
        'title': randomBookResult
    });
    $.get({
        url: url
    }).then(function (result) {
        var rand = Math.floor(Math.random() * 20);
        var book = result.results[rand];
        booksCallback(book);
    }).fail(function (err) {
        throw err;
    });
}
var book;
function booksCallback(data) {
    book = data;
}
var movie;
function moviesCallback(data) {
    console.log(data);
    movie = data;
}
// Go ahead and make the book ajax request when the checkbox is toggled
$($novelInput).change(function () {
    if ($(this).is(":checked")) {
        bookSearch();
    }
    else {
        book = null;
    }
});
// Make movie API request when checkbox is clicked
$($movieInput).change(function () {
    if ($(this).is(":checked")) {
        movieSearch();
    }
    else {
        movie = null;
    }
});

// Drizly delivery cities list: (Work in progress)
var deliveryCities = {
    arizona: ["Phoenix", "Tuscon", "Cave Creek", "Chandler", "Fountain Hills", "Gilbert", "Glendale", "Mesa", "Paradise Valley", "Scottsdale", "Tempe"],
    California: ["Los Angeles", "Oakland", "Orange County", "San Diego", "San Francisco", "Stockton", "Vallejo"],
    Colorado: ["Arvada", "Aurora", "Brighton", "Broomfield", "Castle Pines", "Castle Rock", "Centennial", "Cherry Hills Village", "Colorado Springs", "Commerce City", "Englewood", "Evans", "Edgewater", "Federal Heights", "Fort Carson", "Fountain", "Foxfield", "Glendale", "Golden", "Greenwood Village", "Highlands Ranch", "Lafayette", "Lakewood", "Littleton", "Lone Tree", "Longmont", "Louisville", "Morrison", "Niwot", "Northglenn", "Parker", "Sheridan", "Superior", "Thornton", "Timnath", "Westminster", "Wheat Ridge", "Windsor"],
    Connecticut: [],
    Florida: [],
    Hawaii: [],
    Illinois: [],
    Indiana: [],
    Kentucky: [],
    Louisiana: [],
    Maine: [],
    Maryland: [],
    Massachusetts: [],
    Minnesota: [],
    Missouri: [],
    NewJersey: [],
    NewYork: [],
    NorthCarolina: [],
    Ohio: [],
    Oregon: [],
    RhodeIsland: [],
    Texas: [],
    Tennessee: [],
    Virginia: [],
    Washington: [],
    Wyoming: []
};

//Beer Search
function beerSearch() {
    var searchBeers = ['Samuel Adams Boston Lager', 'New Belgium Trippel', 'Sierra Nevada Pale Ale', 'Rogue Dead Guy Ale', 'Stone Porter', 'Guiness Draught', 'New Belgium Fat Tire', 'Yuenling Lager', 'Red Oak Amber', 'Angry Orchard Crisp Apple', 'Guiness Blonde', 'Yuengling Black and Tan', 'Dos Equis Amber', 'Stone Arrogant Bastard Ale', 'New Belgium Voodoo Ranger', 'Fat Tire Belgian White', 'New Belgium Pilsner'];

    var randomBeerResult = searchBeers[Math.floor(Math.random() * searchBeers.length)];
    return randomBeerResult;
}

//WIne Randomizer
function wineSearch() {
    var searchWines = ['Bogle Vineyards Old Vine Zinfadel', 'Corvo Nero D Avola', 'Charles Smith Boom Boom Syrah', 'Cloudline Cellars Pinot Noir',
        'Tormaresca Neprica Negroamoaro', 'Charles & Charles Cabernet Blend', 'Joseph Drouhin Laforet Bourgogne Chardonnay',
        'Pacific Rim Dry Riesling', 'Nobilo Sauvignon Blanc', 'Berger Gruner Veltliner', 'Simi Chardonnay', 'Domanine Vindemio Cotes du Ventooux Regain',
        'Apothic Winemakers Red Blend', 'Fontanafredaa Briccotondo Piemonte Barbera', 'The Stump Jump Grenache Syrag Mouvedre Blend',
        'Geyser Peak Sauvignon Blanc', 'Ravenswood Vinters Blend Petit Sirah', 'Liberty School Cabernet Sauvignon', 'Cline Cashmere',
        'Bodega Renacer Punto Final Malbec', 'Charles and Charles Rose', 'Delas Cotes Du Ventoux', 'Mulderbosch Chenin Blanc', 'Castle Rock Pinot Noir',
        'Marques De Caceres Crianza Rioja', 'Charles Smith WIne Eve Chardonnay'];

    var randomWineResult = searchWines[Math.floor(Math.random() * searchWines.length)];
    return randomWineResult;
}

//food links
function pizzaSearch() {
    window.location = "https://www.google.com/search?source=hp&ei=yNhdW92zF4q6tgXjjqngCQ&q=pizza&oq=pizza&gs_l=psy-ab.3..0i131k1l3j0l2j0i131k1j0j0i131k1j0j0i131k1.2867.3893.0.4470.5.4.0.1.1.0.110.382.3j1.4.0....0...1c.1.64.psy-ab..0.5.397....0.36xFKvyvNas";
}

function chineseSearch() {
    window.location = "https://www.google.com/search?ei=zdhdW87fJI-YsAXrr4qQBg&q=chinese+food&oq=chinese&gs_l=psy-ab.3.0.0i131i67k1j0i131k1j0i67k1l2j0i131i67k1j0i131k1j0i67k1j0l3.218043.219025.0.220131.7.5.0.2.2.0.198.567.0j4.4.0....0...1c.1.64.psy-ab..1.6.655....0.TwGHb9HWgxk";
}

function burgerSearch() {
    window.location = "https://www.google.com/search?ei=q9ldW-CwB8KUtQXu367oAg&q=burgers&oq=burgers&gs_l=psy-ab.3..0i131i67k1j0i131k1j0l8.33977.36346.0.37300.7.6.0.1.1.0.182.804.0j6.6.0....0...1c.1.64.psy-ab..1.6.670...0i67k1.0.dM50MV65tBg";
}

function tacoSearch() {
    window.location = "https://www.google.com/search?ei=7NldW4CSA4-gtQW9uJ_ACQ&q=mexican+food&oq=mexican&gs_l=psy-ab.3.1.0i67k1j0i131i67k1j0i67k1j0i131i67k1j0i131k1j0i67k1l5.3239.4350.0.5961.7.3.0.4.4.0.174.428.0j3.3.0....0...1c.1.64.psy-ab..0.7.554...0.0.rczzG1KyCX8";
}

function chickenSearch() {
    window.location = "https://www.google.com/search?ei=D9pdW4OfAsK8sQXbjr3IAw&q=chicken&oq=chicken&gs_l=psy-ab.3..0i67k1l8j0i131i67k1j0i67k1.3038.5511.0.5676.11.6.2.3.3.0.148.797.0j6.6.0....0...1c.1.64.psy-ab..0.11.951...0j0i131k1j0i10k1.0.WZt8nXXe-TM";
}

