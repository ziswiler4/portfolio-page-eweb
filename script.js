document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio-Website geladen!");
});

// Abruf der API und Anzeige der Daten
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
  });
