import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, globalStyles } from '../styles/globalStyles';
import Boton from './Boton';
import { formatCurrency } from '../utils/helpers';

export default function CanchaCard({ cancha, onPress, onMantenimiento, onDelete }) {
  return (
    <View style={[globalStyles.card, styles.card]}>
      <Text style={globalStyles.title}>{cancha.nombre}</Text>
      <Text style={globalStyles.subtitle}>📍 {cancha.ubicacion || 'No especificada'}</Text>
      <Text style={globalStyles.subtitle}>💰 {formatCurrency(cancha.precioHora || 0)} / hora</Text>
      <Text style={globalStyles.subtitle}>👥 Capacidad: {cancha.capacidad || 'N/A'} personas</Text>
      {cancha.descripcion ? <Text style={globalStyles.subtitle}>📝 {cancha.descripcion}</Text> : null}
      <Text style={[globalStyles.subtitle, { color: cancha.enMantenimiento ? colors.danger : colors.primary }]}>
        {cancha.enMantenimiento ? '🚧 En mantenimiento' : '✅ Disponible'}
      </Text>
      {cancha.fechaMantenimiento && (
        <Text style={globalStyles.subtitle}>🔧 Último mantenimiento: {new Date(cancha.fechaMantenimiento).toLocaleDateString()}</Text>
      )}
      <View style={styles.actions}>
        <Boton title="Editar" onPress={onPress} type="primary" />
        <Boton title={cancha.enMantenimiento ? 'Finalizar Mant.' : 'Mantenimiento'} onPress={onMantenimiento} type="secondary" />
        <Boton title="Eliminar" onPress={onDelete} type="danger" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 0 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
});