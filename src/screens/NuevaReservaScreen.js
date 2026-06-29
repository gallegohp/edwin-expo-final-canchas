import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Alert, StyleSheet } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { globalStyles, colors } from '../styles/globalStyles';
import Boton from '../components/Boton';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NuevaReservaScreen({ navigation }) {
  const { canchas, agregarReserva } = useAppContext();
  const [canchaId, setCanchaId] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState('10:00');
  const [duracion, setDuracion] = useState('60');
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
    if (!canchaId || !nombreCliente.trim() || !fecha || !hora || !duracion || !precio) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    const fechaStr = fecha.toISOString().split('T')[0];
    agregarReserva({
      canchaId,
      nombreCliente: nombreCliente.trim(),
      fecha: fechaStr,
      hora,
      duracion: parseInt(duracion),
      precio: parseFloat(precio),
    });
    navigation.goBack();
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
      <Text style={globalStyles.label}>Hora (ej. 10:00)</Text>
      <TextInput style={globalStyles.input} value={hora} onChangeText={setHora} />
      <Text style={globalStyles.label}>Duración (minutos)</Text>
      <TextInput style={globalStyles.input} value={duracion} onChangeText={setDuracion} keyboardType="numeric" />
      <Text style={globalStyles.label}>Precio</Text>
      <TextInput style={globalStyles.input} value={precio} onChangeText={setPrecio} keyboardType="numeric" />
      <Boton title="Guardar Reserva" onPress={guardar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pickerContainer: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 6 },
});