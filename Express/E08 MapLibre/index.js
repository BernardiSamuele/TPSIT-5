'use strict';

$(document).ready(async function () {
  let lat = 44.5557763;
  let lng = 7.7347183;
  let zoom = 15.95;

  const style = {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        //"attribution": "&copy; OpenStreetMap Contributors",
        maxzoom: 19,
        minzoom: 11
      }
    },
    layers: [
      {
        id: 'osm',
        type: 'raster',
        source: 'osm' // This must match the source key above
      }
    ]
  };

  const mapOptions = {
    container: 'mapContainer', // container id
    style: style,
    center: [lng, lat], // starting position [lng, lat]
    zoom: zoom
  };

  const map = new maplibregl.Map(mapOptions);
  map.addControl(new maplibregl.NavigationControl());
  //map.addControl(new maplibregl.NavigationControl(), 'top-left');

  const scaleOptions = { maxWidth: 80, unit: 'metric' };
  map.addControl(new maplibregl.ScaleControl(scaleOptions));

  // -------------------------------------------------------
  //    AGGIUNTA DI MARKER
  // -------------------------------------------------------

  const markerOptions = {
    color: '#F00',
    draggable: true
  };
  const marker = new maplibregl.Marker(markerOptions);
  marker.setLngLat([lng, lat]);
  marker.addTo(map);

  let htmlElement = marker.getElement();
  //htmlElement.addEventListener("click", function(){alert("clicked")})

  // oppure
  let popup = new maplibregl.Popup();
  popup.setHTML('<h1>Hello World!</h1>');
  marker.setPopup(popup);

  // -------------------------------------------------------
  //    AGGIUNTA DI CUSTOM MARKER
  // -------------------------------------------------------

  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          messagee: 'marker1',
          iconSize: [40, 40]
        },
        geometry: {
          type: 'Point',
          coordinates: [7.7347183, 44.5547763]
        }
      },
      {
        type: 'Feature',
        properties: {
          messagee: 'marker2',
          iconSize: [40, 40]
        },
        geometry: {
          type: 'Point',
          coordinates: [7.7357183, 44.5567763]
        }
      }
    ]
  };

  // add markers to map
  geojson.features.forEach(marker => {
    // create a DOM element for the marker
    const elem = document.createElement('div');
    elem.className = 'marker';
    elem.style.backgroundImage = 'url(./university.png)';
    elem.style.width = `${marker.properties.iconSize[0]}px`;
    elem.style.height = `${marker.properties.iconSize[1]}px`;

    elem.addEventListener('click', () => {
      window.alert(marker.properties.messagee);
    });

    // add marker to map
    new maplibregl.Marker({ element: elem }).setLngLat(marker.geometry.coordinates).addTo(map);
  });
});
