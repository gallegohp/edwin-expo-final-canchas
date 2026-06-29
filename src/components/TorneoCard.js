import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import Boton from './Boton';

export default function TorneoCard({ torneo, onVer }) {
  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.title}>{torneo.nombre}</Text>
      <Text style={globalStyles.subtitle}>Equipos: {torneo.equipos?.length || 0}</Text>
      <Text style={globalStyles.subtitle}>Estado: {torneo.estado || 'Pendiente'}</Text>
      <Boton title="Ver Torneo" onPress={onVer} type="primary" />
    </View>
  );
}