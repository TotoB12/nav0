let isApp = false;

window.onload = function() {
  var modal = document.getElementById("myModal");
  var btn = document.getElementById("startButton");

  // Show the modal
  modal.style.display = "block";

  // When the user clicks on the button, close the modal and ask for permission
  btn.onclick = function() {
    modal.style.display = "none";
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', () => { });
            continueScript();
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('deviceorientation', () => { });
      continueScript();
    }
  }
}

function continueScript() {
  mapboxgl.accessToken = 'pk.eyJ1IjoidG90b2IxMjE3IiwiYSI6ImNsbXo4NHdocjA4dnEya215cjY0aWJ1cGkifQ.OMzA6Q8VnHLHZP-P8ACBRw';
  const map = new mapboxgl.Map({
    container: 'map',
    // style: 'mapbox://styles/totob1217/clmzbxdgs05xa01p7026z6t7e',
    zoom: 17,
    center: [-77.03632316866242, 38.89893381284996],
    attributionControl: false
  });

  map.on('style.load', () => {
    map.setConfigProperty('basemap', 'lightPreset', 'dusk');
    map.setConfigProperty('basemap', 'showTransitLabels', false);
  });

  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
  });

  const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    fitBoundsOptions: {
      maxZoom: 17
    },
    trackUserLocation: true,
    showUserHeading: true
  });

  const nav = new mapboxgl.NavigationControl({
    // visualizePitch: true
  });

  map.addControl(geolocate);
  map.addControl(nav, 'top-right');
  map.on('load', () => {
    geolocate.trigger();
  });

  // Control implemented as ES6 class
// class HelloWorldControl {
//     onAdd(map) {
//         this._map = map;
//         this._container = document.createElement('div');
//         this._container.className = 'mapboxgl-ctrl';
//         this._container.textContent = 'Hello, world';
//         return this._container;
//     }

//     onRemove() {
//         this._container.parentNode.removeChild(this._container);
//         this._map = undefined;
//     }
// }

//   map.addControl(new HelloWorldControl, 'top-left');

// window.onload = function() {
//     // Wait for the map to load
//     map.on('load', function() {
//         // Get the geolocate button
//         var button = document.querySelector('.mapboxgl-ctrl-geolocate');
        
//         // Check if the button exists
//         if (button) {
//             // Get the SVG inside the button
//             var svg = button.querySelector('svg');
            
//             // Check if the SVG exists
//             if (svg) {
//                 // Fetch your local SVG file
//                 fetch('/src/coffee.svg') // Replace with the actual path to your SVG file
//                     .then(response => response.text())
//                     .then(data => {
//                         // Replace the existing SVG with the fetched SVG
//                         svg.outerHTML = data;
//                     });
//             }
//         }
//     });
// }

  document.getElementById('search-bar').appendChild(geocoder.onAdd(map));

  if (window.navigator.standalone && window.matchMedia("(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)").matches) {
    document.addEventListener("DOMContentLoaded", function() {
      isApp = true;
      const navbar = document.querySelector("#nav-bar");
      navbar.style.paddingBottom = "25px";
    });
  }

  const navbar = document.getElementById('nav-bar');
  const presetButtons = document.getElementById('preset-buttons');

  const geocoderInput = document.querySelector('.mapboxgl-ctrl-geocoder input');

  document.getElementById('search-bar').addEventListener('click', function() {
    window.scrollTo(0, 0);
    navbar.style.height = '100vh';
    navbar.style.borderRadius = '0px';

    presetButtons.style.opacity = '0';
    setTimeout(function() {
      presetButtons.style.display = 'none';
    }, 500);

    window.scrollTo(0, 0);
  });

  geocoderInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      closeSearch();
    }
  });

  geocoder.on('result', function() {
    closeSearch();
  });

  navbar.addEventListener('touchstart', handleTouchStart, false);
  navbar.addEventListener('touchmove', handleTouchMove, false);

  var yDown = null;

  function handleTouchStart(evt) {
    yDown = evt.touches[0].clientY;
  };

  function handleTouchMove(evt) {
    if (!yDown) {
      return;
    }

    var yUp = evt.touches[0].clientY;
    var yDiff = yDown - yUp;

    if (yDiff > -20) {
      // User swiped up
    } else if (yDiff < 0) {
      // User swiped down
      closeSearch();
    }

    yDown = null;
  }

  function closeSearch() {
    navbar.style.removeProperty('height');
    navbar.style.borderRadius = '12px';

    presetButtons.style.display = 'flex';
    setTimeout(function() {
      presetButtons.style.opacity = '1';
    }, 0);

    geocoderInput.blur();
  }
}