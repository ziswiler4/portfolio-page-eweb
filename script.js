document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio-Website wurde geladen!");
});

// API Wetterdaten Adelboden
fetch("https://api.srgssr.ch/srf-meteo/v2/forecastpoint/46.4716%2C7.5181", {
  method: "GET",
  headers: {
    Authorization: WEATHER_API_TOKEN,
    Accept: "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    const now = new Date();

    // Funktion, um die nächstliegenden Wetterdaten innerhalb der 3-stündlichen Updates zu finden
    const getNearestData = (threeHours, currentTime) => {
      let nearestEntry = null;
      let smallestDifference = null;

      threeHours.forEach((entry) => {
        const entryTime = new Date(entry.date_time);
        const timeDifference = Math.abs(currentTime - entryTime);

        if (
          smallestDifference === null ||
          timeDifference < smallestDifference
        ) {
          nearestEntry = entry;
          smallestDifference = timeDifference;
        }
      });

      return nearestEntry;
    };

    if (data && data.three_hours) {
      const nearestData = getNearestData(data.three_hours, now);

      if (nearestData) {
        const { TTL_C, TTH_C, FF_KMH, FRESHSNOW_MM, SUN_MIN, TTTFEEL_C } =
          nearestData;

        const weatherDiv = document.getElementById("weather");
        weatherDiv.innerHTML = `
          <p><strong>Min. Temperatur:</strong> ${TTL_C}°C</p>
          <p><strong>Max. Temperatur:</strong> ${TTH_C}°C</p>
          <p><strong>Gefühlte Temperatur:</strong> ${TTTFEEL_C}°C</p>
          <p><strong>Windgeschwindigkeit:</strong> ${FF_KMH} km/h</p>
          <p><strong>Neuschnee:</strong> ${FRESHSNOW_MM} mm</p>
        `;
      } else {
        console.error("Keine Wetterdaten für den heutigen Tag gefunden.");
      }
    } else {
      console.error("Die Antwort enthält keine 'three_hours'-Daten.");
    }
  })
  .catch((error) => {
    console.error("Fehler bei der API-Anfrage:", error);
  });
