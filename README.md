# Peak Sight

# PWA that pinpoints where certain mountains are using your device's orientation, coordinates, altitude, and camera.

# Outline

Use `deviceorientation` event to figure out heading
(`deviceorientationabsolute` on Chrome)

Can get heading with this algorithm:

```javascript
function compassHeading(alpha, beta, gamma) {
  // Convert degrees to radians
  var alphaRad = alpha * (Math.PI / 180);
  var betaRad = beta * (Math.PI / 180);
  var gammaRad = gamma * (Math.PI / 180);

  // Calculate equation components
  var cA = Math.cos(alphaRad);
  var sA = Math.sin(alphaRad);
  var cB = Math.cos(betaRad);
  var sB = Math.sin(betaRad);
  var cG = Math.cos(gammaRad);
  var sG = Math.sin(gammaRad);

  // Calculate A, B, C rotation components
  var rA = -cA * sG - sA * sB * cG;
  var rB = -sA * sG + cA * sB * cG;
  var rC = -cB * cG;

  // Calculate compass heading
  var compassHeading = Math.atan(rA / rB);

  // Convert from half unit circle to whole unit circle
  if (rB < 0) {
    compassHeading += Math.PI;
  } else if (rA < 0) {
    compassHeading += 2 * Math.PI;
  }

  // Convert radians to degrees
  compassHeading *= 180 / Math.PI;

  return compassHeading;
}

window.addEventListener(
  "deviceorientation",
  function(evt) {
    var heading = null;

    if (evt.absolute === true && evt.alpha !== null) {
      heading = compassHeading(evt.alpha, evt.beta, evt.gamma);
    }

    // Do something with 'heading'...
  },
  false
);
```

Get coordinates and altitude from `navigator.geolocation.getCurrentPosition()`.

Build JSON mountain database by hand using Wikipedia pages: [List of mountain peaks of Oregon](https://en.wikipedia.org/wiki/List_of_mountain_peaks_of_Oregon)

Maybe only worry about showing mountains within 100 mile distance? Maybe less? Maybe user configurable (that would actually be cool)? If performance becomes an issue, can tap into WASM using Rust or Go.

Good resource: [http://cosinekitty.com/compass.html](http://cosinekitty.com/compass.html)
Convert world-space coordinates to screen-space coordinates: [StackOverflow](https://stackoverflow.com/questions/6139451/how-can-i-convert-3d-space-coordinates-to-2d-space-coordinates)

AWESOME RESOURCE: [https://stackoverflow.com/questions/16619104/perspective-projection-in-android-in-an-augmented-reality-application](https://stackoverflow.com/questions/16619104/perspective-projection-in-android-in-an-augmented-reality-application)

# Things to figure out

How to tell that user's current coordinates and heading are pointing towards another certain pair of coordinates.
How to tell where on screen to place point to indicate top of mountain based of off distance to point and device orientation (tilt/beta).

# Test points

Home:
Lat: 45.488652
Lon: -122.715925
Alt: 124 (meters)
Bearing: 26.3906
Beta: 76 (maybe try 80 or 84? sensor seems off)

Council Crest Tower:
Lat: 45.499278
Lon: -122.708417
Alt: 479 (meters) (tower is 152m tall)
