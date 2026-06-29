import React from 'react';
import { View, FlatList, Text, StyleSheet, Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { globalStyles } from '../styles/globalStyles';
import Boton from '../components/Boton';
import TorneoCard from '../components/TorneoCard';

export default function TorneosScreen({ navigation }) {
  const { torneos, eliminarTorneo } = useAppContext();

  const verTorneo = (id) => {
    Alert.alert('Ver torneo', 'Funcionalidad en desarrollo');
  };

  return (
    <View style={globalStyles.container}>
      <Boton title="Crear Torneo" onPress={() => navigation.navigate('NuevoTorneo')} style={{ marginBottom: 10 }} />
      <FlatList
        data={torneos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TorneoCard torneo={item} onVer={() => verTorneo(item.id)} />
        )}
        ListEmptyComponent={<Text>No hay torneos.</Text>}
      />
    </View>
  );
}