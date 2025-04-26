export const pickColor = (type, alpha) => {
  switch (type) {
    case "friendly":
      return new Cesium.Color(0, 1, 0, alpha);
    case "enemy":
      return new Cesium.Color(1, 0, 0, alpha);
    default:
      return new Cesium.Color(1, 1, 1, alpha);
  }
};