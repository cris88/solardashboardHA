const previewCard = document.querySelector("solar-dashboard-card");

// This is the smallest useful Home Assistant mock: the card is exercised through
// the same config and hass properties that Lovelace uses in production.
previewCard?.setConfig({
  type: "custom:solar-dashboard-card",
  solar_power: "sensor.solar_power",
  home_power: "sensor.home_power",
  battery_level: "sensor.battery_level",
  grid_power: "sensor.grid_power",
});

if (previewCard) {
  previewCard.hass = {
    states: {
      "sensor.solar_power": { state: "573", attributes: { unit_of_measurement: "W" } },
      "sensor.home_power": { state: "1.4", attributes: { unit_of_measurement: "kW" } },
      "sensor.battery_level": { state: "54", attributes: { unit_of_measurement: "%" } },
      "sensor.grid_power": { state: "0", attributes: { unit_of_measurement: "W" } },
    },
  };
}
