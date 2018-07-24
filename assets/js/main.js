var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map-area'), {
        center: { lat: 35.8549538, lng: -78.8406356 },
        zoom: 8
    });
}