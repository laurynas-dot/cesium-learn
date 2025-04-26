Cesium.Ion.defaultAccessToken = window.CESIUM_TOKEN;

import { pickColor } from "./actions/Colors.js";
import { addDroneAction } from "./actions/Drone.js";

/** @type {import("cesium").Viewer} */
const viewer = new Cesium.Viewer('cesiumContainer', {
  terrain: Cesium.Terrain.fromWorldTerrain(),
});

const startCoordinates = Cesium.Cartesian3.fromDegrees(25.2798, 53.68916, 100000);
viewer.camera.setView({
  destination: startCoordinates,
  orientation: {
    heading: Cesium.Math.toRadians(0),
    pitch: Cesium.Math.toRadians(-30),
    roll: 0
  }
});

const entities = viewer.entities;

// Air Defence


const addAirDefence = (type, longitude, latitude, radius) => {
  const color = pickColor(type, 0.15);
  const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);
  const id = Cesium.createGuid();
  entities.add({
    id,
    position,
    ellipsoid: {
      radii: new Cesium.Cartesian3(radius, radius, radius),
      material: color,
    },
    properties: {
      remove: () => entities.remove(entities.getById(id)),
    }
  });
};

addAirDefence("friendly", 25.2798, 54.68916, 30000);

// UI Selectors
const actionPicker = document.getElementById("actionPicker");
const typePicker = document.getElementById("airDefenceTypePicker");
const radiusInput = document.getElementById("radiusInput");

const actionControls = {
  addAirDefence: document.getElementById("addAirDefenceControl"),
  addDrone: document.getElementById("addDroneControl"),
};

const updateUIVisibility = () => {
  for (const controlName in actionControls) {
    const control = actionControls[controlName];
    control.style.display = "none";
  }

  const selected = actionPicker.value;
  const control = actionControls[selected];
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
    if (!Cesium.defined(pickedObject))
      return;
    
    const removeAction = pickedObject.id?.properties?.remove;
    if (removeAction)
      removeAction.getValue()();
  },
  addDrone: (click) => addDroneAction(click, viewer),
}

// Bindings
viewer.screenSpaceEventHandler.setInputAction((click) => {
  const actionName = actionPicker.value;
  const action = actions[actionName];
  if (action)
    action(click);

}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

updateUIVisibility();