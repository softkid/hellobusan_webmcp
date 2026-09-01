/**
 * Real-time IoT City Sensor Stream Service for HelloBusan WebMCP
 */

export function getLiveIotSensors() {
  return [
    {
      sensorId: "IOT-HAEUNDAE-CCTV-04",
      location: "Haeundae Beach Square",
      type: "Crowd Density",
      value: "Low (18% occupancy)",
      status: "NORMAL",
      icon: "📹"
    },
    {
      sensorId: "IOT-CENTUM-RAIN-01",
      location: "Centum City Underground Passage",
      type: "Rain Safety Corridor",
      value: "100% Dry Walking Route",
      status: "SAFE",
      icon: "🌧️"
    },
    {
      sensorId: "IOT-SUBWAY-LINE2-88",
      location: "Centum Station Elevator #3",
      type: "Accessibility Sensor",
      value: "Wheelchair & Stroller OK",
      status: "ACTIVE",
      icon: "♿"
    }
  ];
}
