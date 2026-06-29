import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from './AppContext';

export const AppProvider = ({ children }) => {
  const [canchas, setCanchas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [finanzas, setFinanzas] = useState([]);
  const [torneos, setTorneos] = useState([]);

  // Cargar datos al iniciar
  useEffect(() => {
    loadData();
  }, []);

  // Guardar datos cada vez que cambien
  useEffect(() => {
    saveData();
  }, [canchas, reservas, finanzas, torneos]);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem('appData');
      if (stored) {
        const parsed = JSON.parse(stored);
        setCanchas(parsed.canchas || []);
        setReservas(parsed.reservas || []);
        setFinanzas(parsed.finanzas || []);
        setTorneos(parsed.torneos || []);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const saveData = async () => {
    try {
      const data = { canchas, reservas, finanzas, torneos };
      await AsyncStorage.setItem('appData', JSON.stringify(data));
    } catch (error) {
      console.error('Error al guardar datos:', error);
    }
  };

  // Funciones para canchas
  const agregarCancha = (cancha) => {
    setCanchas([...canchas, { ...cancha, id: Date.now().toString() }]);
  };

  const actualizarCancha = (id, datos) => {
    setCanchas(canchas.map(c => c.id === id ? { ...c, ...datos } : c));
  };

  const eliminarCancha = (id) => {
    setCanchas(canchas.filter(c => c.id !== id));
  };

  // Funciones para reservas
  const agregarReserva = (reserva) => {
    const nueva = { ...reserva, id: Date.now().toString() };
    setReservas([...reservas, nueva]);
    // También agregar a finanzas como ingreso
    agregarFinanza({
      tipo: 'ingreso',
      concepto: `Reserva cancha ${reserva.canchaId}`,
      monto: reserva.precio,
      fecha: reserva.fecha,
    });
  };

  // Funciones para finanzas
  const agregarFinanza = (item) => {
    setFinanzas([...finanzas, { ...item, id: Date.now().toString() }]);
  };

  // Funciones para torneos
  const agregarTorneo = (torneo) => {
    setTorneos([...torneos, { ...torneo, id: Date.now().toString() }]);
  };

  const actualizarTorneo = (id, datos) => {
    setTorneos(torneos.map(t => t.id === id ? { ...t, ...datos } : t));
  };

  const eliminarTorneo = (id) => {
    setTorneos(torneos.filter(t => t.id !== id));
  };

  return (
    <AppContext.Provider value={{
      canchas,
      reservas,
      finanzas,
      torneos,
      agregarCancha,
      actualizarCancha,
      eliminarCancha,
      agregarReserva,
      agregarFinanza,
      agregarTorneo,
      actualizarTorneo,
      eliminarTorneo,
    }}>
      {children}
    </AppContext.Provider>
  );
};