// Generar un ID único simple
export const generarId = () => Date.now().toString();

// Formatear fecha a string legible
export const formatearFecha = (fecha) => {
  const d = new Date(fecha);
  return d.toLocaleDateString('es-ES');
};

// Obtener semana actual (lunes a domingo)
export const getSemana = (fecha = new Date()) => {
  const start = new Date(fecha);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff);
  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    week.push(d);
  }
  return week;
};

// Formatear moneda (COP)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Genera enfrentamientos para torneo de eliminación directa
export const generarEnfrentamientos = (equipos) => {
  const numEquipos = equipos.length;
  const shuffled = [...equipos];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const potencia = Math.pow(2, Math.floor(Math.log2(numEquipos)));
  const byes = potencia - numEquipos;

  let rondaActual = [];
  let idx = 0;
  for (let i = 0; i < numEquipos; i++) {
    if (i < byes) {
      rondaActual.push({ equipo1: shuffled[i], equipo2: null, ganador: null });
    } else {
      if (idx % 2 === 0) {
        rondaActual.push({ equipo1: shuffled[i], equipo2: null, ganador: null });
      } else {
        rondaActual[rondaActual.length - 1].equipo2 = shuffled[i];
      }
      idx++;
    }
  }

  const rondas = [rondaActual];
  let participantes = rondaActual.map(p => p.equipo1).filter(e => e !== null);
  while (participantes.length > 1) {
    const nuevaRonda = [];
    for (let i = 0; i < participantes.length; i += 2) {
      if (i + 1 < participantes.length) {
        nuevaRonda.push({ equipo1: participantes[i], equipo2: participantes[i+1], ganador: null });
      } else {
        nuevaRonda.push({ equipo1: participantes[i], equipo2: null, ganador: participantes[i] });
      }
    }
    rondas.push(nuevaRonda);
    participantes = nuevaRonda.map(p => p.equipo1).filter(e => e !== null);
  }
  return rondas;
};