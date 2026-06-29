import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert, StyleSheet } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { globalStyles } from '../styles/globalStyles';
import Boton from '../components/Boton';

export default function NuevoTorneoScreen({ navigation }) {
  const { agregarTorneo } = useAppContext();
  const [nombre, setNombre] = useState('');
  const [equipos, setEquipos] = useState([]);
  const [nombreEquipo, setNombreEquipo] = useState('');

  const agregarEquipo = () => {
    if (nombreEquipo.trim()) {
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
    if (equipos.length < 2) {
      Alert.alert('Error', 'Se necesitan al menos 2 equipos');
      return;
    }
    const mezclados = [...equipos];
    for (let i = mezclados.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mezclados[i], mezclados[j]] = [mezclados[j], mezclados[i]];
    }
    const enfrentamientos = [];
    for (let i = 0; i < mezclados.length; i += 2) {
      if (i + 1 < mezclados.length) {
        enfrentamientos.push([mezclados[i], mezclados[i + 1]]);
      } else {
        enfrentamientos.push([mezclados[i], 'DESCANSA']);
      }
    }
    if (!nombre.trim()) {
      Alert.alert('Error', 'Ingresa un nombre para el torneo');
      return;
    }
    agregarTorneo({
      nombre: nombre.trim(),
      equipos,
      enfrentamientos,
      estado: 'En curso',
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.label}>Nombre del Torneo</Text>
      <TextInput style={globalStyles.input} value={nombre} onChangeText={setNombre} />

      <Text style={globalStyles.label}>Agregar Equipos</Text>
      <View style={styles.equipoInput}>
        <TextInput style={[globalStyles.input, { flex: 1 }]} value={nombreEquipo} onChangeText={setNombreEquipo} />
        <Boton title="+" onPress={agregarEquipo} style={{ marginLeft: 8 }} />
      </View>
      {equipos.map((eq, idx) => (
        <View key={idx} style={styles.equipoItem}>
          <Text>{eq}</Text>
          <Boton title="X" onPress={() => eliminarEquipo(idx)} type="danger" style={{ paddingHorizontal: 10 }} />
        </View>
      ))}
      <Boton title="Sortear y Crear Torneo" onPress={sortear} style={{ marginTop: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  equipoInput: { flexDirection: 'row', alignItems: 'center' },
  equipoItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 2, paddingHorizontal: 10, backgroundColor: '#eee', borderRadius: 5, padding: 5 },
});