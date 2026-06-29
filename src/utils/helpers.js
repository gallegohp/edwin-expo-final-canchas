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