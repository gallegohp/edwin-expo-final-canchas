import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { globalStyles, colors } from '../styles/globalStyles';
import { getSemana, formatearFecha } from '../utils/helpers';
import Boton from '../components/Boton';
import ReservaCard from '../components/ReservaCard';

export default function ReservasScreen({ navigation }) {
  const { reservas } = useAppContext();
  const [fechaActual, setFechaActual] = useState(new Date());
  const semana = getSemana(fechaActual);

  const reservasDelDia = (dia) => {
    const fechaStr = dia.toISOString().split('T')[0];
    return reservas.filter(r => r.fecha === fechaStr);
  };

  const cambiarSemana = (dias) => {
    const nueva = new Date(fechaActual);
    nueva.setDate(nueva.getDate() + dias);
    setFechaActual(nueva);
  };

  return (
    <View style={globalStyles.container}>
      <Boton title="Nueva Reserva" onPress={() => navigation.navigate('NuevaReserva')} style={{ marginBottom: 10 }} />
      <View style={styles.navegacionSemana}>
        <TouchableOpacity onPress={() => cambiarSemana(-7)}>
          <Text style={styles.flecha}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.semanaTexto}>
          Semana del {formatearFecha(semana[0])} al {formatearFecha(semana[6])}
        </Text>
        <TouchableOpacity onPress={() => cambiarSemana(7)}>
          <Text style={styles.flecha}>▶</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={semana}
        keyExtractor={(item) => item.toISOString()}
        renderItem={({ item }) => {
          const resDia = reservasDelDia(item);
          const fechaStr = item.toISOString().split('T')[0];
          return (
            <View style={styles.diaContainer}>
              <Text style={styles.diaTitulo}>{formatearFecha(item)}</Text>
              {resDia.length === 0 ? (
                <Text style={styles.sinReservas}>Sin reservas</Text>
              ) : (
                resDia.map(r => <ReservaCard key={r.id} reserva={r} />)
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  navegacionSemana: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  flecha: { fontSize: 28, color: colors.primary, paddingHorizontal: 10 },
  semanaTexto: { fontSize: 16, fontWeight: 'bold' },
  diaContainer: {
    marginVertical: 6,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  diaTitulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  sinReservas: { color: '#888', fontStyle: 'italic' },
});