Cesium.Ion.defaultAccessToken = window.CESIUM_TOKEN;
const viewer = new Cesium.Viewer('cesiumContainer', {
  terrain: Cesium.Terrain.fromWorldTerrain(),
});
