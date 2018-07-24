var map; // Holds API map object

// Initialize the map with the users coordinates
function initMap(coords) {
    map = new google.maps.Map(document.getElementById('map-area'), {
        center: {
            lat: coords.coords.latitude,
            lng: coords.coords.longitude
        },
        zoom: 10
    });
}

// Use html5 geolocation to try and get user's location
function getLocation() {
    var message;
    if (navigator.geolocation) {
        message = navigator.geolocation.getCurrentPosition(initMap, geolocationError); // These params are callback functions
    } else {
        message = "Geolocation is not supported by this browser.";
    }
    if (!message) {
        handleLocationError(message);
    }
}
function geolocationError(error) {
    var message;
    switch (error.code) {
        case error.PERMISSION_DENIED:
            message = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            message = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            message = "An unknown error occurred.";
            break;
    }
    return message;
}
function handleLocationError(message) {
    console.log(message);
}