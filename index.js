const originCoords = {
  absolute: {
    lat: 45.488652,
    lon: -122.715925,
    alt: 124
  },
  relative: {
    x: 0,
    y: 0,
    z: 0
  }
};

// const originCoords = {
//   absolute: {
//     lat: 45.498953,
//     lon: -122.708429,
//     alt: 124
//   }
// };

const cityParkCoords = {
  lat: 45.492132,
  lon: -122.721062,
  alt: 124
};

const destCoords = {
  absolute: {
    lat: 45.499278,
    lon: -122.708417,
    alt: 479
  },
  relative: {
    x: 0.010626,
    y: -0.007508,
    z: 355
  }
};

const originDestRelational = {
  bear: 26.3906, // Calculate from both coordinate points
  beta: 76, // Get from `deviceorientation` event
  dist: 1.366 // kilometers. Calculate from both coordinate points
};

const viewPort = {
  width: window.innerWidth,
  height: window.innerHeight
};

// function projectionCoordinates(origin, destination) {
//   let x = null;
//   let y = null;

//   // const Dx = destCoords.relative.x;
//   // const Dy = destCoords.relative.y;
//   // const Dz = destCoords.relative.z;
//   const Dx = destination.x - origin.x;
//   const Dy = destination.y - origin.y;
//   const Dz = destination.z - origin.z;
//   console.log(`${Dx} ${Dy} ${Dz}`);

//   const vpMin = Math.min(viewPort.width, viewPort.height);
//   const screenRatio = (viewPort.width + viewPort.height) / 2;

//   // x = (Dx / Dz) * (vpMin / 2);
//   x = (Dx / Dz) * (screenRatio / 2);

//   // y = (Dy / Dz) * (vpMin / 2);
//   y = (Dy / Dz) * (screenRatio / 2);

//   // x += vpMin / 2;
//   x += viewPort.width / 2;
//   // y += vpMin / 2;
//   y += viewPort.height / 2;

//   console.log(`w: ${viewPort.width}px h: ${viewPort.height}px`);
//   console.log(`x: ${x}, y: ${y}`);

//   // We need to offset these coordinates by:
//   // bearing
//   // tilt (beta)
//   return { x, y };
// }

// function projectionCoordinates(origin, destination) {
//   // https://stackoverflow.com/questions/55445154/how-to-get-xy-screen-coordinates-from-xyz-world-coordinates
//   const relativeX = destination.x - origin.x;
//   const relativeY = destination.y - origin.y;
//   const relativeZ = destination.z - origin.z;
//   console.log(`relativeX: ${relativeX}`);
//   console.log(`relativeY: ${relativeY}`);
//   console.log(`relativeZ: ${relativeZ}`);

//   // origin.x = origin.x / 100;
//   // origin.y = origin.y / 100;
//   // origin.z = origin.z / 100;
//   // destination.x = destination.x / 100;
//   // destination.y = destination.y / 100;
//   // destination.z = destination.z / 100;

//   // This won't do, will it?
//   // Need a world to camera matrix?
//   // https://www.scratchapixel.com/lessons/3d-basic-rendering/computing-pixel-coordinates-of-3d-point/mathematics-computing-2d-coordinates-of-3d-points
//   const xPerspective = relativeX / relativeZ;
//   const yPerspective = relativeY / relativeZ;
//   console.log(`xPerspective ${xPerspective}`);
//   console.log(`yPerspective ${yPerspective}`);

//   // const xNormalized = (xPerspective + viewPort.width / 2) / viewPort.width;
//   // const yNormalized = (yPerspective + viewPort.height / 2) / viewPort.height;

//   // const xRaster = Math.floor(xNormalized * viewPort.width);
//   const xRaster = Math.floor(
//     (xPerspective * viewPort.width) / 2 + viewPort.width / 2
//   );
//   // const yRaster = Math.floor((1 - yNormalized) * viewPort.height);
//   const yRaster = Math.floor(
//     (yPerspective * viewPort.height) / 2 - viewPort.height / 2
//   );

//   console.log(`xRaster: ${xRaster}`);
//   console.log(`yRaster: ${yRaster}`);

//   return { x: xRaster, y: yRaster };
// }

// function placePoint() {
//   const coords = projectionCoordinates(
//     llaToCartesion(originCoords.absolute),
//     llaToCartesion(destCoords.absolute)
//   );

//   console.log(`x: ${coords.x}, y: ${coords.y}`);

//   const point = document.createElement("div");
//   const pointWidth = 5;
//   const pointHeight = 5;

//   point.setAttribute(
//     "style",
//     `position: absolute; width: ${pointWidth}px; height: ${pointHeight}px; background-color: red; left: ${coords.x -
//       pointWidth / 2}px; top: ${coords.y - pointHeight / 2}px`
//   );

//   document.getElementById("main").append(point);
// }

function llaToCartesion({ lat, lon, alt }) {
  const cosLat = Math.cos((lat * Math.PI) / 180.0);
  const sinLat = Math.sin((lat * Math.PI) / 180.0);
  const cosLon = Math.cos((lon * Math.PI) / 180.0);
  const sinLon = Math.sin((lon * Math.PI) / 180.0);
  const rad = 6378137.0;
  const f = 1.0 / 298.257224;
  const C =
    1.0 / Math.sqrt(cosLat * cosLat + (1 - f) * (1 - f) * sinLat * sinLat);
  const S = (1.0 - f) * (1.0 - f) * C;
  const h = alt;

  const x = (rad * C + h) * cosLat * cosLon;
  const y = (rad * C + h) * cosLat * sinLon;
  const z = (rad * S + h) * sinLat;

  return { x, y, z };
}

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

// console.log(llaToCartesion(originCoords.absolute));
console.log("Council Crest Tower Point:");
console.log(llaToCartesion(destCoords.absolute));

// window.onload = placePoint;
window.onload = () => {
  const scene = document.getElementById("global-scene");
  const rig = document.createElement("a-entity");
  // rig.setAttribute("position", "0 0 0");
  rig.appendChild(document.createElement("a-camera"));
  const sphere = document.createElement("a-sphere");
  sphere.setAttribute("radius", "20");
  sphere.setAttribute("color", "#EF2D5E");
  // sphere.setAttribute("position", "814.5 182.1 -1081.0");

  const initPositioning = evt => {
    window.removeEventListener("deviceorientationabsolute", initPositioning);

    let heading = null;

    if (evt.absolute === true && evt.alpha !== null) {
      heading = compassHeading(evt.alpha, evt.beta, evt.gamma);
    }

    console.log(`heading: ${heading}`);

    rig.setAttribute("rotation", `0 ${heading} 0`);

    navigator.geolocation.getCurrentPosition(pos => {
      console.log(pos.coords);

      const camCoords = llaToCartesion({
        lat: pos.latitude,
        lon: pos.longitude,
        alt: pos.altitude
      });

      rig.setAttribute(
        "position",
        `${camCoords.x} ${camCoords.y} ${camCoords.z}`
      );

      rig.setAttribute(
        "position",
        `${camCoords.x} ${camCoords.y} ${camCoords.z}`
      );

      const sphereCoords = llaToCartesion({ ...dest.coords.absolute });

      sphere.setAttribute(
        "position",
        `${sphereCoords.x} ${sphereCoords.y} ${sphereCoords.z}`
      );

      scene.appendChild(rig);
      scene.appendChild(sphere);
    });
  };

  window.addEventListener("deviceorientationabsolute", initPositioning, false);
};
