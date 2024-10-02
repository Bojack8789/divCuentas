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

// Tipo para el historial de cuentas
type HistorialCuenta = {
  id: number;
  nombre: string;
  fecha: string;
  cuenta: {
    totalCuenta: number;
    totalesPorParticipante: { [key: string]: number };
    comprasPorParticipante: { [key: string]: [string, number][] };
  };
};

// Clave para el almacenamiento local
const STORAGE_KEY = 'historialDeCuentas';

// Función para guardar el historial en el almacenamiento local
function guardarHistorialEnStorage(historial: HistorialCuenta[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(historial));
}

// Función para cargar el historial desde el almacenamiento local
function cargarHistorialDesdeStorage(): HistorialCuenta[] {
  const historialString = localStorage.getItem(STORAGE_KEY);
  return historialString ? JSON.parse(historialString) : [];
}

// Modificar la variable historialDeCuentas para que se cargue desde el almacenamiento local
export let historialDeCuentas: HistorialCuenta[] = cargarHistorialDesdeStorage();

export function guardarDivisionCuenta(nombre: string) {
  const fecha = new Date().toLocaleString();
  const { totalCuenta, totalesPorParticipante } = calcularDivisionCuenta();

  const comprasPorParticipante: { [key: string]: [string, number][] } = {};

  listaDeParticipantes.forEach(participante => {
    comprasPorParticipante[participante.nombre] = [...participante.compras];
  });

  const nuevaCuenta: HistorialCuenta = {
    id: historialDeCuentas.length + 1,
    nombre,
    fecha,
    cuenta: {
      totalCuenta,
      totalesPorParticipante: Object.fromEntries(totalesPorParticipante),
      comprasPorParticipante
    }
    
  };

  historialDeCuentas.push(nuevaCuenta);
  guardarHistorialEnStorage(historialDeCuentas);
  cuentaActualId = nuevaCuenta.id; // Actualizar el ID de la cuenta actual
  console.log(`Cuenta guardada en el historial y almacenamiento local: ${nombre}`);
}

export function cargarCuentaDesdeHistorial(id: number) {
  const registro = historialDeCuentas.find(h => h.id === id);
  if (registro) {
    resetearCuenta();

    const { totalesPorParticipante, comprasPorParticipante } = registro.cuenta;

    Object.entries(totalesPorParticipante).forEach(([nombre, totalCompra]) => {
      const comprasGuardadas = comprasPorParticipante[nombre];

      const nuevoParticipante = new Participante(nombre, asignarId);
      asignarId++;

      if (comprasGuardadas) {
        nuevoParticipante.compras = comprasGuardadas;
      }

      nuevoParticipante.totalAPoner = totalCompra;
      listaDeParticipantes.push(nuevoParticipante);
    });
    cuentaActualId = id; // Actualizar el ID de la cuenta actual

    console.log(`Cuenta cargada desde el historial: ${registro.nombre} con total: ${registro.cuenta.totalCuenta}`);
  }
}



// Función para obtener todo el historial de cuentas
export function obtenerHistorialDeCuentas(): HistorialCuenta[] {
  return historialDeCuentas;
}
export function resetearCuenta() {
  listaDeParticipantes.length = 0;
  // Si no hay participantes en la lista, asignarId empieza en 1; de lo contrario, en el ID más alto + 1
  asignarId = listaDeParticipantes.length > 0 ? Math.max(...listaDeParticipantes.map(p => p.id)) + 1 : 1;
}








// Función mejorada para eliminar una cuenta del historial
export function eliminarCuentaDelHistorial(id: number): boolean {
  const indexInicial = historialDeCuentas.findIndex(cuenta => cuenta.id === id);
  if (indexInicial !== -1) {
    historialDeCuentas.splice(indexInicial, 1);
    guardarHistorialEnStorage(historialDeCuentas);
    console.log(`Cuenta con ID ${id} eliminada del historial y almacenamiento local.`);
    return true;
  }
  console.log(`No se encontró una cuenta con ID ${id} en el historial.`);
  return false;
}

// Función para eliminar múltiples cuentas
export function eliminarMultiplesCuentas(ids: number[]): { exitosos: number[], fallidos: number[] } {
  const exitosos: number[] = [];
  const fallidos: number[] = [];

  ids.forEach(id => {
    if (eliminarCuentaDelHistorial(id)) {
      exitosos.push(id);
    } else {
      fallidos.push(id);
    }
  });

  return { exitosos, fallidos };
}

// Función para obtener el historial actual (para propósitos de prueba)
export function obtenerHistorialActual(): HistorialCuenta[] {
  return historialDeCuentas;
}



let cuentaActualId: number | null = null;

export function updateCuentaDelHistorial(): boolean {
  if (cuentaActualId) {
    const indexInicial = historialDeCuentas.findIndex(cuenta => cuenta.id === cuentaActualId);
    if (indexInicial !== -1) {
      const { totalCuenta, totalesPorParticipante } = calcularDivisionCuenta();

      const comprasPorParticipante: { [key: string]: [string, number][] } = {};

      listaDeParticipantes.forEach(participante => {
        comprasPorParticipante[participante.nombre] = [...participante.compras];
      });

      historialDeCuentas[indexInicial].cuenta = {
        totalCuenta,
        totalesPorParticipante: Object.fromEntries(totalesPorParticipante),
        comprasPorParticipante
      };

      guardarHistorialEnStorage(historialDeCuentas);
      console.log(`Cuenta actual con ID ${cuentaActualId} actualizada en el historial y almacenamiento local.`);
      return true;
    }
  }
  console.log('No se encontró una cuenta actual para actualizar.');
  return false;
}