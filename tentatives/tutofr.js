
        // On initialise la latitude et la longitude de Lannion (centre de la carte)
        var lat = 48.73056610085155;
        var lon = -3.460834918664013;
        var macarte = null;
        var markerClusters; // Servira à stocker les groupes de marqueurs

        // Nous initialisons un tableau city qui contiendra les "ville"
        let city = [];

        function initLat(min, max){ //function initLatitude(min, max)
          min = min;
          max = max;
          return Math.random() * (max - min) + min;
        }
        function initLon(min, max){ //function initLongitude(min, max)
          min = min;
          max = max;
          return Math.random() * (max - min) + min;
        }

        //fonction
        function addPolylineToMap(map) {
          var lineString = new H.geo.LineString();

          //Coordonnées de la zone que l'on veut délimité pour les points
          lineString.pushPoint({lat:53.3477, lng:-6.2597});
          lineString.pushPoint({lat:51.5008, lng:-0.1224});
          lineString.pushPoint({lat:48.8567, lng:2.3508});
          lineString.pushPoint({lat:52.5166, lng:13.3833});

          map.addObject(new H.map.Polyline(
            lineString, { style: { lineWidth: 4 }}
          ));
        }

        // Fonction d'initialisation de la carte
        function initMap() {
  	       // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
  	       macarte = L.map('map').setView([lat, lon], 11);
           markerClusters = L.markerClusterGroup(); // Nous initialisons les groupes de marqueurs

  	       // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
           L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
		           // Source des données
		           attribution: 'données © OpenStreetMap/ODbL - rendu OSM France',
		           minZoom: 1,
		           maxZoom: 20
  	       }).addTo(macarte);

           //Création du périmêtre de la maison, autour du quel, la position du chien n'est pas pris en compte
           var home = L.circle([48.732675, -3.446217], {
             color: 'red',
             fillColor: '#f03',
             fillOpacity: 0.5,
             radius: 500 //Radius = Rayon "Maison"
          }).addTo(macarte);

           //test pour ajout dans tableau city
           for (var ville in city) {
             // Nous définissons l'icône à utiliser pour le marqueur, sa taille affichée (iconSize), sa position (iconAnchor) et le décalage de son ancrage (popupAnchor)
             var myIcon = L.icon({
             iconSize: [50, 50],
             iconAnchor: [25, 50],
             popupAnchor: [-3, -76],
             });
             console.log(city[ville].lat);
             console.log(city[ville].lon);
             var marker = L.marker([city[ville].lat, city[ville].lon]).addTo(macarte);
              // Nous ajoutons la popup. A noter que son contenu (ici la variable ville) peut être du HTML
	            marker.bindPopup(`<b> ${ville} <b><br>Lattitude: ${city[ville].lat} <br>Longitude: ${city[ville].lon} <br>Altitude: `);
              markerClusters.addLayer(marker); // Nous ajoutons le marqueur aux groupes
  	       }

           macarte.addLayer(markerClusters);
           // Nous ajoutons la popup. A noter que son contenu (ici la variable ville) peut être du HTML
           home.bindPopup("Maison")
        }
        window.onload = function(){
		    // Fonction d'initialisation qui s'exécute lorsque le DOM est chargé

        window.addEventListener('resize', () => map.getView().resize());
        initMap();
        addPolylineToMap(map);

        };
