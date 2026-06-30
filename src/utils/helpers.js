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

// Genera enfrentamientos para torneo de eliminación directa
export const generarEnfrentamientos = (equipos) => {
  const numEquipos = equipos.length;
  // Mezclar aleatoriamente
  const shuffled = [...equipos];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Determinar número de equipos que pasan directamente (byes)
  const potencia = Math.pow(2, Math.floor(Math.log2(numEquipos)));
  const byes = potencia - numEquipos;

  let rondaActual = [];
  let idx = 0;
  // Asignar byes a los primeros equipos (o los últimos, da igual)
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
  // Ahora rondaActual tiene partidos con posible descanso
  // Pero necesitamos que el número de partidos sea potencia de 2, así que los byes se consideran victorias automáticas
  // Para simplificar, marcaremos los partidos con equipo2 === null como "Descansa" y ganador será el equipo1

  const rondas = [rondaActual];
  // Generar rondas posteriores
  let participantes = rondaActual.map(p => p.equipo1).filter(e => e !== null);
  // Los descansos ya están en participantes
  while (participantes.length > 1) {
    const nuevaRonda = [];
    for (let i = 0; i < participantes.length; i += 2) {
      if (i + 1 < participantes.length) {
        nuevaRonda.push({ equipo1: participantes[i], equipo2: participantes[i+1], ganador: null });
      } else {
        // Si queda uno solo, pasa directo
        nuevaRonda.push({ equipo1: participantes[i], equipo2: null, ganador: participantes[i] });
      }
    }
    rondas.push(nuevaRonda);
    participantes = nuevaRonda.map(p => p.equipo1).filter(e => e !== null);
    // Si el último partido tiene equipo2 null, su ganador es equipo1
  }
  return rondas;
};