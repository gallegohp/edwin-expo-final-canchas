import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { globalStyles } from '../styles/globalStyles';
import Boton from '../components/Boton';

export default function NuevaCanchaScreen({ route, navigation }) {
  const { canchaId } = route.params || {};
  const { canchas, agregarCancha, actualizarCancha } = useAppContext();
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [precioHora, setPrecioHora] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [capacidad, setCapacidad] = useState('');

  const canchaExistente = canchaId ? canchas.find(c => c.id === canchaId) : null;

  useEffect(() => {
    if (canchaExistente) {
      setNombre(canchaExistente.nombre);
      setUbicacion(canchaExistente.ubicacion || '');
      setPrecioHora(canchaExistente.precioHora?.toString() || '');
      setDescripcion(canchaExistente.descripcion || '');
      setCapacidad(canchaExistente.capacidad?.toString() || '');
    }
  }, [canchaExistente]);

  const guardar = () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    const data = {
      nombre: nombre.trim(),
      ubicacion: ubicacion.trim(),
      precioHora: parseFloat(precioHora) || 0,
      descripcion: descripcion.trim(),
      capacidad: parseInt(capacidad) || 0,
      enMantenimiento: canchaExistente?.enMantenimiento || false,
    };
    if (canchaId) {
      actualizarCancha(canchaId, data);
    } else {
      agregarCancha(data);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.label}>🏟️ Nombre de la cancha *</Text>
      <TextInput style={globalStyles.input} value={nombre} onChangeText={setNombre} />
      <Text style={globalStyles.label}>📍 Ubicación</Text>
      <TextInput style={globalStyles.input} value={ubicacion} onChangeText={setUbicacion} />
      <Text style={globalStyles.label}>💰 Precio por hora</Text>
      <TextInput style={globalStyles.input} value={precioHora} onChangeText={setPrecioHora} keyboardType="numeric" />
      <Text style={globalStyles.label}>📝 Descripción</Text>
      <TextInput style={globalStyles.input} value={descripcion} onChangeText={setDescripcion} multiline />
      <Text style={globalStyles.label}>👥 Capacidad (personas)</Text>
      <TextInput style={globalStyles.input} value={capacidad} onChangeText={setCapacidad} keyboardType="numeric" />
      <Boton title={canchaId ? 'Actualizar' : 'Crear Cancha'} onPress={guardar} />
    </ScrollView>
  );
}