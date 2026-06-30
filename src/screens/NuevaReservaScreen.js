import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Alert, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { globalStyles, colors } from '../styles/globalStyles';
import Boton from '../components/Boton';
import { Calendar } from 'react-native-calendars';

export default function NuevaReservaScreen({ navigation }) {
  const { canchas, agregarReserva } = useAppContext();
  const [canchaId, setCanchaId] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState(10);
  const [minuto, setMinuto] = useState(0);
  const [periodo, setPeriodo] = useState('AM');
  const [duracion, setDuracion] = useState(60);
  const [precio, setPrecio] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  // Precio sugerido según cancha
  useEffect(() => {
    const cancha = canchas.find(c => c.id === canchaId);
    if (cancha) {
      setPrecio(cancha.precioHora?.toString() || '');
    }
  }, [canchaId, canchas]);

  const guardar = () => {
    if (!canchaId || !nombreCliente.trim() || !fecha) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    let hora24 = hora;
    if (periodo === 'PM' && hora !== 12) hora24 += 12;
    if (periodo === 'AM' && hora === 12) hora24 = 0;
    const horaStr = `${String(hora24).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
    const fechaStr = fecha.toISOString().split('T')[0];
    agregarReserva({
      canchaId,
      nombreCliente: nombreCliente.trim(),
      fecha: fechaStr,
      hora: horaStr,
      duracion,
      precio: parseFloat(precio),
    });
    navigation.goBack();
  };

  // Formatear fecha
  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Botones de hora (1-12)
  const renderHourButtons = () => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    return (
      <View style={styles.hourGrid}>
        {hours.map(h => (
          <TouchableOpacity
            key={h}
            style={[styles.hourButton, hora === h && styles.hourButtonSelected]}
            onPress={() => setHora(h)}
          >
            <Text style={[styles.hourText, hora === h && styles.hourTextSelected]}>{h}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>📋 Nueva Reserva</Text>

      {/* Selección de cancha */}
      <Text style={globalStyles.label}>🏟️ Cancha</Text>
      <View style={styles.pickerContainer}>
        {canchas.map(c => (
          <TouchableOpacity
            key={c.id}
            style={[styles.canchabutton, canchaId === c.id && styles.canchabuttonSelected]}
            onPress={() => setCanchaId(c.id)}
            disabled={c.enMantenimiento}
          >
            <Text style={[styles.canchabuttonText, canchaId === c.id && styles.canchabuttonTextSelected]}>
              {c.nombre} {c.enMantenimiento ? '🔧' : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Nombre cliente */}
      <Text style={globalStyles.label}>👤 Cliente</Text>
      <TextInput
        style={[globalStyles.input, styles.inputModern]}
        value={nombreCliente}
        onChangeText={setNombreCliente}
        placeholder="Nombre del cliente"
        placeholderTextColor="#aaa"
      />

      {/* Fecha con calendario */}
      <Text style={globalStyles.label}>📅 Fecha</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowCalendar(true)}>
        <Text style={styles.dateButtonText}>{formatDate(fecha)}</Text>
      </TouchableOpacity>

      <Modal visible={showCalendar} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Calendar
              onDayPress={(day) => {
                setFecha(new Date(day.dateString));
                setShowCalendar(false);
              }}
              markedDates={{
                [fecha.toISOString().split('T')[0]]: { selected: true, selectedColor: colors.primary }
              }}
              theme={{
                selectedDayBackgroundColor: colors.primary,
                todayTextColor: colors.primary,
                arrowColor: colors.primary,
              }}
            />
            <Boton title="Cerrar" type="secondary" onPress={() => setShowCalendar(false)} style={{ marginTop: 10 }} />
          </View>
        </View>
      </Modal>

      {/* Hora */}
      <Text style={globalStyles.label}>🕒 Hora</Text>
      {renderHourButtons()}
      <View style={styles.periodContainer}>
        <TouchableOpacity
          style={[styles.periodButton, periodo === 'AM' && styles.periodButtonSelected]}
          onPress={() => setPeriodo('AM')}
        >
          <Text style={[styles.periodText, periodo === 'AM' && styles.periodTextSelected]}>AM</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, periodo === 'PM' && styles.periodButtonSelected]}
          onPress={() => setPeriodo('PM')}
        >
          <Text style={[styles.periodText, periodo === 'PM' && styles.periodTextSelected]}>PM</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.minuteContainer}>
        <TouchableOpacity
          style={[styles.minuteButton, minuto === 0 && styles.minuteButtonSelected]}
          onPress={() => setMinuto(0)}
        >
          <Text style={[styles.minuteText, minuto === 0 && styles.minuteTextSelected]}>:00</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.minuteButton, minuto === 30 && styles.minuteButtonSelected]}
          onPress={() => setMinuto(30)}
        >
          <Text style={[styles.minuteText, minuto === 30 && styles.minuteTextSelected]}>:30</Text>
        </TouchableOpacity>
      </View>

      {/* Duración */}
      <Text style={globalStyles.label}>⏱️ Duración</Text>
      <View style={styles.duracionContainer}>
        {[30, 60, 90, 120].map(d => (
          <TouchableOpacity
            key={d}
            style={[styles.duracionButton, duracion === d && styles.duracionButtonSelected]}
            onPress={() => setDuracion(d)}
          >
            <Text style={[styles.duracionText, duracion === d && styles.duracionTextSelected]}>{d}'</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Precio */}
      <Text style={globalStyles.label}>💰 Precio</Text>
      <TextInput
        style={[globalStyles.input, styles.inputModern]}
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
        placeholder="0.00"
        placeholderTextColor="#aaa"
      />

      <Boton title="✅ Guardar Reserva" onPress={guardar} style={styles.saveButton} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 6,
  },
  canchabutton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
    margin: 4,
  },
  canchabuttonSelected: {
    backgroundColor: colors.primary,
  },
  canchabuttonText: {
    fontSize: 14,
    color: '#333',
  },
  canchabuttonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputModern: {
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    borderWidth: 0,
    paddingVertical: 12,
  },
  dateButton: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
  },
  hourGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  hourButton: {
    width: '23%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    marginVertical: 4,
  },
  hourButtonSelected: {
    backgroundColor: colors.primary,
  },
  hourText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  hourTextSelected: {
    color: '#fff',
  },
  periodContainer: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  periodButtonSelected: {
    backgroundColor: colors.primary,
  },
  periodText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  periodTextSelected: {
    color: '#fff',
  },
  minuteContainer: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  minuteButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  minuteButtonSelected: {
    backgroundColor: colors.primary,
  },
  minuteText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  minuteTextSelected: {
    color: '#fff',
  },
  duracionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  duracionButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  duracionButtonSelected: {
    backgroundColor: colors.primary,
  },
  duracionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  duracionTextSelected: {
    color: '#fff',
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 12,
  },
});