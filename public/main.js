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
    },
    properties: {
      isAirDefence: true
    }
  });
};

addAirDefence("friendly", 25.2798, 54.68916, 30000);

// UI Selectors
const actionPicker = document.getElementById("actionPicker");
const typePicker = document.getElementById("typePicker");
const radiusInput = document.getElementById("radiusInput");

const actionControls = {
  addAirDefence: document.getElementById("addAirDefenceControl"),
};

const updateUIVisibility = () => {
  for (const controlName in actionControls) {
    const control = actionControls[controlName];
    control.style.display = "none";
  }

  const selected = actionPicker.value;
  control = actionControls[selected];
  if (control)
    control.style.display = "inline-block";
}

actionPicker.addEventListener("change", updateUIVisibility);

// Actions
const actions = {
  addAirDefence: (click) => {
    const pickedPosition = viewer.scene.pickPosition(click.position);

    if (Cesium.defined(pickedPosition)) {
      const cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
      const lon = Cesium.Math.toDegrees(cartographic.longitude);
      const lat = Cesium.Math.toDegrees(cartographic.latitude);
  
      let radius = 20000;
      try {
        radius = parseFloat(radiusInput.value);
      } catch {
        console.log("failed to parse radius input");
      }

      addAirDefence(typePicker.value, lon, lat, radius);
    }
  },
  deleteEntity: (click) => {
    console.log("Delete");
    const pickedObject = viewer.scene.pick(click.position);
    if (Cesium.defined(pickedObject) && pickedObject.id?.properties?.isAirDefence)
      entities.remove(pickedObject.id);
  }
}

// Bindings
viewer.screenSpaceEventHandler.setInputAction((click) => {
  const actionName = actionPicker.value;
  const action = actions[actionName];
  if (action)
    action(click);

}, Cesium.ScreenSpaceEventType.LEFT_CLICK);