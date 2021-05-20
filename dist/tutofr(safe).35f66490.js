// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"tutofr(safe).js":[function(require,module,exports) {
// On initialise la latitude et la longitude de l'habitation du client (centre de la carte)
// Au préalable séléctionné/donné par l'utilisateur, dans le cas contraire:
// Se positionner sur Paris.
var lat_home = 48.73056610085155;
var lon_home = -3.460834918664013;
var macarte = null;
var markerClusters; // Servira à stocker les groupes de marqueurs
// Nous initialisons un tableau city qui contiendra les "ville"
//list = nombre d'enregistrement fait par le GPS, sur la BDD, encore accessible

var list = 0;
var city = new Array(list); //fonction donnant un nombre random entre un min et un max

function initCoord(min, max) {
  min = min;
  max = max;
  return Math.random() * (max - min) + min;
} // Fonction d'initialisation de points (randoms) sur la carte


function initPoint() {
  for (var point = 0; point < 10; point++) {
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
    Alt = initCoord(-4, 20); // Pour la vallé du Stanco et ses alentours:
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

initPoint(); // Fonction d'initialisation de la carte

function initMap() {
  // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
  macarte = L.map('map').setView([lat_home, lon_home], 11);
  markerClusters = L.markerClusterGroup(); // Nous initialisons les groupes de marqueurs
  // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr

  L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    // Source des données
    attribution: 'données © OpenStreetMap/ODbL - rendu OSM France',
    minZoom: 1,
    maxZoom: 20
  }).addTo(macarte); //Création du périmêtre de la maison, autour du quel, la position du chien n'est pas pris en compte

  var home = L.circle([48.732675, -3.446217], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    //Radius = Rayon "Maison"
    radius: 500
  }).addTo(macarte); //Création du boutton "afficher Menu"
  //     /!\ PAS FINI /!\

  var command = L.control({
    position: 'topright'
  });

  command.onAdd = function (macarte) {
    var div = L.DomUtil.create('div', 'command');
    div.innerHTML += '<button><img href="images/icon_plus.png" width="100px" /></button>';
    return div;
  };

  command.addTo(macarte);

  for (var i = 0; i < city.length - 1; i++) {
    var latlngs = [[city[i].lat, city[i].lon], [city[i + 1].lat, city[i + 1].lon]];
    var polyline = L.polyline(latlngs, {
      color: '#C50022'
    }).addTo(macarte); //Création du tracé GPS qui suit les routes
    // L.Routing.control({
    //   waypoints:[
    //     //L.latLng(48.56036426785153, -3.1599197957359926),
    //     L.latLng(city[i].lat, city[i].lon),
    //     //L.latLng(48.51278434587372, -2.779401099923159)],
    //     L.latLng(city[i+1].lat, city[i+1].lon)],
    //      router: new L.Routing.OSRMv1({
    //        profile: 'route/v1/driving',         // /!\ IMPORTANT /!\ : Suffixe de serviceUrl
    //        serviceUrl: 'http://192.168.15.87:5000'  // Permet  http://localhost:5000
    //      }),
    //   // Class "animate" permet de régler (en CSS) certain détail de l'animation (vitesse d'exécution, temps avant exécution, coleur, etc...)
    //   lineOptions: {
    //     styles: [{className: 'animate'}]
    //   },
    //   draggableWaypoints: false,
    //   addWaypoints: false
    // }).addTo(macarte);
  } //test pour ajout dans tableau city


  for (ville in city) {
    // Nous définissons l'icône à utiliser pour le marqueur, sa taille affichée (iconSize), sa position (iconAnchor) et le décalage de son ancrage (popupAnchor)
    var marker = L.Icon({
      options: {
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [-3, -76]
      }
    });
    var blue_marker = new marker({
      iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png',
      shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png'
    });
    console.log(city[ville].lat);
    console.log(city[ville].lon);
    console.log(city[ville].alt); // var LeafIcon = L.Icon.extend({
    //      options: {
    //         iconSize:     [38, 95],
    //         shadowSize:   [50, 64],
    //         iconAnchor:   [22, 94],
    //         shadowAnchor: [4, 62],
    //         popupAnchor:  [-3, -76]
    //      }
    //  });
    //  var greenIcon = new LeafIcon({
    //      iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png',
    //      shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png'
    //  });

    marker = L.marker([city[ville].lat, city[ville].lon, city[ville].alt]).addTo(macarte); //.bindPopup(`<b> ${ville} <b><br>Lattitude: ${city[ville].lat} <br>Longitude: ${city[ville].lon} <br>Altitude: ${city[ville].alt} MAMSL`);
    // Nous ajoutons la popup. A noter que son contenu (ici la variable ville) peut être du HTML

    marker.bindPopup("<b> ".concat(ville, " <b><br>Lattitude: ").concat(city[ville].lat, " <br>Longitude: ").concat(city[ville].lon, " <br>Altitude: ").concat(city[ville].alt, " MAMSL"));
  }

  macarte.addLayer(markerClusters); // Nous ajoutons la popup. A noter que son contenu (ici la variable ville) peut être du HTML

  home.bindPopup("Maison");
}

window.onload = function () {
  // Fonction d'initialisation qui s'exécute lorsque le DOM est chargé
  initMap();
};
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "34371" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","tutofr(safe).js"], null)
//# sourceMappingURL=/tutofr(safe).35f66490.js.map