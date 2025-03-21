
// Variable global para saber si estamos editando un cliente
let editingIndex = null;

// Función para obtener la ubicación
function obtenerUbicacion() {
  if (!navigator.geolocation) {
    alert('La geolocalización no es soportada por tu navegador');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coords = position.coords;
      document.getElementById('ubicacion').value =
        `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
      alert('Ubicación obtenida correctamente');
    },
    (error) => {
      alert(`Error al obtener ubicación: ${error.message}`);
    }
  );
}

// Vista previa de imágenes
document.getElementById('fotos').addEventListener('change', function(e) {
  const preview = document.getElementById('preview');
  preview.innerHTML = '';
  Array.from(e.target.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.className = 'imagen-preview';
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

// Evento submit del formulario (para registrar o actualizar un cliente)
document.getElementById('clienteForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const cedula = document.getElementById('cedula').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const ubicacion = document.getElementById('ubicacion').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const fotosInput = document.getElementById('fotos');

  if (!nombre || !cedula || !direccion || !ubicacion || !telefono) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  // Si se han seleccionado nuevas fotos, se leen. Si no, se conservan las existentes (en modo edición).
  const totalFotos = fotosInput.files.length;
  if (totalFotos > 0) {
    const fotos = [];
    let fotosCargadas = 0;
    for (let i = 0; i < totalFotos; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(fotosInput.files[i]);
      reader.onload = function(e) {
        fotos.push(e.target.result);
        fotosCargadas++;
        if (fotosCargadas === totalFotos) {
          guardarCliente({ nombre, cedula, direccion, ubicacion, telefono, fotos });
        }
      };
    }
  } else {
    let fotos = [];
    if (editingIndex !== null) {
      const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
      fotos = clientes[editingIndex].fotos || [];
    }
    guardarCliente({ nombre, cedula, direccion, ubicacion, telefono, fotos });
  }
});

// Función para guardar o actualizar un cliente en localStorage
function guardarCliente(clienteData) {
  let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  if (editingIndex !== null) {
    // Modo edición
    clientes[editingIndex] = clienteData;
    alert('Cliente actualizado.');
    editingIndex = null;
    document.querySelector('#clienteForm button[type="submit"]').textContent = 'Guardar Cliente';
  } else {
    // Modo registro nuevo
    if (clientes.length >= 80) {
      // Si ya hay 80 clientes, se elimina el primero
      clientes.shift();
    }
    clientes.push(clienteData);
    alert('Cliente registrado con éxito.');
  }
  localStorage.setItem('clientes', JSON.stringify(clientes));
  document.getElementById('clienteForm').reset();
  document.getElementById('preview').innerHTML = '';
  cargarClientes();
  cambiarPantalla('lista');
}

// Cargar y mostrar la lista de clientes
function cargarClientes() {
  const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  const listaClientes = document.getElementById('listaClientes');
  listaClientes.innerHTML = '';
  if (clientes.length === 0) {
    listaClientes.innerHTML = '<p>No hay clientes registrados.</p>';
  } else {
    // Mostramos hasta los últimos 80 clientes en orden inverso
    const reversedClients = clientes.slice(-80).reverse();
    reversedClients.forEach((cliente, idx) => {
      // Índice real en el arreglo original
      const realIndex = clientes.length - 1 - idx;
      const divCliente = document.createElement('div');
      divCliente.classList.add('cliente');
      divCliente.innerHTML = `
        <span>${cliente.nombre || 'Sin nombre'}</span>
        <div>
          <button class="btn-detalles" onclick="verDetalles(${realIndex})">Detalles</button>
          <button class="btn-editar" onclick="editarCliente(${realIndex})">Editar</button>
          <button class="btn-eliminar" onclick="confirmarEliminar(${realIndex})">Eliminar</button>
        </div>
      `;
      listaClientes.appendChild(divCliente);
    });
  }
}

// Ver detalles de un cliente
function verDetalles(index) {
  const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  const cliente = clientes[index];
  let mapaLink = '';
  if (cliente.ubicacion && cliente.ubicacion.includes(',')) {
    const [lat, lon] = cliente.ubicacion.split(',');
    mapaLink = `
      <br>
      <a href="https://www.google.com/maps?q=${lat},${lon}" target="_blank" class="mapa-link">
        Ver en Google Maps
      </a>
    `;
  }
  const detalleCliente = document.getElementById('detalleCliente');
  detalleCliente.innerHTML = `
    <strong>Nombre:</strong> ${cliente.nombre || 'Sin nombre'} <br>
    <strong>Cédula:</strong> ${cliente.cedula || 'No registrada'} <br>
    <strong>Dirección:</strong> ${cliente.direccion || 'No registrada'} <br>
    <strong>Ubicación:</strong> ${cliente.ubicacion || 'No registrada'} ${mapaLink} <br>
    <strong>Teléfono:</strong> ${cliente.telefono || 'No registrado'} <br>
    <strong>Fotos:</strong><br>
    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
      ${
        cliente.fotos && cliente.fotos.length > 0
          ? cliente.fotos.map(foto => `<img src="${foto}" class="imagen-preview" style="max-width: 150px; height: auto;">`).join('')
          : 'No hay fotos'
      }
    </div>
  `;
  cambiarPantalla('detalles');
}

// Función para editar un cliente
function editarCliente(index) {
  const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  const cliente = clientes[index];
  document.getElementById('nombre').value = cliente.nombre;
  document.getElementById('cedula').value = cliente.cedula;
  document.getElementById('direccion').value = cliente.direccion;
  document.getElementById('ubicacion').value = cliente.ubicacion;
  document.getElementById('telefono').value = cliente.telefono;

  // Mostrar vista previa de fotos ya existentes
  const preview = document.getElementById('preview');
  preview.innerHTML = '';
  if (cliente.fotos && cliente.fotos.length > 0) {
    cliente.fotos.forEach(foto => {
      const img = document.createElement('img');
      img.src = foto;
      img.className = 'imagen-preview';
      preview.appendChild(img);
    });
  }

  // Establecer el índice de edición y cambiar el botón a "Actualizar Cliente"
  editingIndex = index;
  document.querySelector('#clienteForm button[type="submit"]').textContent = 'Actualizar Cliente';
  cambiarPantalla('registro');
}

// Función para confirmar y eliminar un cliente
function confirmarEliminar(index) {
  if (confirm('¿Estás seguro de eliminar este cliente?')) {
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    clientes.splice(index, 1);
    localStorage.setItem('clientes', JSON.stringify(clientes));
    alert('Cliente eliminado.');
    cargarClientes();
  }
}

// Función para cambiar de pantalla
function cambiarPantalla(pantalla) {
  document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activo'));
  document.getElementById(pantalla).classList.add('activo');
  if (pantalla === 'lista') {
    cargarClientes();
  }
}

// Función de búsqueda (se puede implementar según se requiera)
function buscarClientes() {
  const term = document.getElementById('buscarCliente').value.toLowerCase();
  const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  const listaClientes = document.getElementById('listaClientes');
  listaClientes.innerHTML = '';

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(term) ||
    cliente.cedula.toLowerCase().includes(term) ||
    cliente.direccion.toLowerCase().includes(term) ||
    cliente.telefono.toLowerCase().includes(term)
  );

  if (clientesFiltrados.length === 0) {
    listaClientes.innerHTML = '<p>No se encontraron clientes.</p>';
  } else {
    clientesFiltrados.reverse().forEach((cliente, idx) => {
      const indiceOriginal = clientes.findIndex(c => c.cedula === cliente.cedula);
      const divCliente = document.createElement('div');
      divCliente.classList.add('cliente');
      divCliente.innerHTML = `
        <span>${cliente.nombre || 'Sin nombre'}</span>
        <div>
          <button class="btn-detalles" onclick="verDetalles(${indiceOriginal})">Detalles</button>
          <button class="btn-editar" onclick="editarCliente(${indiceOriginal})">Editar</button>
          <button class="btn-eliminar" onclick="confirmarEliminar(${indiceOriginal})">Eliminar</button>
        </div>
      `;
      listaClientes.appendChild(divCliente);
    });
  }
}
