import { pickColor } from "./Colors.js";

const typePicker = document.getElementById("droneTypePicker");

/**
 * 
 * @param {{lon: number, lat: number}} start 
 * @param {{lon: number, lat: number}} end 
 * @param {import("cesium").Viewer} viewer - The Cesium viewer instance.
 */
const addDrone = (start, end, viewer) => {
  const entities = viewer.entities;
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

  const czml = [
    {
      id: "document",
      name: "Drone Flight",
      version: "1.0",
    },
    {
      id: droneId,
      availability: "2025-04-26T00:00:00Z/2025-04-26T00:05:00Z",
      position: {
        epoch: "2025-04-26T00:00:00Z",
        cartographicDegrees: [
          0, start.lon, start.lat, 10000,
          300, end.lon, end.lat, 10000,
        ],
      },
      point: {
        pixelSize: 15,
        color: {
          rgba: [fullColor.red * 255, fullColor.green * 255, fullColor.blue * 255, 255],
        },
        outlineColor: {
          rgba: [fullColor.red * 255, fullColor.green * 255, fullColor.blue * 255, 255],
        },
        outlineWidth: 2,
      },
    },
  ];

  const czmlDataSource = new Cesium.CzmlDataSource();
  czmlDataSource.load(czml).then(() => {
    viewer.dataSources.add(czmlDataSource);
    console.log("CZML Data Loaded Successfully");
  }).catch((error) => {
    console.error("Error loading CZML data:", error);
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

  addDrone(droneStart, { lon, lat }, viewer);
  droneStart = undefined;
};
