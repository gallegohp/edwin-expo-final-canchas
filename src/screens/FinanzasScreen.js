import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { globalStyles, colors } from '../styles/globalStyles';
import Boton from '../components/Boton';

export default function FinanzasScreen() {
  const { finanzas, agregarFinanza } = useAppContext();
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('gasto');

  const agregar = () => {
    if (!concepto.trim() || !monto) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    agregarFinanza({
      tipo,
      concepto: concepto.trim(),
      monto: parseFloat(monto),
      fecha: new Date().toISOString().split('T')[0],
    });
    setConcepto('');
    setMonto('');
  };

  const totalIngresos = finanzas.filter(f => f.tipo === 'ingreso').reduce((s, f) => s + f.monto, 0);
  const totalGastos = finanzas.filter(f => f.tipo === 'gasto').reduce((s, f) => s + f.monto, 0);
  const balance = totalIngresos - totalGastos;

  return (
    <View style={globalStyles.container}>
      <View style={styles.resumen}>
        <Text style={styles.resumenTitle}>Resumen Financiero</Text>
        <View style={styles.fila}>
          <Text>Ingresos:</Text>
          <Text style={{ fontWeight: 'bold', color: colors.primary }}>${totalIngresos}</Text>
        </View>
        <View style={styles.fila}>
          <Text>Gastos:</Text>
          <Text style={{ fontWeight: 'bold', color: colors.danger }}>${totalGastos}</Text>
        </View>
        <View style={[styles.fila, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 5 }]}>
          <Text style={{ fontWeight: 'bold' }}>Balance:</Text>
          <Text style={{ fontWeight: 'bold', color: balance >= 0 ? colors.primary : colors.danger }}>${balance}</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={globalStyles.label}>Concepto</Text>
        <TextInput style={globalStyles.input} value={concepto} onChangeText={setConcepto} />
        <Text style={globalStyles.label}>Monto</Text>
        <TextInput style={globalStyles.input} value={monto} onChangeText={setMonto} keyboardType="numeric" />
        <View style={styles.tipoContainer}>
          <Boton title="Gasto" type={tipo === 'gasto' ? 'primary' : 'secondary'} onPress={() => setTipo('gasto')} style={{ flex: 1 }} />
          <Boton title="Ingreso" type={tipo === 'ingreso' ? 'primary' : 'secondary'} onPress={() => setTipo('ingreso')} style={{ flex: 1 }} />
        </View>
        <Boton title="Agregar" onPress={agregar} />
      </View>

      <FlatList
        data={finanzas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={globalStyles.card}>
            <Text style={{ fontWeight: 'bold' }}>{item.concepto}</Text>
            <Text>Fecha: {item.fecha}</Text>
            <Text style={{ color: item.tipo === 'ingreso' ? colors.primary : colors.danger }}>
              {item.tipo === 'ingreso' ? '+' : '-'} ${item.monto}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text>No hay movimientos.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  resumen: { ...globalStyles.card, marginBottom: 10 },
  resumenTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  fila: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  form: { marginBottom: 10 },
  tipoContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
});