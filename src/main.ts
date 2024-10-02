export class Participante {
  nombre: string;
  id: number;
  compras: [string, number][];
  participa: Map<string, boolean>;
  totalAPoner: number;
  balanceTotal: number;

  constructor(nombre: string, id: number) {
    this.nombre = nombre;
    this.id = id;
    this.compras = [];
    this.participa = new Map();
    this.totalAPoner = 0;
    this.balanceTotal = 0;
  }

  agregarCompra(producto: string, precio: number) {
    this.compras.push([producto, precio]);
    this.participa.set(producto, true);
  }

  
  

  // Método para actualizar la participación de una compra


  actualizarParticipacion(producto: string, participa: boolean) {
    if (this.participa.has(producto)) {
      this.participa.set(producto, participa);
    } else {
      console.log(`${producto} no existe en las compras de ${this.nombre}.`);
    }
  }


  calcularBalance() {
      const totalCompras = this.compras.reduce((sum, [, precio]) => sum + precio, 0);
      this.balanceTotal = totalCompras - this.totalAPoner;
    }
  }

  let asignarId: number = 1;
  export const listaDeParticipantes: Participante[] = [];
  
  export function agregarParticipante(nombre: string) {
      const nuevoParticipante = new Participante(nombre, asignarId);
      listaDeParticipantes.push(nuevoParticipante);
      asignarId++;
  }
  
  export function editarParticipante(id: number, nuevoNombre: string) {
      const participante = listaDeParticipantes.find(p => p.id === id);
      if (participante) {
          participante.nombre = nuevoNombre;
          return true;
      }
      return false;
  }
  
  export function eliminarParticipante(id: number) {
      const index = listaDeParticipantes.findIndex(p => p.id === id);
      if (index !== -1) {
          listaDeParticipantes.splice(index, 1);
          return true;
      }
      return false;
  }

  export function agregarCompra(id: number, producto: string, precio: number): boolean {
    const participante = listaDeParticipantes.find(p => p.id === id);
    if (participante) {
        console.log(`Participante encontrado: ${participante.nombre}`);
        participante.agregarCompra(producto, precio);
        return true;
    } else {
        console.log(`Participante con ID ${id} no encontrado.`);
    }
    return false;
}



  export function editarCompra(id: number, productoOriginal: string, nuevoProducto: string, nuevoPrecio: number): boolean {
    const participante = listaDeParticipantes.find(p => p.id === id);
    if (participante) {
        const compraIndex = participante.compras.findIndex(c => c[0] === productoOriginal);
        if (compraIndex !== -1) {
            participante.compras[compraIndex] = [nuevoProducto, nuevoPrecio];
            participante.participa.set(nuevoProducto, true);
            participante.participa.delete(productoOriginal);
            return true;
        }
    }
    return false;
}

export function eliminarCompra(id: number, producto: string): boolean {
  const participante = listaDeParticipantes.find(p => p.id === id);
  if (participante) {
      const compraIndex = participante.compras.findIndex(c => c[0] === producto);
      if (compraIndex !== -1) {
          participante.compras.splice(compraIndex, 1);
          participante.participa.delete(producto);
          return true;
      }
  }
  return false;
}


function recogerListaDeCompras(): [string, number][] {
  return listaDeParticipantes.flatMap(participante => participante.compras);
}

function aplicarComprasAParticipantes() {
  const productos = new Set(recogerListaDeCompras().map(([producto]) => producto));
  listaDeParticipantes.forEach(participante => {
    productos.forEach(producto => {
      if (!participante.participa.has(producto)) {
        participante.participa.set(producto, true);
      }
    });
  });
}

export function modificarParticipacion(id: number, producto: string, participa: boolean): boolean {
  const participante = listaDeParticipantes.find(p => p.id === id);
  if (participante) {
    participante.actualizarParticipacion(producto, participa);
    return true;
  }
  console.log(`Participante con ID ${id} no encontrado.`);
  return false;
}


