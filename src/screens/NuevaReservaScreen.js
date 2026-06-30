import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { globalStyles, colors } from '../styles/globalStyles';
import Boton from '../components/Boton';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NuevaReservaScreen({ navigation }) {
  const { canchas, agregarReserva } = useAppContext();
  const [canchaId, setCanchaId] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState(10); // 1-12
  const [minuto, setMinuto] = useState(0); // 0 o 30
  const [periodo, setPeriodo] = useState('AM'); // 'AM' o 'PM'
  const [duracion, setDuracion] = useState(60); // minutos
  const [precio, setPrecio] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

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
    // Construir hora en formato HH:MM (24h)
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
      duracion: duracion,
      precio: parseFloat(precio),
    });
    navigation.goBack();
  };

  // Botones para horas (1-12)
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
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.label}>Cancha</Text>
      <View style={styles.pickerContainer}>
        {canchas.map(c => (
          <Boton
            key={c.id}
            title={c.nombre + (c.enMantenimiento ? ' (Mant.)' : '')}
            type={canchaId === c.id ? 'primary' : 'secondary'}
            onPress={() => setCanchaId(c.id)}
            style={{ margin: 2 }}
            disabled={c.enMantenimiento}
          />
        ))}
      </View>

      <Text style={globalStyles.label}>Nombre del Cliente</Text>
      <TextInput style={globalStyles.input} value={nombreCliente} onChangeText={setNombreCliente} />

      <Text style={globalStyles.label}>Fecha</Text>
      <Boton title={fecha.toLocaleDateString()} onPress={() => setShowDatePicker(true)} type="secondary" />
      {showDatePicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setFecha(selectedDate);
          }}
        />
      )}

      <Text style={globalStyles.label}>Hora</Text>
      {renderHourButtons()}
      <View style={styles.periodContainer}>
        <Boton
          title="AM"
          type={periodo === 'AM' ? 'primary' : 'secondary'}
          onPress={() => setPeriodo('AM')}
          style={{ flex: 1, marginRight: 8 }}
        />
        <Boton
          title="PM"
          type={periodo === 'PM' ? 'primary' : 'secondary'}
          onPress={() => setPeriodo('PM')}
          style={{ flex: 1 }}
        />
      </View>
      <View style={styles.minuteContainer}>
        <Boton
          title=":00"
          type={minuto === 0 ? 'primary' : 'secondary'}
          onPress={() => setMinuto(0)}
          style={{ flex: 1, marginRight: 8 }}
        />
        <Boton
          title=":30"
          type={minuto === 30 ? 'primary' : 'secondary'}
          onPress={() => setMinuto(30)}
          style={{ flex: 1 }}
        />
      </View>

      <Text style={globalStyles.label}>Duración (minutos)</Text>
      <View style={styles.duracionContainer}>
        {[30, 60, 90, 120].map(d => (
          <Boton
            key={d}
            title={`${d}'`}
            type={duracion === d ? 'primary' : 'secondary'}
            onPress={() => setDuracion(d)}
            style={{ flex: 1, marginHorizontal: 4 }}
          />
        ))}
      </View>

      <Text style={globalStyles.label}>Precio</Text>
      <TextInput style={globalStyles.input} value={precio} onChangeText={setPrecio} keyboardType="numeric" />

      <Boton title="Guardar Reserva" onPress={guardar} style={{ marginTop: 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pickerContainer: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 6 },
  hourGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  hourButton: {
    width: '23%',
    paddingVertical: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
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
  minuteContainer: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  duracionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
});