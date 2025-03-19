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
