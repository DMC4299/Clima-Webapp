const apiKey = "81206d4c77244efb81364333252002"; 
function mostrarCargando() {
    document.getElementById("resultado").innerHTML = '<div class="loader"></div>';
}

function mostrarError(mensaje) {
    document.getElementById("resultado").innerHTML = `<p class="error">⚠️ ${mensaje}</p>`;
}

function mostrarClima(data) {
    const climaHTML = `
        <div class="clima">
            <h2>${data.location.name}, ${data.location.country}</h2>
            <p><strong>🌡️ Temperatura:</strong> ${data.current.temp_c}°C</p>
            <p><strong>☁️ Clima:</strong> ${data.current.condition.text}</p>
            <p><strong>💨 Viento:</strong> ${data.current.wind_kph} km/h</p>
            <img src="https:${data.current.condition.icon}" alt="Clima">
        </div>
    `;
    document.getElementById("resultado").innerHTML = climaHTML;
    cambiarFondo(data.current.condition.text); 
}

function mostrarPredicciones(data) {
    const predicciones = data.forecast.forecastday;
    let prediccionHTML = '<h3>Predicciones para los próximos días:</h3><div class="predicciones">';

    predicciones.forEach(dia => {
        prediccionHTML += `
            <div class="dia">
                <h4>${dia.date}</h4>
                <img src="https:${dia.day.condition.icon}" alt="Clima">
                <p>${dia.day.avgtemp_c}°C</p>
                <p>${dia.day.condition.text}</p>
            </div>
        `;
    });
    prediccionHTML += '</div>';
    document.getElementById("predicciones").innerHTML = prediccionHTML;
}

function buscarClima() {
    const ciudad = document.getElementById("ciudad").value.trim();
    if (!ciudad) {
        mostrarError("Por favor, ingresa el nombre de una ciudad.");
        return;
    }

    mostrarCargando();
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${ciudad}&days=3&lang=es`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                mostrarError(data.error.message);
            } else {
                mostrarClima(data);
                mostrarPredicciones(data);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            mostrarError("No se pudo obtener el clima. Intenta de nuevo.");
        });
}

function obtenerGeolocalizacion() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3&lang=es`;

            mostrarCargando();
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    mostrarClima(data);
                    mostrarPredicciones(data);
                })
                .catch(error => {
                    console.error("Error:", error);
                    mostrarError("No se pudo obtener tu ubicación. Intenta de nuevo.");
                });
        });
    } else {
        mostrarError("Geolocalización no disponible.");
    }
}

function cambiarFondo(clima) {
    let fondoUrl = '#87CEEB'; 

    if (clima.includes("soleado")) {
        fondoUrl = '#FFD700'; 
    } else if (clima.includes("lluvioso") || clima.includes("tormenta")) {
        fondoUrl = '#1E1E1E'; 
    } else if (clima.includes("nublado")) {
        fondoUrl = '#A9A9A9';
    }
    document.body.style.backgroundColor = fondoUrl;
}
