<?php
$initPoint = new Func("initPoint", function() use (&$initLat, &$initLon, &$Object, &$city) {
  for ($Point = 0.0; $Point < 100.0; $Point++) {
    $Lat = call($initLat, 47.97, 48.5);
    $Lon = call($initLon, -4.0, -1.0);
    $test = new Object("id", $Point, "Longitude", $Lon, "Lattitude", $Lat);
    $ville = _new($Object);
    set($ville, "id", $Point);
    set($ville, "lat", $Lat);
    set($ville, "lon", $Lon);
    call_method($city, "push", $ville);
  }
});
call($initPoint);
?>
