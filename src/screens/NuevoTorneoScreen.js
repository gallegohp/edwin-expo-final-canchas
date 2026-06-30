import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert, StyleSheet } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { globalStyles } from '../styles/globalStyles';
import Boton from '../components/Boton';
import { generarEnfrentamientos } from '../utils/helpers';

export default function NuevoTorneoScreen({ navigation }) {
  const { agregarTorneo } = useAppContext();
  const [nombre, setNombre] = useState('');
  const [equipos, setEquipos] = useState([]);
  const [nombreEquipo, setNombreEquipo] = useState('');

  const agregarEquipo = () => {
    if (nombreEquipo.trim()) {
      if (equipos.length >= 12) {
        Alert.alert('Límite', 'Máximo 12 equipos');
        return;
      }
      setEquipos([...equipos, nombreEquipo.trim()]);
      setNombreEquipo('');
    }
  };

  const eliminarEquipo = (index) => {
    const nuevos = [...equipos];
    nuevos.splice(index, 1);
    setEquipos(nuevos);
  };

  const sortear = () => {
    if (equipos.length < 4) {
      Alert.alert('Error', 'Se necesitan al menos 4 equipos');
      return;
    }
    if (!nombre.trim()) {
      Alert.alert('Error', 'Ingresa un nombre para el torneo');
      return;
    }
    // Generar enfrentamientos usando helper
    const enfrentamientos = generarEnfrentamientos(equipos);
    agregarTorneo({
      nombre: nombre.trim(),
      equipos,
      rondas: enfrentamientos, // Guardamos las rondas completas
      estado: 'En curso',
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.label}>Nombre del Torneo</Text>
      <TextInput style={globalStyles.input} value={nombre} onChangeText={setNombre} />

      <Text style={globalStyles.label}>Agregar Equipos (mínimo 4, máximo 12)</Text>
      <View style={styles.equipoInput}>
        <TextInput
          style={[globalStyles.input, { flex: 1 }]}
          value={nombreEquipo}
          onChangeText={setNombreEquipo}
          placeholder="Nombre del equipo"
        />
        <Boton title="+" onPress={agregarEquipo} style={{ marginLeft: 8 }} />
      </View>
      {equipos.map((eq, idx) => (
        <View key={idx} style={styles.equipoItem}>
          <Text style={styles.equipoNombre}>{eq}</Text>
          <Boton title="X" onPress={() => eliminarEquipo(idx)} type="danger" style={{ paddingHorizontal: 10 }} />
        </View>
      ))}
      <Boton title="Sortear y Crear Torneo" onPress={sortear} style={{ marginTop: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  equipoInput: { flexDirection: 'row', alignItems: 'center' },
  equipoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    padding: 5,
  },
  equipoNombre: { fontSize: 16, fontWeight: '500' },
});