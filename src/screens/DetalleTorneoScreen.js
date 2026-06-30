import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { globalStyles, colors } from '../styles/globalStyles';
import Boton from '../components/Boton';

export default function DetalleTorneoScreen({ route, navigation }) {
  const { torneoId } = route.params;
  const { torneos, actualizarTorneo } = useAppContext();
  const torneo = torneos.find(t => t.id === torneoId);
  if (!torneo) {
    return <View><Text>Torneo no encontrado</Text></View>;
  }

  const [rondas, setRondas] = useState(torneo.rondas || []);
  const [editandoPartido, setEditandoPartido] = useState(null); // { rondaIndex, partidoIndex }

  // Función para actualizar resultado de un partido
  const actualizarResultado = (rondaIdx, partidoIdx, goles1, goles2) => {
    const nuevasRondas = [...rondas];
    const partido = nuevasRondas[rondaIdx][partidoIdx];
    partido.goles1 = goles1;
    partido.goles2 = goles2;
    // Determinar ganador
    if (goles1 > goles2) partido.ganador = partido.equipo1;
    else if (goles2 > goles1) partido.ganador = partido.equipo2;
    else if (goles1 === goles2 && goles1 !== null && goles2 !== null) {
      // Empate, podríamos pedir penales o sorteo, pero simplificamos: gana equipo1
      partido.ganador = partido.equipo1;
    }
    // Si hay ganador y es un partido con equipo2 null (descanso), ya está asignado
    setRondas(nuevasRondas);
    // Guardar en el contexto (persistencia)
    actualizarTorneo(torneo.id, { rondas: nuevasRondas });
  };

  // Avanzar a la siguiente ronda (rellenar participantes)
  const avanzarRonda = () => {
    // Tomar los ganadores de la última ronda
    const ultimaRonda = rondas[rondas.length - 1];
    const ganadores = ultimaRonda.map(p => p.ganador).filter(g => g !== null && g !== undefined);
    if (ganadores.length <= 1) {
      Alert.alert('Torneo finalizado', `El campeón es ${ganadores[0]}`);
      return;
    }
    // Crear nueva ronda con los ganadores
    const nuevaRonda = [];
    for (let i = 0; i < ganadores.length; i += 2) {
      if (i + 1 < ganadores.length) {
        nuevaRonda.push({ equipo1: ganadores[i], equipo2: ganadores[i+1], ganador: null });
      } else {
        nuevaRonda.push({ equipo1: ganadores[i], equipo2: null, ganador: ganadores[i] });
      }
    }
    const nuevasRondas = [...rondas, nuevaRonda];
    setRondas(nuevasRondas);
    actualizarTorneo(torneo.id, { rondas: nuevasRondas });
  };

  const renderPartido = (partido, rondaIdx, partidoIdx) => {
    const esDescanso = partido.equipo2 === null;
    const tieneResultado = partido.goles1 !== undefined && partido.goles2 !== undefined;
    return (
      <View key={partidoIdx} style={styles.partidoCard}>
        <Text style={styles.equipoNombre}>{partido.equipo1 || '?'}</Text>
        {esDescanso ? (
          <Text style={styles.descanso}>DESCANSA</Text>
        ) : (
          <>
            <Text style={styles.equipoNombre}>{partido.equipo2 || '?'}</Text>
            {tieneResultado ? (
              <Text style={styles.resultado}>
                {partido.goles1} - {partido.goles2}
              </Text>
            ) : (
              <Boton
                title="Ingresar resultado"
                type="secondary"
                onPress={() => setEditandoPartido({ rondaIdx, partidoIdx })}
                style={{ marginTop: 4 }}
              />
            )}
            {partido.ganador && <Text style={styles.ganador}>Ganador: {partido.ganador}</Text>}
          </>
        )}
      </View>
    );
  };

  // Si hay un partido en edición, mostramos un modal simple (usamos Alert para ingresar goles)
  // Para simplificar, usaremos prompts con Alert, pero es mejor usar un modal.
  // Implementaré una solución simple con Alert y TextInput (pero ya que queremos evitar cajas de texto, usaremos botones + y -)
  // Sin embargo, para no complicar, usaré Alert con dos inputs numéricos (es aceptable).
  // O mejor, creamos un mini modal con botones + y -
  // Por simplicidad, mostraré un prompt (aunque no es lo más amigable, pero funcional)
  // Podemos mejorar después.

  // Usaré un estado local para mostrar un modal simple con dos contadores
  const [modalVisible, setModalVisible] = useState(false);
  const [goles1, setGoles1] = useState(0);
  const [goles2, setGoles2] = useState(0);
  const [editando, setEditando] = useState(null);

  const abrirModalResultado = (rondaIdx, partidoIdx) => {
    const partido = rondas[rondaIdx][partidoIdx];
    setGoles1(0);
    setGoles2(0);
    setEditando({ rondaIdx, partidoIdx });
    setModalVisible(true);
  };

  const guardarResultadoModal = () => {
    if (editando) {
      actualizarResultado(editando.rondaIdx, editando.partidoIdx, goles1, goles2);
      setModalVisible(false);
      setEditando(null);
    }
  };

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={[globalStyles.title, { textAlign: 'center' }]}>{torneo.nombre}</Text>
      <Text style={styles.subtitle}>Estado: {torneo.estado}</Text>

      {rondas.map((ronda, rondaIdx) => (
        <View key={rondaIdx} style={styles.rondaContainer}>
          <Text style={styles.rondaTitulo}>Ronda {rondaIdx + 1}</Text>
          {ronda.map((partido, partidoIdx) => renderPartido(partido, rondaIdx, partidoIdx))}
        </View>
      ))}

      {rondas.length > 0 && (
        <Boton title="Avanzar Ronda" onPress={avanzarRonda} style={{ marginTop: 16 }} />
      )}

      {/* Modal simple para ingresar goles */}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ingresar resultado</Text>
            <View style={styles.modalRow}>
              <Text>{rondas[editando?.rondaIdx]?.[editando?.partidoIdx]?.equipo1 || 'Equipo1'}</Text>
              <View style={styles.modalCounter}>
                <TouchableOpacity onPress={() => setGoles1(Math.max(0, goles1 - 1))} style={styles.counterBtn}>
                  <Text style={styles.counterText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{goles1}</Text>
                <TouchableOpacity onPress={() => setGoles1(goles1 + 1)} style={styles.counterBtn}>
                  <Text style={styles.counterText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.modalRow}>
              <Text>{rondas[editando?.rondaIdx]?.[editando?.partidoIdx]?.equipo2 || 'Equipo2'}</Text>
              <View style={styles.modalCounter}>
                <TouchableOpacity onPress={() => setGoles2(Math.max(0, goles2 - 1))} style={styles.counterBtn}>
                  <Text style={styles.counterText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{goles2}</Text>
                <TouchableOpacity onPress={() => setGoles2(goles2 + 1)} style={styles.counterBtn}>
                  <Text style={styles.counterText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.modalButtons}>
              <Boton title="Cancelar" type="secondary" onPress={() => setModalVisible(false)} style={{ flex: 1, marginRight: 8 }} />
              <Boton title="Guardar" onPress={guardarResultadoModal} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  subtitle: { fontSize: 16, color: colors.textLight, marginBottom: 12 },
  rondaContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  rondaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.primary,
  },
  partidoCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  equipoNombre: { fontSize: 16, fontWeight: '500' },
  descanso: { fontStyle: 'italic', color: '#888' },
  resultado: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
  ganador: { fontSize: 14, color: colors.secondary, marginTop: 4 },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '85%',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  modalCounter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterBtn: {
    backgroundColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  counterText: { fontSize: 20, fontWeight: 'bold' },
  counterValue: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 12, minWidth: 30, textAlign: 'center' },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
});