// On initialise la latitude et la longitude de l'habitation du client (centre de la carte)
// Au préalable séléctionné/donné par l'utilisateur, dans le cas contraire:
// Se positionner sur Lannion.
        var lat_home = 48.73056610085155;
        var lon_home = -3.460834918664013;
        var macarte = null;
        var markerClusters; // Servira à stocker les groupes de marqueurs

        // Nous initialisons un tableau city qui contiendra les "ville"
        //list = nombre d'enregistrement fait par le GPS, sur la BDD, encore accessible
        var list = 0;
        let city = new Array(list);

        //fonction donnant un nombre aléatoire entre un minimum et un maximum.
        function initCoord(min, max){
          min = min;
          max = max;
          return Math.random() * (max - min) + min;
        }

        // Fonction d'initialisation de points (aléatoires) sur la carte
        function initPoint() {
          for (let point = 0; point < 10; point++){

            // Pour la France et ses alentours:
            //Lat = initCoord(42, 51);
            //Lon = initCoord(-4, 8);

            // Pour la Bretagne et ses alentours:
            // Lat = initCoord(47.97, 48.5);
            // Lon = initCoord(-4, -1);
            // Alt = initCoord(-4, 20);

            // Pour Lannion et ses alentours:
            Lat = initCoord(48.7861, 48.7041);
            Lon = initCoord(-3.5499, -3.3877);
            Alt = initCoord(-4, 20);

            // Pour la vallé du Stanco et ses alentours:
            // Lat = initCoord(48.73565081538279, 48.73746224718652);//48.73746224718652, -3.450671274438872
            // Lon = initCoord(-3.4550969193093337, -3.450671274438872);
            // Alt = initCoord(-4, 20);

            var ville = new Object();
            ville.id = point;
            ville.lat = Lat;
            ville.lon = Lon;
            ville.alt = Alt;
            city.push(ville);
          }
        }
        initPoint();

        // Fonction d'initialisation de la carte
        function initMap() {
  	       // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
  	       macarte = new L.map('map').setView([lat_home, lon_home], 11);
           markerClusters = new L.markerClusterGroup(); // Nous initialisons les groupes de marqueurs
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
             //Radius = Rayon "Maison"
             radius: 500
          }).addTo(macarte);

          //Création du bouton "afficher Menu"
          //     /!\ PAS FINI /!\
          var command = new L.control({position: 'topright'});
          command.onAdd = function (macarte) {
            var div = L.DomUtil.create('div', 'command');
            div.innerHTML += '<button><img href="images/icon_plus.png" width="100px" /></button>';
            return div;
          };
          command.addTo(macarte);

          //Création du tracé GPS en ligne droite
          for (var i = 0; i < city.length-1; i++) {
          //   var latlngs = [[city[i].lat, city[i].lon],[city[i+1].lat, city[i+1].lon]];
          //   var polyline = L.polyline(latlngs, {color: '#C50022'}).addTo(macarte);

          //Création du tracé GPS qui suit les routes
            L.Routing.control({
              waypoints:[
                //L.latLng(48.56036426785153, -3.1599197957359926),
                L.latLng(city[i].lat, city[i].lon),
                //L.latLng(48.51278434587372, -2.779401099923159)],
                L.latLng(city[i+1].lat, city[i+1].lon)],
                 router: new L.Routing.OSRMv1({
                   profile: 'route/v1/driving',         // /!\ IMPORTANT /!\ : Suffixe de serviceUrl
                   serviceUrl: 'http://192.168.15.87:5000'  // Permet  http://localhost:5000
                 }),
              // Class "animate" permet de régler (en CSS) certain détail de l'animation (vitesse d'exécution, temps avant exécution, coleur, etc...)
              lineOptions: {
                styles: [{className: 'animate'}]
              },
              draggableWaypoints: false,
              addWaypoints: false
            }).addTo(macarte);
          }

           //test pour ajout dans tableau city
           for (ville in city) {
             // Nous définissons l'icône à utiliser pour le marqueur, sa taille affichée (iconSize), sa position (iconAnchor) et le décalage de son ancrage (popupAnchor)
             var myIcon = new L.Icon({
               options: {
                 iconSize: [50, 50],
                 iconAnchor: [25, 50],
                 popupAnchor: [-3, -76],
               }
             });
             console.log(city[ville].lat);
             console.log(city[ville].lon);
             console.log(city[ville].alt);

            var LeafIcon = L.Icon.extend({
                options: {
                    iconSize:     [38, 95],
                    shadowSize:   [50, 64],
                    iconAnchor:   [22, 94],
                    shadowAnchor: [4, 62],
                    popupAnchor:  [-3, -76]
                }
            });
            var greenIcon = L.icon({
                iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
                shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',

                iconSize:     [38, 95], // size of the icon
                shadowSize:   [50, 64], // size of the shadow
                iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 62],  // the same for the shadow
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            });



             var marker = new L.marker([city[ville].lat, city[ville].lon, city[ville].alt]).addTo(macarte);
             // Nous ajoutons la popup. A noter que son contenu (ici la variable ville) peut être du HTML
             marker.bindPopup(`<b> ${ville} <b><br>Lattitude: ${city[ville].lat} <br>Longitude: ${city[ville].lon} <br>Altitude: ${city[ville].alt} MAMSL`);

          }
           // Nous ajoutons la popup. A noter que son contenu (ici la variable ville) peut être du HTML
           home.bindPopup("Maison")
        }
        window.onload = function(){
		    // Fonction d'initialisation qui s'exécute lorsque le DOM est chargé
		    initMap();
      };
