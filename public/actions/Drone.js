import { pickColor } from "./Colors.js";

const typePicker = document.getElementById("droneTypePicker");

/**
 * 
 * @param {{lon: number, lat: number}} start 
 * @param {{lon: number, lat: number}} end 
 * @param {import("cesium").EntityCollection} viewer - The Cesium viewer instance.
 */
const addDrone = (start, end, entities) => {
  const groupId = Cesium.createGuid();
  const fullColor = pickColor(typePicker.value);
  const transparentColor = pickColor(typePicker.value, 0.5);
  const startPosition = Cesium.Cartesian3.fromDegrees(start.lon, start.lat, 0);
  const endPosition = Cesium.Cartesian3.fromDegrees(end.lon, end.lat, 0);
  const droneStartPosition = Cesium.Cartesian3.fromDegrees(start.lon, start.lat, 10000);

  const startId = groupId + "-start";
  const endId = groupId + "-end";
  const droneId = groupId + "-drone";
  const remove = () => {
    const start = entities.getById(startId);
    const end = entities.getById(endId);
    const drone = entities.getById(droneId);

    entities.remove(start);
    entities.remove(end);
    entities.remove(drone);
  };

  entities.add({
    id: startId,
    position: startPosition,
    ellipse: {
      semiMajorAxis: 2500,
      semiMinorAxis: 2500,
      material: transparentColor,
      outline: true,
      outlineColor: fullColor,
      outlineWidth: 2,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    },
    properties: {
      remove,
    }
  });

  entities.add({
    id: endId,
    position: endPosition,
    ellipse: {
      semiMajorAxis: 2500,
      semiMinorAxis: 2500,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      outline: true,
      material: transparentColor,
      outlineColor: fullColor,
      outlineWidth: 2,
    },
    properties: {
      remove,
    }
  });

   entities.add({
     id: droneId,
     position: droneStartPosition,
     ellipsoid: {
       radii: new Cesium.Cartesian3(1000, 1000, 1000),
       material: fullColor,
     },
     properties: {
       remove,
     }
   });
};

let droneStart = undefined;

/**
 * A function to handle drone addition.
 * @param {import("cesium").ScreenSpaceEventHandler} click - The click event handler.
 * @param {import("cesium").Viewer} viewer - The Cesium viewer instance.
 */
export const addDroneAction = (click, viewer) => {
  const pickedPosition = viewer.scene.pickPosition(click.position);
  if (!Cesium.defined(pickedPosition))
    return;

  const cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
  const lon = Cesium.Math.toDegrees(cartographic.longitude);
  const lat = Cesium.Math.toDegrees(cartographic.latitude);

  if (droneStart === undefined) {
    droneStart = { lon, lat };
    return;
  }

  addDrone(droneStart, { lon, lat }, viewer.entities);
  droneStart = undefined;
};
