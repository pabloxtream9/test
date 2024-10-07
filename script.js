// Inicializar el mapa con Leaflet y OpenStreetMap
var map = L.map('map').setView([40.4168, -3.7038], 6); // Vista de Madrid por defecto

// Añadir el tileLayer de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Crear un grupo de clústeres de marcadores
var markers = L.markerClusterGroup();

// Función para registrar una incidencia
function registerIncident() {
    var type = document.getElementById('incident-type').value;
    var location = document.getElementById('incident-location').value;
    var date = document.getElementById('incident-date').value;
    var time = document.getElementById('incident-time').value;
    var weapons = document.getElementById('incident-weapons').value;
    var description = document.getElementById('incident-description').value;

    if (location.trim() === "") {
        alert("Introduce el lugar exacto de la incidencia.");
        return;
    }

    // Usar Nominatim para geocodificar el lugar de la incidencia
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la petición a Nominatim: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                alert("No se encontró la ubicación para la incidencia.");
                return;
            }

            // Obtener las coordenadas de la primera coincidencia
            var lat = parseFloat(data[0].lat);
            var lon = parseFloat(data[0].lon);

            // Definir color del marcador según el tipo de incidencia
            var markerColor = type === 'agresión' ? 'red' : 'blue';

            // Crear un marcador con el color correspondiente
            var marker = L.circleMarker([lat, lon], {
                radius: 10,
                fillColor: markerColor,
                color: markerColor,
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });

            // Añadir popup al marcador
            marker.bindPopup(`<b>${type.charAt(0).toUpperCase() + type.slice(1)}</b><br> 
            Día y hora: ${date} ${time}<br>
            Uso de armas: ${weapons}<br>
            Descripción: ${description}
            `);

            // Añadir el marcador al grupo de clústeres
            markers.addLayer(marker);

            // Añadir el grupo de clústeres al mapa (si no lo está ya)
            if (!map.hasLayer(markers)) {
                map.addLayer(markers);
            }

            // Centrar el mapa en la ubicación de la incidencia
            map.setView([lat, lon], 12);

            // Limpiar el campo de ubicación
            document.getElementById('incident-location').value = '';
        })
        .catch(error => {
            console.error("Error en la búsqueda:", error);
            alert("Ocurrió un error al registrar la incidencia. Ver consola para más detalles.");
        });
}

// Asignar funciones a los botones
document.getElementById('register-incident-btn').addEventListener('click', registerIncident);

// Función para centrar el mapa en una ubicación buscada
function searchLocation() {
    var location = document.getElementById('search-input').value;
    
    if (location.trim() === "") {
        alert("Introduce el nombre de una ciudad o pueblo.");
        return;
    }

    // Usar el servicio Nominatim de OpenStreetMap para geocodificar la ubicación
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert("No se encontró la ubicación.");
                return;
            }

            // Obtener las coordenadas de la primera coincidencia y centrar el mapa
            var lat = parseFloat(data[0].lat);
            var lon = parseFloat(data[0].lon);
            map.setView([lat, lon], 12);
        })
        .catch(error => {
            console.error("Error en la búsqueda:", error);
            alert("Ocurrió un error en la búsqueda.");
        });
}

// Asignar función al botón de búsqueda
document.getElementById('search-btn').addEventListener('click', searchLocation);

// Actualizar el contador de caracteres
document.getElementById('incident-description').addEventListener('input', function () {
    var maxChars = 200;
    var currentLength = this.value.length;
    var remainingChars = maxChars - currentLength;
    
    // Actualizar el texto del contador
    document.getElementById('char-count').textContent = remainingChars + " caracteres restantes";
});

// Simular un estado de inicio de sesión
let isLoggedIn = false; // Cambia esto a true cuando el usuario inicie sesión

// Función para mostrar el formulario de incidentes si el usuario ha iniciado sesión
function toggleIncidentForm() {
    const loginForm = document.getElementById('login-form');
    const incidentForm = document.getElementById('incident-form');

    if (isLoggedIn) {
        loginForm.classList.add('hidden');
        incidentForm.classList.remove('hidden');
    } else {
        loginForm.classList.remove('hidden');
        incidentForm.classList.add('hidden');
    }
}

// Simular el proceso de inicio de sesión
document.getElementById('login-btn').addEventListener('click', function () {
    isLoggedIn = true;
    toggleIncidentForm(); // Mostrar el formulario de incidentes
});

// Simular el proceso de registro (puedes agregar la lógica para el registro aquí)
document.getElementById('signup-btn').addEventListener('click', function () {
    alert('Funcionalidad de registro aún no implementada');
});

// Llamar a la función al cargar la página
toggleIncidentForm();

// Lógica de registro de incidentes y búsqueda de ubicaciones permanece igual
