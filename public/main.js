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

// Air Defence
const pickColor = (type, alpha) => {
  switch (type) {
    case "friendly":
      return new Cesium.Color(0, 1, 0, alpha);
    case "enemy":
      return new Cesium.Color(1, 0, 0, alpha);
    default:
      return new Cesium.Color(1, 1, 1, alpha);
  }
};

const addAirDefence = (type, longitude, latitude, radius) => {
  const color = pickColor(type, 0.15);
  const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);
  entities.add({
    position,
    ellipsoid: {
      radii: new Cesium.Cartesian3(radius, radius, radius),
      material: color,
    }
  });
};

addAirDefence("friendly", 25.2798, 54.68916, 30000);

// Actions

viewer.screenSpaceEventHandler.setInputAction((click) => {
  const pickedPosition = viewer.scene.pickPosition(click.position);
  
  if (Cesium.defined(pickedPosition)) {
    const cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
    const lon = Cesium.Math.toDegrees(cartographic.longitude);
    const lat = Cesium.Math.toDegrees(cartographic.latitude);

    addAirDefence("enemy", lon, lat, 20000);
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);