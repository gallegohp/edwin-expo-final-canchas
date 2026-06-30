import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { formatCurrency } from '../utils/helpers';

export default function ReservaCard({ reserva }) {
  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.title}>{reserva.nombreCliente}</Text>
      <Text style={globalStyles.subtitle}>Cancha: {reserva.canchaId}</Text>
      <Text style={globalStyles.subtitle}>Fecha: {new Date(reserva.fecha).toLocaleDateString()}</Text>
      <Text style={globalStyles.subtitle}>Hora: {reserva.hora}</Text>
      <Text style={globalStyles.subtitle}>Duración: {reserva.duracion} min</Text>
      <Text style={globalStyles.subtitle}>Precio: {formatCurrency(reserva.precio)}</Text>
    </View>
  );
}