export function calcularDivisionCuenta(): { totalCuenta: number, totalesPorParticipante: Map<string, number> } {
  const totalCuenta = recogerListaDeCompras().reduce((sum, [, precio]) => sum + precio, 0);
  const totalesPorParticipante = new Map<string, number>();

  listaDeParticipantes.forEach(participante => {
    totalesPorParticipante.set(participante.nombre, 0);
  });

  recogerListaDeCompras().forEach(([producto, precio]) => {
    const participantesEnCompra = listaDeParticipantes.filter(p => p.participa.get(producto));
    
    if (participantesEnCompra.length > 0) {
      const precioPorParticipante = precio / participantesEnCompra.length;
      participantesEnCompra.forEach(p => {
        const totalActual = totalesPorParticipante.get(p.nombre) || 0;
        totalesPorParticipante.set(p.nombre, totalActual + precioPorParticipante);
      });
    }
  });

  listaDeParticipantes.forEach(p => {
    p.totalAPoner = totalesPorParticipante.get(p.nombre) || 0;
    p.calcularBalance();
  });

  return { totalCuenta, totalesPorParticipante };
}

export function repartir(participantes: Participante[]): { desde: string, hacia: string, cantidad: number }[] {
  const transferencias: { desde: string, hacia: string, cantidad: number }[] = [];
  const deudores = participantes.filter(p => p.balanceTotal < 0).sort((a, b) => a.balanceTotal - b.balanceTotal);
  const acreedores = participantes.filter(p => p.balanceTotal > 0).sort((a, b) => b.balanceTotal - a.balanceTotal);

  let iDeudor = 0;
  let iAcreedor = 0;

  while (iDeudor < deudores.length && iAcreedor < acreedores.length) {
    const deudor = deudores[iDeudor];
    const acreedor = acreedores[iAcreedor];
    const cantidad = Math.min(Math.abs(deudor.balanceTotal), acreedor.balanceTotal);

    if (cantidad > 0) {
      transferencias.push({
        desde: deudor.nombre,
        hacia: acreedor.nombre,
        cantidad: Number(cantidad.toFixed(2))
      });

      deudor.balanceTotal += cantidad;
      acreedor.balanceTotal -= cantidad;
    }

    if (Math.abs(deudor.balanceTotal) < 0.01) iDeudor++;
    if (Math.abs(acreedor.balanceTotal) < 0.01) iAcreedor++;
  }

  return transferencias;
}

// Ejemplo de uso:
// Agregar 10 participantes
agregarParticipante('Juan');
agregarParticipante('Marcos');
agregarParticipante('Ana');
agregarParticipante('Sofía');
agregarParticipante('Pedro');
agregarParticipante('Lucía');
agregarParticipante('Jorge');
agregarParticipante('Martín');
agregarParticipante('Carla');
agregarParticipante('Laura');

// Agregar compras: tres participantes compran dos o más cosas, dos no compran nada
listaDeParticipantes[0].agregarCompra('Carne', 2000); 
listaDeParticipantes[0].agregarCompra('Carne', 2000);  // Juan compra 1 cosa
listaDeParticipantes[0].agregarCompra('Carne', 2000);  // Juan compra 1 cosa
listaDeParticipantes[1].agregarCompra('Bebida', 1000); // Marcos compra 1 cosa
listaDeParticipantes[2].agregarCompra('Postre', 1500); // Ana compra 2 cosas
listaDeParticipantes[2].agregarCompra('Helado', 1100); // Ana compra otra cosa
listaDeParticipantes[0].agregarCompra('merca', 2000);  // Juan compra 1 cosa

listaDeParticipantes[3].agregarCompra('Ensalada', 800); // Sofía no compra nada
listaDeParticipantes[4].agregarCompra('Queso', 1200);  // Pedro compra 2 cosas
listaDeParticipantes[4].agregarCompra('Vino', 1400);   // Pedro compra otra cosa
listaDeParticipantes[5].agregarCompra('Pan', 500);     // Lucía compra 1 cosa
listaDeParticipantes[6].agregarCompra('Salsa', 3000);   // Jorge compra 2 cosas
listaDeParticipantes[6].agregarCompra('Fruta', 4000);   // Jorge compra otra cosa
// Martín no compra nada
listaDeParticipantes[8].agregarCompra('Chocolate', 300); // Carla compra 1 cosa
listaDeParticipantes[9].agregarCompra('Cerveza', 900);   // Laura compra 1 cosa

// Actualizar participación (algunos no participan en algunos gastos)
listaDeParticipantes[0].actualizarParticipacion('Bebida', false);  // Juan no participó en Bebida
listaDeParticipantes[1].actualizarParticipacion('Carne', false);   // Marcos no participó en Carne

// Assuming the Participante class and related functions are already defined

// Test adding participants
console.log("Adding participants:");
agregarParticipante("Alice");
agregarParticipante("Bob");
agregarParticipante("Charlie");

