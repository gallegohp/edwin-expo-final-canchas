import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { globalStyles, colors } from '../styles/globalStyles';

export default function InicioScreen() {
  const { canchas, reservas, finanzas, torneos } = useAppContext();

  const totalIngresos = finanzas
    .filter(f => f.tipo === 'ingreso')
    .reduce((sum, f) => sum + f.monto, 0);
  const totalGastos = finanzas
    .filter(f => f.tipo === 'gasto')
    .reduce((sum, f) => sum + f.monto, 0);
  const balance = totalIngresos - totalGastos;

  const canchasDisponibles = canchas.filter(c => !c.enMantenimiento).length;
  const canchasMantenimiento = canchas.filter(c => c.enMantenimiento).length;

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={[globalStyles.title, { fontSize: 24, textAlign: 'center' }]}>Dashboard</Text>
      
      <View style={styles.cardResumen}>
        <Text style={styles.cardTitle}>Resumen Financiero</Text>
        <View style={styles.fila}>
          <Text style={styles.label}>Ingresos:</Text>
          <Text style={styles.valor}>${totalIngresos}</Text>
        </View>
        <View style={styles.fila}>
          <Text style={styles.label}>Gastos:</Text>
          <Text style={styles.valor}>${totalGastos}</Text>
        </View>
        <View style={[styles.fila, { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 5, paddingTop: 5 }]}>
          <Text style={[styles.label, { fontWeight: 'bold' }]}>Balance:</Text>
          <Text style={[styles.valor, { color: balance >= 0 ? colors.primary : colors.danger }]}>${balance}</Text>
        </View>
      </View>

      <View style={styles.cardResumen}>
        <Text style={styles.cardTitle}>Canchas</Text>
        <View style={styles.fila}>
          <Text style={styles.label}>Total:</Text>
          <Text style={styles.valor}>{canchas.length}</Text>
        </View>
        <View style={styles.fila}>
          <Text style={styles.label}>Disponibles:</Text>
          <Text style={styles.valor}>{canchasDisponibles}</Text>
        </View>
        <View style={styles.fila}>
          <Text style={styles.label}>En mantenimiento:</Text>
          <Text style={styles.valor}>{canchasMantenimiento}</Text>
        </View>
      </View>

      <View style={styles.cardResumen}>
        <Text style={styles.cardTitle}>Reservas</Text>
        <Text style={styles.valor}>{reservas.length} reservas registradas</Text>
      </View>

      <View style={styles.cardResumen}>
        <Text style={styles.cardTitle}>Torneos</Text>
        <Text style={styles.valor}>{torneos.length} torneos activos</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardResumen: {
    ...globalStyles.card,
    marginVertical: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  label: { fontSize: 16, color: colors.textLight },
  valor: { fontSize: 16, fontWeight: 'bold', color: colors.text },
});