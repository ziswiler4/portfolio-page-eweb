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
          <p><strong>Höhe:</strong> 1978 m. ü. M.</p>   
          <p><strong>Min. Temperatur:</strong> ${TTL_C}°C</p>
          <p><strong>Max. Temperatur:</strong> ${TTH_C}°C</p>
          <p><strong>Gefühlte Temperatur:</strong> ${TTTFEEL_C}°C</p>
          <p><strong>Windgeschwindigkeit:</strong> ${FF_KMH} km/h</p>
          <p><strong>Neuschnee:</strong> ${FRESHSNOW_MM} mm</p>
          <p><strong>Sonnenstunden:</strong> ${SUN_MIN}</p>
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

/* Abruf der API und Anzeige der Daten
fetch(
  "https://api.srgssr.ch/srf-meteo/v2/geolocationNames?name=sillerenb%C3%BChl",
  {
    method: "GET",
    headers: {
      Authorization: WEATHER_API_TOKEN,
      Accept: "application/json",
    },
  }
)
  .then((response) => response.json())
  .then((data) => {
    const locationsDiv = document.getElementById("locations");

    data.forEach((location) => {
      const locationDiv = document.createElement("div");
      locationDiv.classList.add("location");

      locationDiv.innerHTML = `
                  <h2>${location.name}</h2>
                  <p><strong>Höhe:</strong> ${location.height} m ü.M.</p>
                  <p><strong>Geolocation:</strong> [${location.geolocation.lat}, ${location.geolocation.lon}]</p>
                  <p><strong>Geolocation:</strong> ${location.geolocation.id}</p>
              `;

      // Schleife durch die geolocation_names für weitere Orte
      location.geolocation.geolocation_names.forEach((geoName) => {
        const geoNameDiv = document.createElement("div");
        geoNameDiv.classList.add("geolocation-name");
        geoNameDiv.innerHTML = `
                      <p>${geoName.name} (${geoName.plz}), ${geoName.province}, ${geoName.height} m ü.M.</p>
                  `;
        locationDiv.appendChild(geoNameDiv);
      });

      locationsDiv.appendChild(locationDiv);
    });
  })
  .catch((error) => {
    console.error("Es gab ein Problem mit der API-Anfrage:", error);
  }); */
