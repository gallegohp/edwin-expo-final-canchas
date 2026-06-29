import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { globalStyles } from '../styles/globalStyles';
import CanchaCard from '../components/CanchaCard';
import Boton from '../components/Boton';

export default function CanchasScreen({ navigation }) {
  const { canchas, actualizarCancha, eliminarCancha } = useAppContext();

  const toggleMantenimiento = (id) => {
    const cancha = canchas.find(c => c.id === id);
    if (cancha) {
      actualizarCancha(id, {
        enMantenimiento: !cancha.enMantenimiento,
        fechaMantenimiento: !cancha.enMantenimiento ? new Date().toISOString() : undefined,
      });
    }
  };

  return (
    <View style={globalStyles.container}>
      <Boton title="Agregar Cancha" onPress={() => navigation.navigate('NuevaCancha')} style={{ marginBottom: 10 }} />
      <FlatList
        data={canchas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CanchaCard
            cancha={item}
            onPress={() => navigation.navigate('NuevaCancha', { canchaId: item.id })}
            onMantenimiento={() => toggleMantenimiento(item.id)}
            onDelete={() => eliminarCancha(item.id)}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay canchas registradas.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#888' },
});