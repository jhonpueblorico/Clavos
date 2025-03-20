// Función para cambiar de pantalla en la interfaz de usuario
function cambiarPantalla(pantalla) {
  const pantallas = document.querySelectorAll('.pantalla');
  pantallas.forEach(p => {
    p.style.display = 'none'; // Oculta todas las pantallas
  });
  document.getElementById(pantalla).style.display = 'block'; // Muestra la pantalla solicitada
}

// Función para obtener la ubicación del usuario
function obtenerUbicacion() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(mostrarUbicacion, mostrarErrorUbicacion);
  } else {
    alert("Geolocalización no es soportada por este navegador.");
  }
}

function mostrarUbicacion(position) {
  const ubicacionInput = document.getElementById('ubicacion');
  ubicacionInput.value = `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`;
}

function mostrarErrorUbicacion(error) {
  alert('Error al obtener ubicación: ' + error.message);
}

// Event Listener para el formulario de registro de clientes
document.getElementById('clienteForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const cedula = document.getElementById('cedula').value;
  const direccion = document.getElementById('direccion').value;
  const telefono = document.getElementById('telefono').value;
  const ubicacion = document.getElementById('ubicacion').value;

  // Asumiendo que 'db' es la instancia de Firestore inicializada en otro script
  db.collection("clientes").add({
    nombre,
    cedula,
    direccion,
    telefono,
    ubicacion
  })
  .then(docRef => {
    console.log("Cliente registrado con ID:", docRef.id);
    alert("Cliente registrado con éxito!");
    document.getElementById('clienteForm').reset(); // Limpia el formulario
    cambiarPantalla('inicio'); // Vuelve a la pantalla principal
  })
  .catch(error => {
    console.error("Error al agregar cliente:", error);
    alert("Error al registrar el cliente.");
  });
});

// Función para buscar clientes
function buscarClientes() {
  const input = document.getElementById('buscarCliente');
  const filter = input.value.toLowerCase();
  const nodes = document.getElementById('listaClientes').getElementsByTagName('li');

  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].innerText.toLowerCase().includes(filter)) {
      nodes[i].style.display = "block";
    } else {
      nodes[i].style.display = "none";
    }
  }
}
