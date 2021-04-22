
mapboxgl.accessToken = 'pk.eyJ1IjoibmVpbHdpY2siLCJhIjoiY2trend6anJtMGw3OTJxcDVobjAzMXF0NyJ9.GdU99dksEsLt6TlpXlODVQ';
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/neilwick/cknkdys7t0g6m17o64ppw9dia', // style URL
    center: [-75, 45], // starting position [lng, lat]
    zoom: 15 // starting zoom
});

let getHydrants = async () => {
    let req  = await fetch("/api/hydrants");
    let data = await req.text();

    let parsed = new window.DOMParser().parseFromString(data, 'text/xml');

    let hydrants = parsed.querySelectorAll("GEOM");

    hydrants.forEach((el) => {
        //        console.log(hydrants[0].innerHTML);

        let loc = el.innerHTML;

        loc = loc.substring(7, loc.length-1).split(' ');

        var marker = new mapboxgl.Marker()
            .setLngLat([loc[0], loc[1]])
            .addTo(map);
        });
    }

window.onload = async () => {
    getHydrants();

    let tracker;
    let location = false;

    if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((p) => {
                console.log(p.coords);
                location = true;
                map.setCenter({lon: p.coords.longitude, lat: p.coords.latitude})
            });
    }

    if (!location) {
        getServerGeo();
    }
};

let getServerGeo = async function() {
    var loc = await fetch("/api/geo");
    var jData = await loc.json();

    console.log(jData);
    map.setCenter({lat: jData.latitude, lon: jData.longitude});

}