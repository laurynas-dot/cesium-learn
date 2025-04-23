Cesium.Ion.defaultAccessToken = window.CESIUM_TOKEN;

/** @type {import("cesium").Viewer} */
const viewer = new Cesium.Viewer('cesiumContainer', {
  terrain: Cesium.Terrain.fromWorldTerrain(),
});

const vilniusCoordinates = Cesium.Cartesian3.fromDegrees(25.2798, 54.68916, 0);
viewer.camera.flyTo({
  destination: vilniusCoordinates,
});

const entities = viewer.entities;

// This represents air defence over Vilnius
const defenceRadius = 20000;
entities.add({
  position: vilniusCoordinates,
  ellipsoid: {
    radii: new Cesium.Cartesian3(defenceRadius, defenceRadius, defenceRadius),
    material: new Cesium.Color(0, 1, 0, 0.15),
  }
});