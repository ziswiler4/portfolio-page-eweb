document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio-Website wurde geladen!");
});

// API Wetterdaten Adelboden
fetch(`https://api.srgssr.ch/srf-meteo/v2/forecastpoint/46.4716%2C7.5181`, {
  method: "GET",
  headers: {
    Authorization: "Bearer " + WEATHER_API_TOKEN,
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

    const weatherExplanation = document.getElementById("weatherExplanation");

    if (data && data.three_hours) {
      const nearestData = getNearestData(data.three_hours, now);

      if (nearestData) {
        const { TTL_C, TTH_C, FF_KMH, FRESHSNOW_MM, TTTFEEL_C } = nearestData;

        const weatherDiv = document.getElementById("weather");
        weatherDiv.innerHTML = `
          <p><strong>Min. Temperatur:</strong> ${TTL_C}°C</p>
          <p><strong>Max. Temperatur:</strong> ${TTH_C}°C</p>
          <p><strong>Gefühlte Temperatur:</strong> ${TTTFEEL_C}°C</p>
          <p><strong>Windgeschwindigkeit:</strong> ${FF_KMH} km/h</p>
          <p><strong>Neuschnee:</strong> ${FRESHSNOW_MM} mm</p>
        `;
      }
    } else {
      // Keine Daten vorhanden
      console.error("Es gab leider ein Problem mit der API Wetter Abfrage.");
      weatherExplanation.textContent =
        "Es gab leider ein Problem mit der Wetterabfrage.";
    }
  })
  .catch((error) => {
    console.error(
      "Es gab leider einen Fehler mit der API Wetter Abfrage.",
      error
    );
  });

// API Astronomy picture of the day
const today = new Date();
const formattedDate = today.toISOString().split("T")[0];

fetch(
  `https://api.nasa.gov/planetary/apod?api_key=${STARS_API_TOKEN}&date=${formattedDate}`
)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Fehler beim Abrufen der Daten: " + response.status);
    }
    return response.json();
  })
  .then((data) => {
    console.log("API Daten:", data);

    const imgElement = document.getElementById("apodImage");
    const explanationElement = document.getElementById("apodExplanation");

    // Überprüfung des Dateityps (Bild)
    if (data.media_type === "image") {
      imgElement.src = data.url;

      // Bildbeschreibung anzeigen, wenn auf das Bild geklickt wird
      imgElement.addEventListener("click", () => {
        alert(data.explanation);
      });
    } else {
      // Falls kein Bild verfügbar ist
      imgElement.style.display = "none";
      explanationElement.textContent = "Heute ist leider kein Bild verfügbar.";
    }
  })
  .catch((error) => {
    console.error("Fehler bei der API-Anfrage:", error);
  });
