Cesium.Ion.defaultAccessToken = window.CESIUM_TOKEN;

/** @type {import("cesium").Viewer} */
const viewer = new Cesium.Viewer('cesiumContainer', {
  terrain: Cesium.Terrain.fromWorldTerrain(),
});

const vilniusCoordinates = Cesium.Cartesian3.fromDegrees(25.2798, 54.68916, 0);
viewer.camera.flyTo({
  destination: vilniusCoordinates,
});