// Test editing a participant
console.log("\nEditing participant:");
const editResult = editarParticipante(2, "Bobby");
console.log("Edit successful:", editResult);

// Test editing a non-existent participant
console.log("\nTrying to edit a non-existent participant:");
const failedEditResult = editarParticipante(10, "David");
console.log("Edit successful:", failedEditResult);

// Test deleting a participant
console.log("\nDeleting participant:");
const deleteResult = eliminarParticipante(3);
console.log("Delete successful:", deleteResult);

// Test deleting a non-existent participant
console.log("\nTrying to delete a non-existent participant:");
const failedDeleteResult = eliminarParticipante(20);
console.log("Delete successful:", failedDeleteResult);

// Actualizar participación (algunos no participan en algunos gastos)
modificarParticipacion(2, 'Bebida', false);  //  boby no participó en Bebida


modificarParticipacion(1, 'Carne', false);   // Juan no participó en Carne

// Aplicar las compras a los participantes
aplicarComprasAParticipantes();




console.log('\nParticipantes con sus totales y balances:');
listaDeParticipantes.forEach(p => {
console.log(`${p.nombre}:`);
console.log(`  Compras realizadas: ${JSON.stringify(p.compras)}`);
console.log(`  Participación en compras: ${JSON.stringify(Object.fromEntries(p.participa))}`);
console.log(`  Total a poner: ${p.totalAPoner.toFixed(2)}`);
console.log(`  Balance total: ${p.balanceTotal.toFixed(2)}`);
console.log(`  Interpretación: ${p.balanceTotal >= 0 ? 'Le deben' : 'Debe'} ${Math.abs(p.balanceTotal).toFixed(2)}`);
});

console.log('\nRepartición de pagos:');
const transferencias = repartir(listaDeParticipantes);
transferencias.forEach(t => {
console.log(`${t.desde} debe pagar ${t.cantidad.toFixed(2)} a ${t.hacia}`);
});


console.log(transferencias);




// Aplicar las compras a los participantes
aplicarComprasAParticipantes();
repartir(listaDeParticipantes);
//calculkar cuentas 
const { totalCuenta, totalesPorParticipante } = calcularDivisionCuenta();

console.log('Total de la cuenta:', totalCuenta);
console.log('División por participante:');
totalesPorParticipante.forEach((total, nombre) => {
console.log(`${nombre}: ${total.toFixed(2)}`);
});

calcularDivisionCuenta();

console.log(listaDeParticipantes);
console.log(transferencias);



// ... (código anterior sin cambios)

export const historialDeCuentas: { id: number, nombre: string, fecha: string, cuenta: { totalCuenta: number, totalesPorParticipante: Map<string, number> } }[] = [];

export function guardarDivisionCuenta(nombre: string) {
  const fecha = new Date().toLocaleString();
  const { totalCuenta, totalesPorParticipante } = calcularDivisionCuenta();

  const nuevaCuenta = {
    id: historialDeCuentas.length > 0 ? historialDeCuentas[historialDeCuentas.length - 1].id + 1 : 1,
    nombre: nombre,
    fecha: fecha,
    cuenta: { totalCuenta, totalesPorParticipante },
  };

  historialDeCuentas.push(nuevaCuenta);

  if (historialDeCuentas.length > 10) {
    historialDeCuentas.shift();
  }

  console.log(`Cuenta guardada: ${nuevaCuenta.id}, Nombre: ${nuevaCuenta.nombre}, Fecha: ${nuevaCuenta.fecha}`);
}

export function reiniciarCuentaActual() {
  // Guardar la cuenta actual en el historial antes de reiniciar
  if (listaDeParticipantes.length > 0) {
    guardarDivisionCuenta("Cuenta anterior");
  }

  // Reiniciar la lista de participantes
  listaDeParticipantes.length = 0;

  // Reiniciar el contador de ID
  asignarId = 1;

  console.log("La cuenta actual ha sido reiniciada. Una nueva cuenta está lista para ser iniciada.");
}


// Función para cargar una compra guardada
export function cargarCompraPorId(id: number) {
  const compraEncontrada = historialDeCuentas.find(compra => compra.id === id);
  
  if (compraEncontrada) {
      return compraEncontrada;
  } else {
      throw new Error(`No se encontró ninguna compra con el id: ${id}`);
  }
}

// Ejemplo de uso
try {
  const compra = cargarCompraPorId(1); // Cambia el 1 por el id que deseas cargar
  console.log('Compra cargada:', compra);
} catch (error) {
  console.error(error.message);
}